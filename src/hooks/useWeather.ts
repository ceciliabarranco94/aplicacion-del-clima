import { useState, useCallback, useRef, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherByCityName, WeatherAPIError } from '@/services/openMeteoClient';

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (cityName: string) => Promise<void>;
  clearError: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName?.trim()) {
      setError('Por favor ingresa un nombre de ciudad');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Buscando ciudad:', cityName);
      const data = await getWeatherByCityName(cityName);

      if (isMountedRef.current) {
        console.log('✅ Datos obtenidos:', data);
        setWeather(data);
        setError(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      let errorMessage = 'Error desconocido';

      if (err instanceof WeatherAPIError) {
        switch (err.code) {
          case 'NOT_FOUND':
            errorMessage = `La ciudad "${cityName}" no fue encontrada. Verifica la ortografía.`;
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Error de conexión. Verifica tu internet.';
            break;
          case 'API_ERROR':
            errorMessage = 'Error del servicio meteorológico. Intenta más tarde.';
            break;
          default:
            errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('❌ Error:', errorMessage);
      setError(errorMessage);
      setWeather(null);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    loading,
    error,
    fetchWeather,
    clearError,
  };
}