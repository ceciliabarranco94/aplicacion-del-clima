import { getWeatherByCityName } from '../openMeteoClient';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Edge Cases - Entrada de Datos', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('Nombres de ciudad inválidos', () => {
    it('debería manejar ciudad vacía', async () => {
      const emptyInputs = ['', ' ', '  ', '\t', '\n'];

      for (const input of emptyInputs) {
        global.fetch = vi.fn().mockResolvedValueOnce(
          new Response(JSON.stringify({ results: [] }))
        );

        await expect(getWeatherByCityName(input)).rejects.toThrow();
      }
    });

    it('debería manejar null o undefined', async () => {
      await expect(
        getWeatherByCityName(null as any)
      ).rejects.toThrow();

      await expect(
        getWeatherByCityName(undefined as any)
      ).rejects.toThrow();
    });

    it('debería manejar nombres muy largos', async () => {
      const veryLongCity = 'A'.repeat(1000);

      global.fetch = vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [] }))
      );

      await expect(getWeatherByCityName(veryLongCity)).rejects.toThrow(
        'no encontrada'
      );
    });

    it('debería manejar caracteres especiales y SQL injection', async () => {
      const maliciousInputs = [
        "Madrid'; DROP TABLE cities; --",
        '<script>alert("xss")</script>',
        '../../etc/passwd',
        'Madrid%00.txt',
      ];

      for (const input of maliciousInputs) {
        global.fetch = vi.fn().mockResolvedValueOnce(
          new Response(JSON.stringify({ results: [] }))
        );

        // No debería lanzar error, solo no encontrar la ciudad
        await expect(getWeatherByCityName(input)).rejects.toThrow();
      }
    });

    it('debería manejar solo números como entrada', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [] }))
      );

      await expect(getWeatherByCityName('12345')).rejects.toThrow();
    });

    it('debería manejar símbolos especiales', async () => {
      const specialChars = [
        '@#$%^&*()',
        '!!!???',
        '~~~***',
      ];

      for (const input of specialChars) {
        global.fetch = vi.fn().mockResolvedValueOnce(
          new Response(JSON.stringify({ results: [] }))
        );

        await expect(getWeatherByCityName(input)).rejects.toThrow();
      }
    });

    it('debería manejar diacríticos y caracteres acentuados', async () => {
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

    it('debería manejar emojis en el nombre de la ciudad', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [] }))
      );

      await expect(getWeatherByCityName('Madrid 🌍')).rejects.toThrow();
    });

    it('debería hacer trim de espacios en blanco', async () => {
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

      const result = await getWeatherByCityName('  Madrid  ');
      expect(result.city).toBe('Madrid');
    });
  });
});