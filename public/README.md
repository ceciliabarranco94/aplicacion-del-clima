# 🌤️ Weather App - Aplicación de Clima en Tiempo Real

Aplicación para consultar el clima de cualquier ciudad del mundo.

### 🔧 Tecnologías Utilizadas:

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 14+ | Framework React con SSR |
| **TypeScript** | 5.3+ | Lenguaje con tipado estático |
| **React** | 18.3+ | Librería de UI |
| **Tailwind CSS** | 3.4+ | Estilos CSS utilitarios |
| **Vitest** | 1.0+ | Framework de testing |
| **Open-Meteo API** | v1 | API de clima (gratuita) |


## 📋 Tabla de Contenidos

- [Resumen del Proyecto](#-resumen-del-proyecto)
- [Características](#-características)
- [Funcionalidades](#-funcionalidades)
- [Instrucciones de instalación](#-instrucciones-de-instalación)
- [Guía de Uso](#-guía-de-uso)
- [Manejo de errores](#-manejo-de-errores)
- [Ejemplos de Resultados](#-ejemplos-de-resultados)
- [Condiciones Climáticas Soportadas](#️-condiciones-climáticas-soportadas)
- [Información de la API](#-información-de-la-api)
- [Pruebas](#-pruebas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Mejoras Futuras](#-mejoras-futuras)

## 📝 Resumen del Proyecto

**Weather App** es una aplicación web que permite a los usuarios buscar el clima actual de cualquier ciudad del mundo. La aplicación utiliza la **API gratuita Open-Meteo** para obtener datos meteorológicos precisos y en tiempo real.

## ✨ Características

- 🔍 **Búsqueda de Ciudades**: Busca el clima de cualquier ciudad del mundo
- 🌡️ **Datos Meteorológicos en Tiempo Real**:
  - Temperatura actual
  - Sensación térmica
  - Humedad relativa
  - Velocidad del viento
  - Condición climática (Despejado, Nublado, Lluvia, Tormenta, etc.)

- 🎨 **Interfaz**:
  - Diseño con Tailwind CSS
  - Compatible con dispositivos móviles, tablets y escritorio
  - Transiciones suaves y animaciones

- 🧪 **Cobertura Completa de Tests**:
  - 52 casos de prueba
  - Tests unitarios y de integración
  - Cobertura de edge cases y errores

- 🌍 **Soporte Internacional**:
  - Soporta ciudades con caracteres especiales (acentos, tildes)
  - Funciona en cualquier zona horaria

- ⚡ **Sin Autenticación**:
  - API gratuita de Open-Meteo
  - No requiere claves de API
  - Totalmente privado (sin rastreo)

## ✅ Funcionalidades
- Permite buscar el clima por nombre de ciudad
- Muestra temperatura actual en °C
- Maneja errores si la ciudad no existe
- Autocompleta el nombre de la ciudad en caso de que exista
- Obtiene datos desde una API externa

## 🚀 Instrucciones de instalación

### Requisitos Previos
- **Node.js** 18.17 o superior
- **npm** 9+ o **yarn** 4+
- **Git** (opcional, para clonar el repositorio)

### Instrucciones

#### 1. Clonar el Repositorio (Opcional)
```bash
git clone https://github.com/ceciliabarranco94/weather-app.git
cd weather-app
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Instalar Dependencias de Desarrollo (Testing)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```

#### 4. Configurar Archivos de Configuración
Asegúrate de que existan estos archivos en la raíz:
- ✅ vitest.config.ts
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ next.config.js
- ✅ tsconfig.json

#### 5. Ejecutar la Aplicación
```bash
npm run dev
```
La aplicación estará disponible en: http://localhost:3000

## 📖 Guía de Uso

#### 1. Abre la aplicación en tu navegador: http://localhost:3000

#### 2. Ingresa el nombre de una ciudad en el campo de búsqueda:

- Ejemplo: "Ciudad de México", "São Paulo", "New York", "Toluca"

#### 3. Haz clic en "Buscar" o presiona Enter

#### 4. Ver resultados, la aplicación mostrará:
- Temperatura actual
- Sensación térmica
- Humedad
- Velocidad del viento
- Condición climática con emoji

## ❌ Manejo de Errores
```bash
Error: Ciudad "CiudadNoExistente" no encontrada
Por favor intenta con otro nombre de ciudad.
```

## 📊 Ejemplos de Resultados
```bash
Madrid

☀️ Despejado

Temperatura: 22°C
Sensación térmica: 20°C
Humedad: 65%
Velocidad del viento: 12 km/h
```

```bash
Barcelona

☁️ Nublado

Temperatura: 20°C
Sensación térmica: 18°C
Humedad: 60%
Velocidad del viento: 10 km/h
```
## 🌡️ Condiciones Climáticas Soportadas
### 🌦️ Códigos de clima

| Código        | Condición           | Emoji |
|:-------------:|--------------------|:-----:|
| 0             | Despejado          | ☀️    |
| 3             | Nublado            | ☁️    |
| 45, 48        | Niebla             | 🌫️    |
| 51, 53, 55    | Lluvia ligera      | 🌧️    |
| 61, 63, 65    | Lluvia moderada    | 🌧️    |
| 71, 73, 75    | Nieve              | ❄️    |
| 80, 81, 82    | Lluvia fuerte      | 🌧️    |
| 85, 86        | Aguanieve          | 🌨️    |
| 95, 96, 99    | Tormenta eléctrica | ⛈️    |

## ⚡ Información de la API
### Información Técnica Importante
- No requiere API Key: Open-Meteo es completamente gratuita
- Privado y Seguro: No se rastrean datos de usuarios
- Rápido: Respuestas en < 100ms
- Confiable: 99.9% de uptime
- Actualización en Tiempo Real: Datos meteorológicos actuales
### Límites de la API (Open-Meteo)
- Sin límite de peticiones (gratuito)
- Datos históricos disponibles
- Actualizaciones cada 15 minutos

## 🧪 Pruebas
### Ejecutar Todos los Tests
```bash
npm run test
```

### Resultado esperado:
```bash
✓ 52 tests passed
✓ 7 test files passed
```

### Ejecutar Tests Específicos
```bash
# Tests del servicio de clima
npm run test openMeteoClient

# Tests del componente SearchBar
npm run test SearchBar

# Tests del hook useWeather
npm run test useWeather
```

### Ver Tests en Interfaz Gráfica
```bash
npm run test:ui
```

Abre http://localhost:51204 en tu navegador para ver una interfaz visual de los tests.

### Cobertura de Tests
### 🧪 Casos de Prueba por Categoría

| Categoría                      | Tests | Cobertura                    |
|--------------------------------|:-----:|------------------------------|
| Servicio OpenMeteo (éxito)     |   9   | Búsquedas válidas            |
| Edge Cases - Entrada           |   9   | Validación de inputs         |
| Edge Cases - Datos             |   8   | Límites numéricos            |
| Edge Cases - API               |   9   | Errores HTTP, timeouts       |
| Custom Hook useWeather         |   6   | Estado, validación           |
| Componente SearchBar           |   9   | UI, eventos                  |
| Concurrencia                   |   1   | Búsquedas simultáneas        |
| **TOTAL**                      | **52**| **100%**                     |

### Casos Cubiertos
- ✅ Ciudades válidas e inválidas
- ✅ Caracteres especiales (acentos, emojis)
- ✅ Temperaturas extremas (-89°C a 56°C)
- ✅ Errores de API (400, 500, timeout)
- ✅ Validación de inputs
- ✅ Estados de carga
- ✅ Manejo de errores

## 📁 Estructura del Proyecto
```bash
weather-app/
├── src/
│   ├── app/                          # Rutas y layouts de Next.js
│   │   ├── page.tsx                  # Página principal
│   │   ├── layout.tsx                # Layout global
│   │   └── globals.css               # Estilos globales
│   │
│   ├── components/                   # Componentes React
│   │   ├── SearchBar.tsx             # Barra de búsqueda
│   │   ├── WeatherCard.tsx           # Tarjeta de clima
│   │   ├── ErrorMessage.tsx          # Mensaje de error
│   │   └── __tests__/
│   │       └── SearchBar.test.tsx    # Tests del componente
│   │
│   ├── services/                     # Lógica de APIs
│   │   ├── openMeteoClient.ts        # Cliente de Open-Meteo
│   │   └── __tests__/
│   │       ├── openMeteoClient.test.ts
│   │       ├── weatherData.edgeCases.test.ts
│   │       ├── apiResponse.edgeCases.test.ts
│   │       └── concurrency.edgeCases.test.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useWeather.ts             # Hook para gestionar clima
│   │   └── __tests__/
│   │       └── useWeather.test.ts
│   │
│   ├── types/                        # Tipos TypeScript
│   │   └── weather.ts                # Tipos de datos meteorológicos
│   │
│   ├── utils/ 
│   │   ├── constants.ts              # Constantes globales
│   │   ├── validators.ts             # Validaciones
│   │   └── formatters.ts             # Formateadores de datos
│   │
│   └── test/
│       └── setup.ts                  # Configuración de tests
│
├── public/                           # Archivos estáticos
├── node_modules/                     # Dependencias
│
├── vitest.config.ts                  # Configuración de Vitest
├── tailwind.config.js                # Configuración de Tailwind
├── postcss.config.js                 # Configuración de PostCSS
├── next.config.js                    # Configuración de Next.js
├── tsconfig.json                     # Configuración de TypeScript
├── package.json                      # Dependencias y scripts
└── README.md                         # Este archivo
```

## 🎯 Mejoras Futuras

### 🟢 Fase 1: Próximas Mejoras 🟢
#### 🎨 Interfaz
- Mejorar interfaz gráfica y darle identidad 
- Hacerla responsiva
#### 🌤️ Pronóstico de 7 Días
- Mostrar predicción diaria  
- Gráfico de temperaturas  
- Alertas de lluvia/nieve  
#### ⭐ Ciudades Favoritas
- Guardar ciudades con localStorage  
- Acceso rápido a favoritos  
- Eliminar de favoritos  
#### 🕘 Historial de Búsqueda
- Últimas 10 ciudades buscadas  
- Búsqueda rápida desde historial  
- Limpiar historial  

### 🟡 Fase 2: Mejoras de UX 🟡 
#### 📍 Geolocalización Automática
- Detectar ubicación del usuario  
- Mostrar clima local al cargar  
- Permiso de ubicación  
#### 🌙 Tema Oscuro/Claro
- Toggle de tema  
- Guardar preferencia  
- Animaciones suaves  
#### 🌡️ Cambio de Unidades
- Celsius ↔ Fahrenheit  
- km/h ↔ mph  
- Guardar preferencia  

### 🔵 Fase 3: Funcionalidades Avanzadas 🔵  
#### 🚨 Alertas Meteorológicas
- Notificaciones de cambios drásticos  
- Alertas de lluvia/tormenta  
- Configuración personalizada  
#### 🌍 Comparación de Ciudades
- Mostrar clima de 2-3 ciudades lado a lado  
- Comparar temperaturas  
#### 🗺️ Mapa Interactivo
- Ver ciudades en mapa  
- Click en mapa para obtener clima  
- Zoom y pan  
#### ⚙️ API Propia
- Backend con Express/Node.js  
- Base de datos para caché  
- Autenticación de usuarios  

### 🟣 Fase 4: Análisis y Datos 🟣 
#### 📊 Historial de Temperaturas
- Gráficos de temperatura en el tiempo  
- Máximos y mínimos históricos  
- Exportar datos  
#### 📈 Estadísticas
- Ciudades más buscadas  
- Análisis de patrones climáticos  