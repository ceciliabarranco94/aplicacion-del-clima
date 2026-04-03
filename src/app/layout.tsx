import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aplicación del Clima',
  description:
    'Una aplicación sencilla para consultar el clima usando Open-Meteo API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}