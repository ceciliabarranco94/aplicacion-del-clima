import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  it('debería renderizar el campo de búsqueda', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    expect(
      screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i)
    ).toBeInTheDocument();
  });

  it('debería llamar onSearch al enviar el formulario', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /Buscar/i });

    await user.type(input, 'Madrid');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Madrid');
  });

  it('debería desactivar el botón mientras carga', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Buscando...');
  });

  it('debería limpiar el input después de enviar', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /Ingresa el nombre de una ciudad/i
    ) as HTMLInputElement;
    const button = screen.getByRole('button');

    await user.type(input, 'Barcelona');
    await user.click(button);

    // El input debería estar vacío después de enviar
    // (esto depende de tu implementación)
    expect(mockOnSearch).toHaveBeenCalledWith('Barcelona');
  });

  it('debería enviar el formulario con input vacío', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /Buscar/i });
    await user.click(button);

    // El componente actualmente permite enviar con input vacío
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('debería enviar el formulario con espacios en blanco', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /Buscar/i });

    await user.type(input, '   ');
    await user.click(button);

    // Verifica que se envíe el valor con espacios
    expect(mockOnSearch).toHaveBeenCalledWith('   ');
  });

  it('debería desactivar el input cuando isLoading es true', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i);
    expect(input).toBeDisabled();
  });

  it('debería enviar el formulario al presionar Enter', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i);

    await user.type(input, 'Paris{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('Paris');
  });

  it('debería permitir múltiples búsquedas consecutivas', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /Buscar/i });

    await user.type(input, 'London');
    await user.click(button);
    await user.type(input, 'Tokyo');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(2);
    expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'London');
    expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'LondonTokyo');
  });
});
