// Valida inputs del usuario
export function isValidCityName(city: string): boolean {
  return city.trim().length > 0 && city.trim().length <= 100;
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}