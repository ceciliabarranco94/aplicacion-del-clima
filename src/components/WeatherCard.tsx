import { WeatherData } from '@/types/weather';
import { Thermometer, Droplets, Wind, Zap, Sun } from 'lucide-react'; // Quitamos 'Search'

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-peach-start to-peach-end text-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 overflow-hidden relative border border-white/20 backdrop-blur-md">
      
      {/* Círculos decorativos de fondo (opcional) */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      
      {/* Cambiamos el grid de dos columnas a un layout flex vertical centrado.
         Ahora todo se alinea en una columna y se centra.
      */}
      <div className="flex flex-col items-center text-center relative z-10 gap-12">
        
        {/* Sección Superior Centrada: Temperatura Grande y Ciudad */}
        <div className="flex flex-col items-center gap-4">
          
          {/* Temperatura Gigante Centrada */}
          <div className="flex items-start justify-center">
            <span className="text-[120px] md:text-[160px] font-extrabold tracking-tighter leading-none">
              {data.temperature}
            </span>
            <span className="text-6xl font-light mt-6">°C</span>
          </div>

          {/* Nombre de la Ciudad Centrado */}
          <h2 className="text-5xl md:text-6xl font-light tracking-tight opacity-95">
            {data.city}
          </h2>
          
          {/* Condición Centrada */}
          <p className="text-2xl font-medium opacity-80 uppercase tracking-widest">
            {data.condition}
          </p>

        </div>

        {/* Sección Media: Icono de Clima Centrado */}
        <div className="text-[140px] md:text-[180px] drop-shadow-2xl animate-pulse my-4">
          {/* Si data.icon es un string/emoji, lo usamos, si es una URL lo cambiamos a img */}
          {data.icon || "☀️"}
        </div>

        {/* Sección Inferior: Grid de detalles con Glassmorphism (ya estaba centrada) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl border-t border-white/20 pt-12 mt-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl flex flex-col items-center shadow-inner">
            <div className="p-3 bg-white/20 rounded-full mb-3 text-white">
              <Thermometer size={24} />
            </div>
            <p className="text-xs uppercase opacity-70 font-bold tracking-tighter">Sensación</p>
            <p className="text-3xl font-bold">{data.feelsLike}°</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl flex flex-col items-center shadow-inner">
            <div className="p-3 bg-white/20 rounded-full mb-3 text-white">
              <Droplets size={24} />
            </div>
            <p className="text-xs uppercase opacity-70 font-bold tracking-tighter">Humedad</p>
            <p className="text-3xl font-bold">{data.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl flex flex-col items-center shadow-inner">
            <div className="p-3 bg-white/20 rounded-full mb-3 text-white">
              <Wind size={24} />
            </div>
            <p className="text-xs uppercase opacity-70 font-bold tracking-tighter">Viento</p>
            <p className="text-3xl font-bold">{data.windSpeed} <span className="text-sm font-medium">km/h</span></p>
          </div>
        </div>
        
        {/* Mensaje de actualización centrado */}
        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2">
           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
           DATOS ACTUALIZADOS PARA {data.city.toUpperCase()}
        </div>
      </div>
    </div>
  );
}