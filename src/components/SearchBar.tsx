'use client';

import { useState } from 'react';
import { ErrorMessage } from './ErrorMessage';

/**
 * Propiedades para el componente SearchBar.
 */
interface SearchBarProps {
  /** Función que recibe el nombre de la ciudad validado. */
  onSearch: (cityName: string) => void;
  /** Estado de carga que bloquea el input y el botón. */
  isLoading: boolean;
  /** Mensaje de error proveniente de la lógica de negocio o API. */
  error?: string;
  /** Limpia el error actual al interactuar con el componente. */
  onClearError?: () => void;
}

/**
 * Componente de búsqueda con validación y estados visuales de carga/error.
 */
export function SearchBar({ onSearch, isLoading, error, onClearError }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    if (onClearError) {
      onClearError();
    }

    onSearch(input.trim());
  };

  const isInputValid = input.trim().length >= 2;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (onClearError) {
                onClearError();
              }
            }}
            placeholder="Ingresa el nombre de una ciudad..."
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:opacity-60 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
          />
          {error && (
            <div className="mt-2">
              <ErrorMessage 
                message={error}
                type="error"
                onDismiss={onClearError}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isInputValid}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${
              isLoading || !isInputValid
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Buscando...
            </span>
          ) : (
            'Buscar'
          )}
        </button>
      </div>
    </form>
  );
}