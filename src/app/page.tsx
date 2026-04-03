'use client';

import { SearchBar } from '@/components/SearchBar';
import { WeatherCard } from '@/components/WeatherCard';
import { useWeather } from '@/hooks/useWeather';

export default function Home() {
  const { weather, loading, error, fetchWeather, clearError } = useWeather();

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-blue-900 mb-2 sm:mb-4">
            ☀️ Aplicación del Clima
          </h1>
          <p className="text-center text-sm sm:text-base text-gray-700">
            Busca el clima de cualquier ciudad del mundo en tiempo real
          </p>
        </header>

        {/* Barra de búsqueda - Pasa funciones y estado */}
        <SearchBar 
          onSearch={fetchWeather} 
          isLoading={loading}
          error={error}
          onClearError={clearError}
        />

        {/* Contenido dinámico */}
        <div className="mt-8 sm:mt-12">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl animate-bounce mb-4">⏳</div>
              <p className="text-lg sm:text-xl text-gray-700 font-medium">
                Obteniendo datos del clima...
              </p>
            </div>
          )}

          {weather && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <WeatherCard data={weather} />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ✅ Datos actualizados para <strong>{weather.city}</strong>
                </p>
              </div>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4">🔍</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                ¡Comienza tu búsqueda!
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-sm">
                Ingresa el nombre de una ciudad para ver el clima en tiempo real
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}