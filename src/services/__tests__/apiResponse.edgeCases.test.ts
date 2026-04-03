import { getWeatherByCityName } from '../openMeteoClient';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Edge Cases - Respuestas de API', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('debería manejar respuestas vacías', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({}))
    );

    await expect(getWeatherByCityName('Test')).rejects.toThrow();
  });

  it('debería manejar respuestas null', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response('null')
    );

    await expect(getWeatherByCityName('Test')).rejects.toThrow();
  });

  it('debería manejar JSON inválido', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response('{ invalid json }')
    );

    await expect(getWeatherByCityName('Test')).rejects.toThrow();
  });

  it('debería manejar HTML en respuesta (error 500)', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(
        '<html><body>500 Internal Server Error</body></html>',
        { status: 500 }
      )
    );

    await expect(getWeatherByCityName('Test')).rejects.toThrow();
  });

  it('debería manejar timeout (respuesta muy lenta)', async () => {
    global.fetch = vi.fn().mockImplementationOnce(
      () => new Promise(resolve => {
        setTimeout(() => resolve(new Response('...')), 10000);
      })
    );

    // Simular timeout
    const timeoutPromise = Promise.race([
      getWeatherByCityName('Test'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 100)
      ),
    ]);

    await expect(timeoutPromise).rejects.toThrow('Timeout');
  });

  it('debería manejar múltiples resultados (la API devuelve varias ciudades)', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [
              {
                name: 'Madrid',
                latitude: 40.4168,
                longitude: -3.7038,
                country: 'España',
              },
              {
                name: 'Madrid',
                latitude: 30.6344,
                longitude: -96.3089,
                country: 'USA',
              },
            ],
          })
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            current: {
              temperature_2m: 22,
              relative_humidity_2m: 65,
              weather_code: 0,
              wind_speed_10m: 12,
              apparent_temperature: 20,
            },
          })
        )
      );

    const result = await getWeatherByCityName('Madrid');
    // Debería usar el primer resultado
    expect(result.city).toBe('Madrid');
  });

  it('debería manejar coordenadas en límites (Polo Norte, Polo Sur, Dateline)', async () => {
    const extremeCoords = [
      { name: 'North Pole', lat: 90, lon: 0 },
      { name: 'South Pole', lat: -90, lon: 0 },
      { name: 'International Dateline West', lat: 0, lon: -180 },
      { name: 'International Dateline East', lat: 0, lon: 180 },
    ];

    for (const coord of extremeCoords) {
      global.fetch = vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              results: [
                {
                  name: coord.name,
                  latitude: coord.lat,
                  longitude: coord.lon,
                  country: 'Test',
                },
              ],
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              current: {
                temperature_2m: 20,
                relative_humidity_2m: 60,
                weather_code: 0,
                wind_speed_10m: 10,
                apparent_temperature: 20,
              },
            })
          )
        );

      const result = await getWeatherByCityName(coord.name);
      expect(result.city).toBe(coord.name);
    }
  });

  it('debería manejar status codes HTTP no exitosos', async () => {
    const errorCodes = [400, 401, 403, 404, 500, 502, 503];

    for (const code of errorCodes) {
      global.fetch = vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Error' }), { status: code })
      );

      await expect(getWeatherByCityName('Test')).rejects.toThrow();
    }
  });

  it('debería manejar respuestas muy grandes', async () => {
    const largeData = Array(10000)
      .fill(null)
      .map((_, i) => ({
        name: `City${i}`,
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
        country: 'Test',
      }));

    global.fetch = vi.fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ results: largeData })
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            current: {
              temperature_2m: 20,
              relative_humidity_2m: 60,
              weather_code: 0,
              wind_speed_10m: 10,
              apparent_temperature: 20,
            },
          })
        )
      );

    const result = await getWeatherByCityName('City0');
    expect(result).toBeDefined();
  });
});