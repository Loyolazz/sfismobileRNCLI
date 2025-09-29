import { parseCoordenada } from '@/utils/geo';

describe('parseCoordenada', () => {
  it('interpreta coordenadas DMS com rótulos em português', () => {
    const latitude = parseCoordenada("Latitude: 12°27'5,4\" Sul");
    expect(latitude).not.toBeNull();
    expect(latitude ?? 0).toBeCloseTo(-12.4515, 4);
  });

  it('interpreta coordenadas DMS com direção extensa e segundos fracionados', () => {
    const longitude = parseCoordenada('Longitude Oeste 64°13\'44,03"');
    expect(longitude).not.toBeNull();
    expect(longitude ?? 0).toBeCloseTo(-64.2288972, 4);
  });

  it('interpreta segundos separados por espaço', () => {
    const longitude = parseCoordenada('64°13\'44 03\" Oeste');
    expect(longitude).not.toBeNull();
    expect(longitude ?? 0).toBeCloseTo(-64.2288972, 4);
  });

  it('aceita direções abreviadas alternativas', () => {
    const longitude = parseCoordenada('8°3\'15\" Leste');
    expect(longitude).not.toBeNull();
    expect(longitude ?? 0).toBeCloseTo(8.0541666, 4);
  });

  it('corrige coordenadas decimais com separadores extras', () => {
    const latitude = parseCoordenada('Latitude -3.123.456');
    expect(latitude).not.toBeNull();
    expect(latitude ?? 0).toBeCloseTo(-3.123456, 6);
  });
});
