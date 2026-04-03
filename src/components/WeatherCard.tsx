import { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl shadow-lg p-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">{data.city}</h2>
        <div className="text-6xl mb-4">{data.icon}</div>

        <div className="text-6xl font-bold mb-2">{data.temperature}°C</div>

        <p className="text-2xl mb-6 opacity-90">{data.condition}</p>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-blue-300">
          <div>
            <p className="text-sm opacity-75">Sensación</p>
            <p className="text-2xl font-semibold">{data.feelsLike}°C</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Humedad</p>
            <p className="text-2xl font-semibold">{data.humidity}%</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Viento</p>
            <p className="text-2xl font-semibold">{data.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}