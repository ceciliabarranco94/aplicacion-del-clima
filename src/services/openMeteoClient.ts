import { WeatherData, GeoLocation } from '@/types/weather';

// Constants
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT = 10000; // 10 segundos
const MAX_RETRIES = 2;

// Types para errores específicos
class WeatherAPIError extends Error {
  constructor(
    message: string,
    public code: 'NETWORK_ERROR' | 'API_ERROR' | 'DATA_VALIDATION_ERROR' | 'NOT_FOUND',
    public statusCode?: number
  ) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

/**
 * Wrapper para fetch con timeout y reintentos
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new WeatherAPIError(
        `API respondió con estado ${response.status}`,
        'API_ERROR',
        response.status
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TypeError) {
      if (retries > 0) {
        console.warn(`Reintentando... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new WeatherAPIError(
        'Error de conexión. Verifica tu conexión a internet.',
        'NETWORK_ERROR'
      );
    }

    if (error instanceof WeatherAPIError) {
      throw error;
    }

    throw new WeatherAPIError(
      'Error desconocido en la solicitud',
      'API_ERROR'
    );
  }
}

/**
 * Obtiene las coordenadas de una ciudad usando la API de Geocoding
 */
async function getCoordinates(cityName: string): Promise<GeoLocation> {
  if (!cityName?.trim()) {
    throw new WeatherAPIError(
      'El nombre de la ciudad no puede estar vacío',
      'DATA_VALIDATION_ERROR'
    );
  }

  const url = `${GEO_API}?name=${encodeURIComponent(cityName)}&count=1&language=es`;

  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new WeatherAPIError(
        'Respuesta inválida de la API de geolocalización',
        'DATA_VALIDATION_ERROR'
      );
    }

    if (data.results.length === 0) {
      throw new WeatherAPIError(
        `Ciudad "${cityName}" no encontrada`,
        'NOT_FOUND'
      );
    }

    const result = data.results[0];
    const location = validateGeoLocation(result);

    return location;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    throw new WeatherAPIError(
      `Error al procesar respuesta de geolocalización: ${error instanceof Error ? error.message : 'desconocido'}`,
      'DATA_VALIDATION_ERROR'
    );
  }
}

/**
 * Obtiene los datos meteorológicos actuales de Open-Meteo
 */
async function getCurrentWeather(
  latitude: number,
  longitude: number,
  cityName: string
): Promise<WeatherData> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new WeatherAPIError(
      'Coordenadas inválidas',
      'DATA_VALIDATION_ERROR'
    );
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'apparent_temperature',
    ].join(','),
    timezone: 'auto',
  });

  try {
    const response = await fetchWithRetry(`${WEATHER_API}?${params}`);
    const data = await response.json();

    if (!data.current) {
      throw new WeatherAPIError(
        'Datos meteorológicos no disponibles',
        'DATA_VALIDATION_ERROR'
      );
    }

    const validatedData = validateWeatherData(data.current);

    return {
      city: cityName,
      temperature: validatedData.temperature,
      condition: getWeatherCondition(validatedData.weatherCode),
      humidity: validatedData.humidity,
      windSpeed: validatedData.windSpeed,
      feelsLike: validatedData.feelsLike,
      icon: getWeatherIcon(validatedData.weatherCode),
    };
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    throw new WeatherAPIError(
      `Error al obtener datos meteorológicos: ${error instanceof Error ? error.message : 'desconocido'}`,
      'API_ERROR'
    );
  }
}

/**
 * Obtiene los datos meteorológicos completos de una ciudad
 */
export async function getWeatherByCityName(
  cityName: string
): Promise<WeatherData> {
  try {
    const location = await getCoordinates(cityName);
    const weather = await getCurrentWeather(
      location.latitude,
      location.longitude,
      location.name
    );
    return weather;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    throw new WeatherAPIError(
      `No se pudo obtener el clima: ${error instanceof Error ? error.message : 'desconocido'}`,
      'API_ERROR'
    );
  }
}

/**
 * Valida y normaliza datos de geolocalización
 */
function validateGeoLocation(data: any): GeoLocation {
  return {
    name: String(data.name || '').trim() || 'Desconocido',
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    country: String(data.country || '').trim() || 'Desconocido',
  };
}

/**
 * Valida y normaliza datos meteorológicos
 */
function validateWeatherData(current: any) {
  return {
    temperature: Math.round(Number(current.temperature_2m) || 0),
    humidity: Math.max(
      0,
      Math.min(100, Number(current.relative_humidity_2m) || 0)
    ),
    windSpeed: Math.max(0, Math.round(Number(current.wind_speed_10m) || 0)),
    feelsLike: Math.round(Number(current.apparent_temperature) || 0),
    weatherCode: Number(current.weather_code) || 0,
  };
}

/**
 * Mapea códigos WMO a descripciones legibles
 * Según la tabla proporcionada
 */
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    // Despejado
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    // Nublado
    3: 'Nublado',
    // Niebla
    45: 'Niebla',
    48: 'Niebla',
    // Lluvia ligera
    51: 'Lluvia ligera',
    53: 'Lluvia ligera',
    55: 'Lluvia ligera',
    // Lluvia moderada
    61: 'Lluvia moderada',
    63: 'Lluvia moderada',
    65: 'Lluvia moderada',
    // Nieve
    71: 'Nieve',
    73: 'Nieve',
    75: 'Nieve',
    77: 'Nieve',
    // Lluvia fuerte
    80: 'Lluvia fuerte',
    81: 'Lluvia fuerte',
    82: 'Lluvia fuerte',
    // Aguanieve
    85: 'Aguanieve',
    86: 'Aguanieve',
    // Tormenta eléctrica
    95: 'Tormenta eléctrica',
    96: 'Tormenta eléctrica',
    99: 'Tormenta eléctrica',
  };
  return conditions[code] || 'Condición desconocida';
}

/**
 * Mapea códigos WMO a emojis para representación visual
 * Según la tabla proporcionada
 */
function getWeatherIcon(code: number): string {
  // Despejado
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️'; // Mayormente despejado / Parcialmente nublado
  
  // Nublado
  if (code === 3) return '☁️';
  
  // Niebla
  if (code === 45 || code === 48) return '🌫️';
  
  // Lluvia ligera
  if (code === 51 || code === 53 || code === 55) return '🌧️';
  
  // Lluvia moderada
  if (code === 61 || code === 63 || code === 65) return '🌧️';
  
  // Nieve
  if (code === 71 || code === 73 || code === 75 || code === 77) return '❄️';
  
  // Lluvia fuerte
  if (code === 80 || code === 81 || code === 82) return '🌧️';
  
  // Aguanieve
  if (code === 85 || code === 86) return '🌨️';
  
  // Tormenta eléctrica
  if (code === 95 || code === 96 || code === 99) return '⛈️';
  
  // Por defecto
  return '🌡️';
}

export { WeatherAPIError };