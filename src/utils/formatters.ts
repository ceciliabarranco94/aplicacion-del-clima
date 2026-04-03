// Formatea datos para mostrar
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}