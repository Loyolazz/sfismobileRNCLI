#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const ROOT_DIR = path.resolve(__dirname, '..');
const API_XML_PATH = path.join(ROOT_DIR, 'api.xml');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'api', 'operations');

const xmlContent = fs.readFileSync(API_XML_PATH, 'utf8');
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

const requestRegex = /(\w+)[^\n]*\n\s*SOAP 1\.1[\s\S]*?<soap:Body>\s*<\1 xmlns="http:\/\/tempori.org"(?:\s*\/>|>([\s\S]*?)<\/\1>)/g;

const operations = [];
let match;
while ((match = requestRegex.exec(xmlContent))) {
  const action = match[1];
  const bodyContent = match[2] || '';
  const requestSnippet = bodyContent
    ? `<${action} xmlns="http://tempori.org">${bodyContent}</${action}>`
    : `<${action} xmlns="http://tempori.org" />`;
  const parsedRequest = parser.parse(requestSnippet)[action];
  const paramsType = buildParamsType(parsedRequest);

  const responseInfo = extractResponseType(action, requestRegex.lastIndex);

  operations.push({
    action,
    paramsType,
    resultType: responseInfo.resultType,
  });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const indexExports = [];

for (const op of operations) {
  const fileName = toFileName(op.action);
  const filePath = path.join(OUTPUT_DIR, `${fileName}.ts`);
  const fileContent = generateOperationFile(op);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  indexExports.push(`export * from './${fileName}';`);
}

const indexPath = path.join(OUTPUT_DIR, 'index.ts');
indexExports.sort();
fs.writeFileSync(indexPath, indexExports.join('\n') + '\n', 'utf8');

function buildParamsType(node) {
  if (!node || typeof node !== 'object') return null;
  const entries = Object.entries(node).filter(([key]) => !key.startsWith('@_'));
  if (entries.length === 0) return null;
  const fields = {};
  for (const [key, value] of entries) {
    fields[key] = buildType(value);
  }
  return { kind: 'object', fields };
}

function extractResponseType(action, startIndex) {
  const responseRegex = new RegExp(String.raw`<${action}Response[^>]*>([\s\S]*?)</${action}Response>`, 'g');
  responseRegex.lastIndex = startIndex;
  const responseMatch = responseRegex.exec(xmlContent);

  if (responseMatch) {
    const responseContent = responseMatch[1];
    const snippet = `<${action}Response xmlns="http://tempori.org">${responseContent}</${action}Response>`;
    const parsed = parser.parse(snippet)[`${action}Response`];
    const resultNode = parsed ? parsed[`${action}Result`] : undefined;
    if (resultNode !== undefined) {
      return { resultType: buildType(resultNode) };
    }
  }

  const selfClosingRegex = new RegExp(String.raw`<${action}Response[^>]*/>`, 'g');
  selfClosingRegex.lastIndex = startIndex;
  if (selfClosingRegex.exec(xmlContent)) {
    return { resultType: { kind: 'unknown' } };
  }

  return { resultType: { kind: 'unknown' } };
}

function buildType(node) {
  if (node == null) return { kind: 'unknown' };

  if (typeof node === 'string') {
    return { kind: 'primitive', type: mapPrimitive(node.trim()) };
  }

  if (Array.isArray(node)) {
    if (node.length === 0) return { kind: 'array', element: { kind: 'unknown' } };
    const elementTypes = node.map(buildType);
    const merged = mergeTypes(elementTypes);
    return { kind: 'array', element: merged };
  }

  if (typeof node === 'object') {
    const entries = Object.entries(node).filter(([key]) => !key.startsWith('@_'));
    if (entries.length === 0) return { kind: 'object', fields: {} };
    const fields = {};
    for (const [key, value] of entries) {
      fields[key] = buildType(value);
    }
    return { kind: 'object', fields };
  }

  return { kind: 'unknown' };
}

function mergeTypes(types) {
  if (types.length === 0) return { kind: 'unknown' };
  let current = types[0];
  for (let i = 1; i < types.length; i += 1) {
    current = mergeTwoTypes(current, types[i]);
  }
  return current;
}

function mergeTwoTypes(a, b) {
  if (a.kind === 'unknown') return b;
  if (b.kind === 'unknown') return a;
  if (a.kind === 'primitive' && b.kind === 'primitive' && a.type === b.type) {
    return a;
  }
  if (a.kind === 'array' && b.kind === 'array') {
    return { kind: 'array', element: mergeTwoTypes(a.element, b.element) };
  }
  if (a.kind === 'object' && b.kind === 'object') {
    const fields = { ...a.fields };
    for (const [key, value] of Object.entries(b.fields)) {
      if (fields[key]) {
        fields[key] = mergeTwoTypes(fields[key], value);
      } else {
        fields[key] = value;
      }
    }
    return { kind: 'object', fields };
  }
  return { kind: 'unknown' };
}

function mapPrimitive(token) {
  const normalized = token.toLowerCase();
  switch (normalized) {
    case 'string':
    case 'datetime':
    case 'base64binary':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'int':
    case 'short':
    case 'decimal':
    case 'double':
      return 'number';
    default:
      return 'string';
  }
}

function renderType(type, indent = 0) {
  if (!type) return 'unknown';

  switch (type.kind) {
    case 'primitive':
      return type.type;
    case 'unknown':
      return 'unknown';
    case 'array': {
      const inner = renderType(type.element, indent);
      if (inner.includes('\n')) {
        return `Array<${inner}>`;
      }
      return `${inner}[]`;
    }
    case 'object': {
      const entries = Object.entries(type.fields || {});
      if (entries.length === 0) {
        return 'Record<string, unknown>';
      }
      const indentStr = '  '.repeat(indent);
      const childIndent = '  '.repeat(indent + 1);
      const props = entries
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${childIndent}${formatPropertyName(key)}: ${renderType(value, indent + 1)};`);
      return `{
${props.join('\n')}
${indentStr}}`;
    }
    default:
      return 'unknown';
  }
}

function formatPropertyName(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function toFileName(action) {
  return action.charAt(0).toLowerCase() + action.slice(1);
}

function generateOperationFile(op) {
  const lines = [];
  lines.push("import { callSoapAction, type SoapRequestOptions } from '../api';");
  lines.push('');

  if (op.paramsType && op.paramsType.kind === 'object' && Object.keys(op.paramsType.fields).length > 0) {
    lines.push(`export type ${op.action}Params = ${renderType(op.paramsType)};`);
    lines.push('');
  }

  const resultTypeName = `${op.action}Result`;
  lines.push(`export type ${resultTypeName} = ${renderType(op.resultType)};`);
  lines.push('');

  const funcName = toFileName(op.action);
  if (op.paramsType && op.paramsType.kind === 'object' && Object.keys(op.paramsType.fields).length > 0) {
    lines.push(`export async function ${funcName}(params: ${op.action}Params, options?: SoapRequestOptions) {`);
    lines.push(`  return callSoapAction<${resultTypeName}>('${op.action}', params, options);`);
    lines.push('}');
  } else {
    lines.push(`export async function ${funcName}(options?: SoapRequestOptions) {`);
    lines.push(`  return callSoapAction<${resultTypeName}>('${op.action}', undefined, options);`);
    lines.push('}');
  }

  lines.push('');
  return lines.join('\n');
}
