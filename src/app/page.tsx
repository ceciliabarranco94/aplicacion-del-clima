'use client';

import { SearchBar } from '@/components/SearchBar';
import { WeatherCard } from '@/components/WeatherCard';
import { useWeather } from '@/hooks/useWeather';
import { CloudSun, Navigation } from 'lucide-react'; // Quitamos iconos innecesarios

export default function Home() {
  const { weather, loading, error, fetchWeather, clearError } = useWeather();

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto transition-colors duration-500">
      
      {/* Header: Saludo y Buscador */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">
            Bienvenid@, consulta el clima
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-light">
            Busca el clima de cualquier parte del mundo en tiempo real
          </p>
        </div>
        
        <SearchBar 
          onSearch={fetchWeather} 
          isLoading={loading}
          error={error}
          onClearError={clearError}
        />
      </header>

      {/* --- SECCIÓN DE NAVEGACIÓN ELIMINADA --- */}

      {/* Sección Principal de Contenido */}
      <div className="relative min-h-[400px]">
        {/* Estado de Carga */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white animate-pulse">
            <div className="p-6 bg-white/20 rounded-full mb-4">
              <CloudSun size={64} className="animate-bounce" />
            </div>
            <p className="text-2xl font-medium">Sincronizando con el cielo...</p>
          </div>
        )}

        {/* Tarjeta de Clima Principal (WeatherCard) */}
        {weather && !loading && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <WeatherCard data={weather} />
          </div>
        )}

        {/* Pantalla de Inicio (Sin búsqueda) */}
        {!weather && !loading && !error && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-12 text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="p-8 bg-peach-end rounded-full shadow-2xl">
                <Navigation size={48} className="rotate-45" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">¿Hacia dónde vamos hoy?</h2>
            <p className="text-lg opacity-80 max-w-md mx-auto">
              Escribe el nombre de una ciudad arriba para descubrir su clima, humedad y viento en tiempo real.
            </p>
          </div>
        )}
      </div>

      {/* Footer / Copyright Sugerido */}
      <footer className="mt-20 text-center text-white/50 text-sm font-medium tracking-widest uppercase">
        Weather App Project • 2026
      </footer>
    </main>
  );
}

// --- COMPONENTE NavItem ELIMINADO ---