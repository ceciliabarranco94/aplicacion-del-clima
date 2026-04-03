import { getWeatherByCityName } from '../openMeteoClient';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('openMeteoClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('getWeatherByCityName', () => {
    it('debería obtener el clima para una ciudad válida', async () => {
      // Mock para la API de Geocodificación
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
              ],
            })
          )
        )
        // Mock para la API de Clima
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

      expect(result).toEqual({
        city: 'Madrid',
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        feelsLike: 20,
        condition: 'Despejado',
        icon: '☀️',
      });
    });

    it('debería lanzar error si la ciudad no existe', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [],
          })
        )
      );

      await expect(getWeatherByCityName('CiudadNoExistente')).rejects.toThrow(
        'Ciudad "CiudadNoExistente" no encontrada'
      );
    });

    it('debería manejar errores de conexión a la API de Geocodificación', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(getWeatherByCityName('Madrid')).rejects.toThrow();
    });

    it('debería manejar errores de conexión a la API de Clima', async () => {
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
              ],
            })
          )
        )
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(getWeatherByCityName('Madrid')).rejects.toThrow();
    });

    it('debería redondear correctamente la temperatura', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              results: [
                {
                  name: 'Barcelona',
                  latitude: 41.3851,
                  longitude: 2.1734,
                  country: 'España',
                },
              ],
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              current: {
                temperature_2m: 22.7,
                relative_humidity_2m: 65,
                weather_code: 0,
                wind_speed_10m: 12.3,
                apparent_temperature: 20.5,
              },
            })
          )
        );

      const result = await getWeatherByCityName('Barcelona');

      expect(result.temperature).toBe(23); // Redondeado
      expect(result.windSpeed).toBe(12); // Redondeado
      expect(result.feelsLike).toBe(21); // Redondeado
    });

    it('debería mapear correctamente los códigos de clima', async () => {
      const weatherCodes = [
        { code: 0, expected: 'Despejado' },
        { code: 3, expected: 'Nublado' },
        { code: 61, expected: 'Lluvia ligera' },
        { code: 95, expected: 'Tormenta eléctrica' },
      ];

      for (const { code, expected } of weatherCodes) {
        global.fetch = vi.fn()
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                results: [
                  {
                    name: 'TestCity',
                    latitude: 0,
                    longitude: 0,
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
                  weather_code: code,
                  wind_speed_10m: 10,
                  apparent_temperature: 18,
                },
              })
            )
          );

        const result = await getWeatherByCityName('TestCity');
        expect(result.condition).toBe(expected);
      }
    });

    it('debería mapear correctamente los iconos de clima', async () => {
      const weatherIcons = [
        { code: 0, expected: '☀️' },
        { code: 3, expected: '☁️' },
        { code: 61, expected: '🌧️' },
        { code: 71, expected: '❄️' },
        { code: 95, expected: '⛈️' },
      ];

      for (const { code, expected } of weatherIcons) {
        global.fetch = vi.fn()
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                results: [
                  {
                    name: 'TestCity',
                    latitude: 0,
                    longitude: 0,
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
                  weather_code: code,
                  wind_speed_10m: 10,
                  apparent_temperature: 18,
                },
              })
            )
          );

        const result = await getWeatherByCityName('TestCity');
        expect(result.icon).toBe(expected);
      }
    });

    it('debería manejar ciudades con caracteres especiales', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              results: [
                {
                  name: 'São Paulo',
                  latitude: -23.5505,
                  longitude: -46.6333,
                  country: 'Brasil',
                },
              ],
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              current: {
                temperature_2m: 28,
                relative_humidity_2m: 70,
                weather_code: 0,
                wind_speed_10m: 15,
                apparent_temperature: 30,
              },
            })
          )
        );

      const result = await getWeatherByCityName('São Paulo');
      expect(result.city).toBe('São Paulo');
    });

    it('debería ser case-insensitive en la búsqueda de ciudad', async () => {
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

      const result = await getWeatherByCityName('madrid');
      expect(result.city).toBe('Madrid');
    });
  });
});