'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react'; // Importamos iconos de lucide
import { ErrorMessage } from './ErrorMessage';

interface SearchBarProps {
  onSearch: (cityName: string) => void;
  isLoading: boolean;
  error?: string;
  onClearError?: () => void;
}

export function SearchBar({ onSearch, isLoading, error, onClearError }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (onClearError) onClearError();
    onSearch(input.trim());
  };

  const isInputValid = input.trim().length >= 2;

  return (
    <div className="w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className={`
          relative flex items-center p-1.5 rounded-full transition-all duration-300
          bg-white shadow-lg border-2
          ${error ? 'border-red-400' : 'border-transparent focus-within:border-peach-end/30'}
        `}
      >
        {/* Icono de búsqueda a la izquierda */}
        <div className="pl-4 text-peach-end opacity-70">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (onClearError) onClearError();
          }}
          placeholder="Busca una ciudad..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-text-primary bg-transparent outline-none placeholder:text-text-secondary/50"
        />

        <button
          type="submit"
          disabled={isLoading || !isInputValid}
          className={`
            flex items-center justify-center px-6 py-2.5 rounded-full font-bold transition-all
            ${
              isLoading || !isInputValid
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-peach-end text-white hover:bg-peach-end/90 hover:shadow-md active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Buscar'
          )}
        </button>
      </form>

      {/* Manejo de errores debajo del buscador */}
      {error && (
        <div className="absolute mt-2 translate-x-4">
          <ErrorMessage 
            message={error}
            type="error"
            onDismiss={onClearError}
          />
        </div>
      )}
    </div>
  );
}