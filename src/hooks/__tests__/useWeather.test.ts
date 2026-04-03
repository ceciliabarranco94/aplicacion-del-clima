import { renderHook, act, waitFor } from '@testing-library/react';
import { useWeather } from '../useWeather';
import * as weatherService from '@/services/openMeteoClient';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/services/openMeteoClient');

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería tener estado inicial correcto', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.weather).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería cargar datos meteorológicos exitosamente', async () => {
    const mockWeather = {
      city: 'Madrid',
      temperature: 22,
      condition: 'Despejado',
      humidity: 65,
      windSpeed: 12,
      feelsLike: 20,
      icon: '☀️',
    };

    vi.mocked(weatherService.getWeatherByCityName).mockResolvedValueOnce(
      mockWeather
    );

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('Madrid');
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toEqual(mockWeather);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores correctamente', async () => {
    const errorMessage = 'Ciudad no encontrada';
    vi.mocked(weatherService.getWeatherByCityName).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('CiudadNoExistente');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain(errorMessage);
    expect(result.current.weather).toBeNull();
  });

  it('debería rechazar ciudades vacías', () => {
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('');
    });

    expect(result.current.error).toBe(
      'Por favor ingresa un nombre de ciudad'
    );
    expect(result.current.weather).toBeNull();
  });

  it('debería rechazar ciudades con solo espacios en blanco', () => {
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('   ');
    });

    expect(result.current.error).toBe(
      'Por favor ingresa un nombre de ciudad'
    );
  });

  it('debería limpiar errores previos al buscar una nueva ciudad', async () => {
    vi.mocked(weatherService.getWeatherByCityName)
      .mockRejectedValueOnce(new Error('Error anterior'))
      .mockResolvedValueOnce({
        city: 'Barcelona',
        temperature: 20,
        condition: 'Nublado',
        humidity: 60,
        windSpeed: 10,
        feelsLike: 18,
        icon: '☁️',
      });

    const { result } = renderHook(() => useWeather());

    // Primera búsqueda falla
    act(() => {
      result.current.fetchWeather('CiudadNoExistente');
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // Segunda búsqueda exitosa
    act(() => {
      result.current.fetchWeather('Barcelona');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.weather?.city).toBe('Barcelona');
  });
});