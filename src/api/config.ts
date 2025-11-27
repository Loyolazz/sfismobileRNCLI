import axios from 'axios';

export const SERVICE_BASE_URL = 'https://sfismobile.antaq.gov.br/AntaqService/Services.asmx';
export const JSON_ENDPOINT = `${SERVICE_BASE_URL}/`;
export const SOAP_NAMESPACE = 'http://tempuri.org';
export const REQUEST_TIMEOUT_MS = 30000;

export const antaqJsonClient = axios.create({
  baseURL: JSON_ENDPOINT,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
