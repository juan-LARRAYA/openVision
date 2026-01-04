# HuggingFace Vision Demo - React + TypeScript

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Transformers.js](https://img.shields.io/badge/🤗%20Transformers.js-2.17+-blue.svg)](https://huggingface.co/docs/transformers.js)
[![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)

Aplicación web para probar modelos de visión artificial de HuggingFace directamente en el navegador, construida con React, TypeScript y Transformers.js.

## ✨ Características

- ⚡ **WebGPU Acceleration** - Hasta 10x más rápido con aceleración GPU
- 🔌 **100% Offline** - Funciona completamente offline después de la primera carga
- 🎯 **TypeScript** - Código type-safe con autocompletado
- 🧩 **Arquitectura Modular** - Custom hooks, contexts y componentes reutilizables
- 🎨 **Diseño Minimalista** - Paleta oscura profesional sin gradientes ni efectos
- 📦 **3 Modelos Incluidos** - ViT, CLIP y DETR listos para usar
- ➕ **Modelos Personalizados** - Agrega tus propios modelos de HuggingFace
- 💾 **Persistencia Local** - localStorage para modelos custom
- 📹 **Tiempo Real** - Inferencia en tiempo real con feed de cámara

## 🚀 Inicio Rápido

### Instalación

```bash
cd hf-vision-demo-react
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:8080](http://localhost:8080)

### Build

```bash
npm run build
npm run preview  # Para previsualizar el build de producción
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   └── ui/             # Componentes de UI (Header, Modal, etc.)
├── contexts/           # Context providers
│   ├── TransformersContext.tsx
│   ├── WebGPUContext.tsx
│   ├── CameraContext.tsx
│   ├── ModelsContext.tsx
│   └── InferenceContext.tsx
├── hooks/              # Custom React hooks
│   ├── useTransformers.ts    # Carga Transformers.js
│   ├── useWebGPU.ts          # Detección WebGPU
│   ├── useCamera.ts          # Manejo de cámara
│   ├── useModels.ts          # Carga de modelos
│   ├── useInference.ts       # Ejecución de inferencia
│   ├── useCanvas.ts          # Bounding boxes
│   ├── usePersistedModels.ts # localStorage
│   └── useModalState.ts      # Estado de modales
├── types/              # Definiciones TypeScript
│   ├── models.ts
│   ├── transformers.ts
│   ├── webgpu.ts
│   ├── inference.ts
│   ├── camera.ts
│   └── ui.ts
├── config/             # Configuración
│   └── models.ts      # Registro de modelos
├── App.tsx            # Componente principal
└── main.tsx           # Entry point + providers
```

### Flujo de Datos

```
main.tsx
  └─> TransformersProvider (carga Transformers.js)
       └─> WebGPUProvider (detecta WebGPU)
            └─> CameraProvider (maneja cámara)
                 └─> ModelsProvider (carga modelos)
                      └─> InferenceProvider (ejecuta inferencia)
                           └─> App (orquesta UI)
```

### Custom Hooks

- **useTransformers** - Carga Transformers.js desde CDN
- **useWebGPU** - Detecta soporte WebGPU y características
- **useCamera** - Gestiona stream de cámara y selección de dispositivo
- **useModels** - Carga/descarga modelos con progreso
- **useInference** - Ejecuta inferencia con imágenes de video
- **useCanvas** - Dibuja bounding boxes para detección de objetos
- **usePersistedModels** - CRUD para modelos custom en localStorage
- **useModalState** - Controla estado de modales (WebGPU, Config)

## 🎨 CSS Modules

Cada componente tiene su propio módulo CSS para encapsulación:

```tsx
import styles from './Component.module.css';

export function Component() {
  return <div className={styles.container}>...</div>;
}
```

Las variables CSS globales están en `index.css`:

```css
:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --accent: #0EA5E9;
  /* ... */
}
```

## 🔧 Configuración

### WebGPU Headers (vite.config.ts)

Los headers CORS son **críticos** para WebGPU:

```ts
server: {
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
  }
}
```

### Path Aliases (tsconfig.app.json)

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@hooks/*": ["./src/hooks/*"],
    "@contexts/*": ["./src/contexts/*"],
    "@/types/*": ["./src/types/*"],
    "@config/*": ["./src/config/*"]
  }
}
```

### Tipos WebGPU

```bash
npm install --save-dev @webgpu/types
```

## 📦 Modelos Disponibles

### Predefinidos

1. **Vision Transformer (ViT)**
   - Clasificación en 1000 categorías ImageNet
   - Modelo: `onnx-community/vit-base-patch16-224-in21k`

2. **CLIP**
   - Clasificación zero-shot con etiquetas custom
   - Modelo: `Xenova/clip-vit-base-patch32`

3. **DETR**
   - Detección de objetos con bounding boxes
   - Modelo: `Xenova/detr-resnet-50`

### Agregar Modelos Personalizados

1. Click en el botón de configuración ⚙️
2. Completa el formulario:
   - **ID**: Identificador único (opcional)
   - **Nombre**: Nombre para mostrar
   - **Descripción**: Breve descripción
   - **Ruta**: `usuario/nombre-modelo` de HuggingFace
   - **Tipo**: image-classification, zero-shot o object-detection
3. Click en "Agregar Modelo"

Los modelos custom se guardan en localStorage y persisten entre sesiones.

## 🌐 Modo Offline

Después de la primera carga, la aplicación funciona completamente offline:

1. **Modelos**: Cacheados en IndexedDB (~430 MB)
2. **Fuentes**: System fonts (sin Google Fonts)
3. **Transformers.js**: Cacheado después de la primera carga

Para verificar:
1. Ejecuta la app normalmente
2. Desconecta internet
3. Refresca la página - debería funcionar

## 🎯 Uso

1. **Permitir Acceso a Cámara** - El navegador pedirá permiso
2. **Esperar Modal WebGPU** - Muestra si WebGPU está disponible
3. **Seleccionar Modelo** - Escoge del dropdown (carga automática)
4. **Ejecutar Inferencia** - Click en "Ejecutar Inferencia"
5. **Ver Resultados** - Aparecen en el panel derecho

### Para Zero-shot (CLIP)

Las etiquetas por defecto son: `persona, auto, perro, gato, árbol, edificio, comida`

Puedes modificarlas en la configuración del modelo.

### Para Detección de Objetos (DETR)

Los bounding boxes se dibujan automáticamente sobre el video cuando se detectan objetos.

## 🔍 Verificar WebGPU

### En la UI
- Modal al cargar muestra el estado
- Badge en resultados muestra backend usado (WebGPU/WASM)

### En Consola
```
┌─ Verificando soporte WebGPU...
├─ Adaptador WebGPU encontrado
├─ Features: texture-compression-bc, ...
├─ FP16 support: Sí
└─ WebGPU completamente funcional
```

### Navegadores Compatibles
- Chrome 113+
- Edge 113+
- Otros navegadores Chromium actualizados

## 🐛 Troubleshooting

### La aplicación no carga
- Verifica que los headers CORS estén configurados en `vite.config.ts`
- Ejecuta `npm install` para instalar dependencias

### WebGPU no funciona
- Actualiza Chrome/Edge a versión 113+
- La app funciona con fallback WASM (más lento)

### Cámara no inicia
- Verifica permisos del navegador
- Usa HTTPS o localhost (requisito para getUserMedia)

### Modelos no cargan
- Primera carga requiere internet para descargar modelos
- Verifica conexión de red
- Los modelos se cachean para uso offline posterior

## 📄 Scripts

```bash
npm run dev      # Servidor de desarrollo (puerto 8080)
npm run build    # Build de producción
npm run preview  # Previsualizar build
npm run lint     # ESLint
```

## 🆚 Comparación con Vanilla JS

### Ventajas de la Versión React

- ✅ **Type Safety** - TypeScript previene errores en tiempo de desarrollo
- ✅ **Modularidad** - Hooks y contexts reutilizables
- ✅ **Escalabilidad** - Más fácil agregar features
- ✅ **Developer Experience** - HMR, autocompletado, mejor debugging
- ✅ **Testing** - Más fácil testear componentes aislados

### Misma Funcionalidad

Ambas versiones tienen exactamente las mismas características:
- WebGPU acceleration
- 3 modelos predefinidos
- Modelos custom
- Modal WebGPU
- Panel de configuración
- Persistencia localStorage
- Soporte offline 100%

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

Desarrollado con [Claude Code](https://claude.com/claude-code)
