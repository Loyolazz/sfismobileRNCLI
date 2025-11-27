import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'sfis.mapaSnapshot';
const SNAPSHOT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const DEFAULT_ZOOM = 13;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export type SnapshotParams = {
  cnpj: string;
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
};

export type SnapshotRequest = SnapshotParams & {
  apiKey: string;
};

export type MapSnapshot = {
  base64: string;
  createdAt: number;
  lat: number;
  lng: number;
  zoom: number;
  width: number;
  height: number;
};

const digitsOnly = (value?: string) => (value ? value.replace(/\D/g, '') : '');

const roundCoord = (value: number) => value.toFixed(5);

const keyFor = ({
  cnpj,
  lat,
  lng,
  zoom,
  width,
  height,
}: Required<SnapshotParams>): string =>
  `${KEY_PREFIX}:${digitsOnly(cnpj)}:${zoom}:${width}x${height}:${roundCoord(lat)}:${roundCoord(lng)}`;

const withDefaults = ({
  cnpj,
  lat,
  lng,
  zoom = DEFAULT_ZOOM,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SnapshotParams): Required<SnapshotParams> => ({ cnpj, lat, lng, zoom, width, height });

/* eslint-disable no-bitwise */
const encodeBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let output = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i];
    const hasByte2 = i + 1 < bytes.length;
    const hasByte3 = i + 2 < bytes.length;
    const byte2 = hasByte2 ? bytes[i + 1] : 0;
    const byte3 = hasByte3 ? bytes[i + 2] : 0;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    const enc3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
    const enc4 = byte3 & 0x3f;

    output += BASE64_CHARS[enc1];
    output += BASE64_CHARS[enc2];
    output += hasByte2 ? BASE64_CHARS[enc3] : '=';
    output += hasByte3 ? BASE64_CHARS[enc4] : '=';
  }

  return output;
};
/* eslint-enable no-bitwise */

const isStale = (snapshot: MapSnapshot) => Date.now() - snapshot.createdAt > SNAPSHOT_TTL_MS;

export async function carregarMapaSnapshot(params: SnapshotParams): Promise<MapSnapshot | null> {
  const normalized = withDefaults(params);
  const key = keyFor(normalized);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed: MapSnapshot = JSON.parse(raw);
    return parsed;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

const salvarMapaSnapshot = async (
  params: Required<SnapshotParams>,
  base64: string,
): Promise<MapSnapshot> => {
  const snapshot: MapSnapshot = {
    base64,
    createdAt: Date.now(),
    lat: params.lat,
    lng: params.lng,
    zoom: params.zoom,
    width: params.width,
    height: params.height,
  };
  await AsyncStorage.setItem(keyFor(params), JSON.stringify(snapshot));
  return snapshot;
};

const encodeParam = (key: string, value: string) =>
  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

const montarStaticMapUrl = (
  apiKey: string,
  { lat, lng, zoom, width, height }: Required<SnapshotParams>,
): string => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params = [
    ['center', `${lat},${lng}`],
    ['zoom', String(zoom)],
    ['size', `${width}x${height}`],
    ['scale', '2'],
    ['maptype', 'roadmap'],
    ['markers', `color:red|${lat},${lng}`],
    ['key', apiKey],
  ]
    .map(([key, value]) => encodeParam(key, value))
    .join('&');
  return `${baseUrl}?${params}`;
};

export async function atualizarMapaSnapshot({
  apiKey,
  ...params
}: SnapshotRequest): Promise<MapSnapshot> {
  const normalized = withDefaults(params);
  const existente = await carregarMapaSnapshot(normalized);
  if (existente && !isStale(existente)) {
    return existente;
  }

  const url = montarStaticMapUrl(apiKey, normalized);
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Falha ao gerar mapa offline (${resposta.status})`);
  }
  const buffer = await resposta.arrayBuffer();
  const base64 = encodeBase64(buffer);
  return salvarMapaSnapshot(normalized, base64);
}

export const snapshotEhAntigo = (snapshot: MapSnapshot | null) =>
  snapshot ? isStale(snapshot) : true;
