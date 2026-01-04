# HF Vision Demo - Guía de Uso

## Descripción General

HF Vision Demo es una aplicación web de visión artificial que ejecuta modelos de IA directamente en tu navegador usando Hugging Face Transformers.js con aceleración WebGPU.

**Características principales:**
- ✅ Ejecuta modelos de IA 100% en el navegador (sin servidor)
- ✅ **Funciona completamente offline** (después de la primera descarga de modelos)
- ✅ Aceleración por hardware con WebGPU
- ✅ Fallback automático a WASM/CPU si WebGPU no está disponible
- ✅ Interfaz minimalista y moderna
- ✅ Gestión dinámica de modelos desde la UI
- ✅ Sin dependencias de CDN externos (fuentes del sistema)

---

## 🚀 Cómo Ejecutar la Aplicación

### Requisitos Previos

- **Navegador recomendado**: Chrome 113+ o Edge 113+ (para WebGPU)
- **Cámara web**: Necesaria para capturar imágenes
- **Conexión a internet**: Para descargar modelos la primera vez

### Opción 1: npm run dev (Recomendado - MÁS FÁCIL)

Si tienes Node.js instalado:

```bash
# Navega a la carpeta del proyecto
cd "hf-vision-demo"

# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Esto automáticamente:
- ✅ Inicia el servidor en `http://localhost:8080`
- ✅ Abre tu navegador automáticamente
- ✅ Todo en un solo comando

### Opción 2: Servidor HTTP con Python

Alternativa usando el servidor HTTP integrado de Python:

```bash
# Navega a la carpeta del proyecto
cd "hf-vision-demo"

# Python 3
python3 -m http.server 8080

# O si tienes Python 2
python -m SimpleHTTPServer 8080
```

Luego abre tu navegador en:
```
http://localhost:8080
```

### Opción 3: Live Server (VS Code)

Si usas Visual Studio Code:

1. Instala la extensión "Live Server"
2. Abre la carpeta `hf-vision-demo` en VS Code
3. Haz clic derecho en `index.html`
4. Selecciona "Open with Live Server"

Se abrirá automáticamente en tu navegador.

### Opción 4: Desplegar en Vercel (Producción)

Para desplegar online gratuitamente:

```bash
# Instalar Vercel CLI (solo una vez)
npm install -g vercel

# Navega a la carpeta del proyecto
cd "hf-vision-demo"

# Desplegar
vercel
```

Sigue las instrucciones en pantalla. Vercel te dará una URL pública.

### ⚠️ Importante: HTTPS Requerido

**La cámara web solo funciona con HTTPS o localhost.**

- ✅ `http://localhost:8080` - Funciona
- ✅ `https://tu-sitio.com` - Funciona
- ❌ `http://192.168.1.5:8080` - NO funciona (no es localhost)

Si necesitas acceder desde otro dispositivo en tu red local, necesitarás configurar HTTPS.

### Primera Carga: Paciencia

La **primera vez** que cargas la aplicación:
- Descarga ~430 MB de modelos desde Hugging Face
- Puede tomar **2-5 minutos** dependiendo de tu conexión
- Verás barras de progreso para cada modelo

**Cargas posteriores** son mucho más rápidas (~10-20 segundos) porque los modelos están cacheados en el navegador.

### Verificar que Funciona

1. Deberías ver un modal indicando el estado de WebGPU
2. Verás un video en vivo de tu cámara
3. Tres botones aparecerán: "ViT Classifier", "CLIP Zero-Shot", "DETR Object Detection"
4. Abre la consola del navegador (F12) para ver logs detallados

### 🔌 Modo Offline

**Después de la primera carga**, la aplicación funciona completamente sin internet:

1. **Primera vez** (CON internet):
   - Descarga ~430 MB de modelos desde Hugging Face CDN
   - Los modelos se cachean en el navegador (IndexedDB)
   - Toma 2-5 minutos

2. **Usos posteriores** (SIN internet):
   - Los modelos ya están cacheados localmente
   - La app inicia en ~10-20 segundos
   - Todo funciona offline (excepto agregar nuevos modelos)
   - Las fuentes son del sistema (no requieren Google Fonts)

**Para limpiar el cache y liberar espacio:**
```javascript
// En la consola del navegador (F12)
window.appDebug.clearModelCache();
```

---

## Arquitectura

### Client-Side AI

La aplicación es completamente client-side:
- **Sin servidor backend**: Toda la inferencia ocurre en tu navegador
- **Privacidad total**: Las imágenes nunca salen de tu dispositivo
- **WebGPU**: Aceleración por hardware usando tu GPU
- **Fallback WASM**: Si WebGPU no está disponible, usa CPU

### Modelos Incluidos

Por defecto, la aplicación incluye 3 modelos de visión artificial:

| Modelo | Tarea | Descripción |
|--------|-------|-------------|
| **ViT** (Vision Transformer) | Image Classification | Clasifica imágenes en 1000 categorías |
| **CLIP** | Zero-Shot Classification | Clasifica con prompts personalizados |
| **DETR** | Object Detection | Detecta y localiza objetos con bounding boxes |

Todos los modelos usan versiones optimizadas de Hugging Face (`Xenova/*`).

---

## Verificar si WebGPU está Activo

### 1. Modal al Cargar

Cuando abres la aplicación, verás un modal que indica:

- **✓ WebGPU Activo**: Tu navegador soporta WebGPU, aceleración habilitada
- **⚠ WebGPU No Disponible**: Ejecutando en modo CPU (más lento)

El modal muestra:
- Estado actual (activo o no disponible)
- Razón si no está disponible
- Recomendación de navegadores compatibles

### 2. Badge en el Header

En el header principal, verás un badge que indica el backend:

- **WebGPU** (azul) = Aceleración GPU activa
- **CPU (WASM)** (ámbar) = Modo fallback CPU

### 3. Resultados de Inferencia

Cada resultado muestra el backend usado:

- **WebGPU · 0.5s** = Inferencia con GPU (rápido)
- **WASM · 2.3s** = Inferencia con CPU (más lento)

El badge está consolidado: muestra backend y tiempo en un solo elemento.

### 4. Consola del Navegador (F12)

Abre DevTools (F12) y busca logs como:

```
Iniciando HF Vision Demo...
Detectando WebGPU...
✓ WebGPU disponible
  - FP16 support: true
  - Max buffer size: 268435456
┌─ Cargando modelo: vit
├─ Backend: WEBGPU
├─ Dtype: fp32
└─ Ruta: Xenova/vit-base-patch16-224
✓ Modelo vit cargado exitosamente con WEBGPU
▶ Ejecutando vit con WebGPU...
✓ vit completado en 0.52s
```

---

## Cómo Cambiar de Modelos

### Opción 1: Panel de Configuración (Recomendado)

1. Haz clic en el icono de engranaje (⚙) en la esquina superior derecha
2. Se abrirá el panel de configuración de modelos
3. Verás la lista de modelos disponibles con su estado:
   - **Verde "Activo"**: Modelo actualmente en uso
   - **Azul "Cargado"**: Modelo disponible para usar
   - **Gris "No cargado"**: Modelo no disponible

El panel muestra para cada modelo:
- Nombre completo
- Descripción (ruta de Hugging Face)
- Tipo de tarea
- Estado de carga

### Opción 2: Agregar Nuevos Modelos desde la UI

1. Abre el panel de configuración (⚙)
2. Desplázate a la sección "Agregar Nuevo Modelo"
3. Completa el formulario:
   - **ID del modelo**: Identificador único (ej: `resnet`, `mobilenet`)
   - **Nombre**: Nombre legible (ej: `ResNet-50`, `MobileNet V2`)
   - **Ruta HuggingFace**: Modelo en el Hub (ej: `Xenova/resnet-50`)
   - **Tipo de tarea**: Selecciona el tipo apropiado
     - Image Classification
     - Zero-Shot Classification
     - Object Detection
4. Haz clic en "Agregar Modelo"
5. El modelo se guardará en localStorage
6. **Recarga la página** para que esté disponible

**Nota**: Los modelos personalizados persisten entre sesiones gracias a localStorage.

### Opción 3: Editar config.js (Avanzado)

Si necesitas personalización profunda:

1. Abre [js/config.js](js/config.js)
2. Agrega una entrada a `MODEL_REGISTRY`:

```javascript
miModelo: {
  id: 'miModelo',
  name: 'Mi Modelo Custom',
  icon: '',
  task: 'image-classification',
  model: 'Xenova/mi-modelo-hf',
  displayName: 'Mi Modelo Custom',
  description: 'Descripción del modelo',
  buttonClass: 'miModelo-btn',
  resultId: 'miModeloResult',
  webgpu: {
    device: 'webgpu',
    dtype: 'fp32'  // Alta precisión
  },
  fallback: {
    device: 'wasm',
    dtype: 'q8'    // Cuantizado para CPU
  }
}
```

3. Guarda el archivo
4. Recarga la aplicación

**Configuración de Device y Dtype**:
- **webgpu + fp32**: Máximo rendimiento, alta precisión
- **wasm + q8**: Fallback CPU, modelo cuantizado (más rápido, menos preciso)
- **wasm + fp32**: CPU con precisión completa (muy lento)

---

## Navegadores Soportados

### WebGPU Completo ⚡

| Navegador | Versión Mínima | Notas |
|-----------|----------------|-------|
| Google Chrome | 113+ | Soporte completo, recomendado |
| Microsoft Edge | 113+ | Soporte completo |

### Fallback WASM 🔧

| Navegador | Notas |
|-----------|-------|
| Firefox | WebGPU experimental (requiere flag) |
| Safari | WebGPU no disponible, usará CPU |
| Navegadores antiguos | Funcionará en modo CPU |

**Recomendación**: Para mejor rendimiento, usa Chrome 113+ o Edge 113+.

### Verificar WebGPU en Chrome

1. Abre `chrome://gpu`
2. Busca "WebGPU" en la página
3. Debe decir "WebGPU: Hardware accelerated"

Si aparece "Disabled":
1. Ve a `chrome://flags`
2. Busca "WebGPU"
3. Habilita "Unsafe WebGPU" (solo para pruebas)

---

## Performance Esperada

### Con WebGPU (GPU)

| Modelo | Tiempo Aprox. | Notas |
|--------|---------------|-------|
| ViT | ~0.3-0.6s | Clasificación rápida |
| CLIP | ~0.5-1.0s | Depende del número de prompts |
| DETR | ~0.8-1.5s | Detección de objetos más compleja |

### Con WASM (CPU)

| Modelo | Tiempo Aprox. | Notas |
|--------|---------------|-------|
| ViT | ~2-5s | Depende del procesador |
| CLIP | ~4-8s | Más lento con muchos prompts |
| DETR | ~8-15s | Requiere más procesamiento |

*Tiempos aproximados, varían según hardware*

**WebGPU puede ser hasta 10x más rápido que WASM.**

---

## Cómo Funciona la Aplicación

### Flujo Completo

```
┌─ Usuario carga la página
│
├─ 1. Detectar WebGPU
│  └─ Si disponible → usar GPU
│  └─ Si no → usar CPU (WASM)
│
├─ 2. Mostrar modal de estado WebGPU
│  └─ Usuario cierra modal
│
├─ 3. Cargar Transformers.js desde CDN
│  └─ Versión: 2.17.2
│
├─ 4. Iniciar cámara web
│  └─ Solicitar permiso de cámara
│
├─ 5. Cargar modelos de IA (secuencial)
│  ├─ ViT (30-60s primera vez)
│  ├─ CLIP (30-60s primera vez)
│  └─ DETR (30-60s primera vez)
│  └─ Los modelos se cachean en el navegador
│
├─ 6. Mostrar controles y botones
│
└─ 7. Usuario listo para usar
   ├─ Hacer clic en botón de modelo
   ├─ Capturar imagen de cámara
   ├─ Ejecutar inferencia
   └─ Mostrar resultados
```

### Primera Carga vs. Cargas Posteriores

**Primera carga** (~2-3 minutos):
- Descarga modelos desde Hugging Face CDN
- Los modelos se cachean en el navegador

**Cargas posteriores** (~10-20 segundos):
- Modelos se cargan del cache del navegador
- Mucho más rápido

---

## Usar la Aplicación

### 1. Clasificación con ViT

1. Colócate frente a la cámara con el objeto a clasificar
2. Haz clic en **"ViT Classifier"**
3. La aplicación captura la imagen y ejecuta el modelo
4. Verás las 5 predicciones principales con % de confianza

**Ejemplo de resultado**:
```
person: 95%
human face: 87%
portrait: 78%
...
```

### 2. Clasificación Zero-Shot con CLIP

**Opción A: Prompts por defecto**
1. Haz clic en **"CLIP Zero-Shot"**
2. CLIP clasifica contra 9 categorías predefinidas

**Opción B: Prompts personalizados**
1. Escribe tus prompts en el input (separados por comas)
   - Ejemplo: `cat, dog, bird, fish`
2. Haz clic en **"CLIP Custom"**
3. CLIP clasifica contra tus prompts personalizados

**Ejemplo de resultado**:
```
a photo of a person: 92%
a photo of an animal: 12%
a photo of food: 5%
...
```

### 3. Detección de Objetos con DETR

1. Haz clic en **"DETR Object Detection"**
2. El modelo detecta y localiza objetos
3. Verás:
   - Lista de objetos detectados con % de confianza
   - Bounding boxes dibujados en la imagen
   - Cada objeto con color diferente

**Ejemplo de resultado**:
```
person: 95% (bbox dibujado)
laptop: 87% (bbox dibujado)
cup: 78% (bbox dibujado)
...
```

---

## Troubleshooting

### WebGPU no se detecta en Chrome

**Solución**:
1. Verifica que tengas Chrome 113+
2. Ve a `chrome://gpu` y busca "WebGPU"
3. Si aparece "Disabled":
   - Ve a `chrome://flags/#enable-unsafe-webgpu`
   - Habilita la opción
   - Reinicia Chrome

### Los modelos no cargan

**Posibles causas**:
- Conexión a internet lenta/intermitente
- Firewall bloqueando `cdn.jsdelivr.net`
- Navegador sin espacio en cache

**Soluciones**:
1. Verifica tu conexión a internet
2. Abre la consola (F12) y busca errores de red
3. Intenta limpiar el cache del navegador
4. Recarga la página

### La cámara no funciona

**Soluciones**:
1. Verifica permisos de cámara en configuración del navegador
2. Asegúrate de estar en HTTPS (o localhost)
3. Verifica que ninguna otra app esté usando la cámara
4. Revisa la consola (F12) para errores

### La aplicación está muy lenta

**Si estás en WASM (CPU)**:
- Esto es esperado, WASM es 5-10x más lento que WebGPU
- Usa Chrome 113+ o Edge 113+ para WebGPU

**Si estás en WebGPU y sigue lento**:
- Verifica que tu GPU sea compatible
- Cierra otras apps que usen la GPU
- Reduce la resolución de la cámara

### Error al agregar modelo personalizado

**Soluciones**:
1. Verifica que el ID del modelo sea único
2. Asegúrate de que la ruta de Hugging Face sea correcta
   - Debe ser formato `Xenova/modelo-nombre`
3. Verifica que el tipo de tarea sea compatible
4. Revisa la consola para más detalles

---

## Estructura de Archivos

```
hf-vision-demo/
├── index.html              # Página principal
├── USAGE.md               # Esta guía
├── css/
│   └── styles.css         # Estilos minimalistas oscuros
└── js/
    ├── main.js            # Orquestación principal
    ├── models.js          # Carga de modelos y WebGPU
    ├── config.js          # Configuración centralizada
    ├── camera.js          # Gestión de cámara
    └── ui.js              # Gestión de interfaz
```

---

## Configuración Avanzada

### Cambiar Versión de Transformers.js

Edita [js/config.js](js/config.js):

```javascript
export const APP_CONFIG = {
  transformersVersion: '2.17.2'  // Cambiar versión
  // ...
};
```

### Cambiar Número de Resultados

Edita [js/config.js](js/config.js):

```javascript
export const APP_CONFIG = {
  maxResults: 5  // Cambiar a 10, 15, etc.
  // ...
};
```

### Cambiar Resolución de Cámara

Edita [js/config.js](js/config.js):

```javascript
export const APP_CONFIG = {
  camera: {
    width: 640,   // Cambiar resolución
    height: 480,
    facingMode: 'user'  // 'user' (frontal) o 'environment' (trasera)
  }
  // ...
};
```

### Deshabilitar WebGPU (forzar WASM)

Edita [js/config.js](js/config.js):

```javascript
export const WEBGPU_CONFIG = {
  enabled: false,  // Deshabilitar WebGPU
  // ...
};
```

---

## Debugging

La aplicación expone un objeto `window.appDebug` para debugging:

```javascript
// En consola del navegador (F12)

// Ver estado de la aplicación
appDebug.getState()

// Procesar imagen con un modelo específico
appDebug.processImage('vit')

// Recargar todos los modelos
appDebug.reloadModels()
```

---

## FAQ

### ¿Los modelos se descargan cada vez?

No. La primera vez se descargan desde Hugging Face CDN, pero se cachean en el navegador. Las cargas posteriores son mucho más rápidas.

### ¿Puedo usar la app sin cámara?

Sí, pero necesitarías modificar el código para permitir subir imágenes. Actualmente solo soporta cámara en vivo.

### ¿Cuánto espacio ocupan los modelos?

Aproximadamente:
- ViT: ~100 MB
- CLIP: ~150 MB
- DETR: ~180 MB

Total: ~430 MB en cache del navegador

### ¿Funciona offline después de cargar?

Parcialmente. Los modelos están cacheados, pero Transformers.js se carga desde CDN. Para uso 100% offline necesitarías hospearlo localmente.

### ¿Puedo usar modelos más grandes?

Sí, pero ten en cuenta:
- Modelos grandes tardan más en descargar
- Pueden requerir más RAM/VRAM
- El navegador puede quedarse sin memoria

Recomendación: Usa modelos `Xenova/*` optimizados para navegador.

---

## Recursos

- [Transformers.js Docs](https://huggingface.co/docs/transformers.js)
- [WebGPU Spec](https://www.w3.org/TR/webgpu/)
- [Hugging Face Models](https://huggingface.co/models)
- [Xenova Models](https://huggingface.co/Xenova)

---

## Soporte

Si encuentras problemas:
1. Revisa esta guía
2. Abre la consola del navegador (F12) para ver errores
3. Verifica tu conexión a internet
4. Prueba con Chrome 113+ o Edge 113+

---

**¡Disfruta experimentando con modelos de IA en tu navegador!** 🚀
