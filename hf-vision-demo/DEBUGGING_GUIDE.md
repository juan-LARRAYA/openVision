# 🐛 Guía de Debugging - HuggingFace Vision Demo

## 📚 Índice
1. [Cómo funciona la aplicación](#como-funciona)
2. [Herramientas de debugging](#herramientas)
3. [Debugging paso a paso](#paso-a-paso)
4. [Errores comunes y soluciones](#errores-comunes)

---

## 🏗️ Cómo funciona la aplicación {#como-funciona}

### Flujo general de la aplicación

```
1. Usuario carga la página
   ↓
2. React renderiza App.tsx
   ↓
3. Se cargan los "Contexts" (TransformersContext, WebGPUContext, etc.)
   ↓
4. TransformersContext carga Transformers.js desde CDN
   ↓
5. CameraContext pide permiso y accede a la cámara
   ↓
6. Usuario selecciona un modelo
   ↓
7. ModelsContext carga el modelo seleccionado
   ↓
8. Usuario presiona "Ejecutar Inferencia"
   ↓
9. Se captura frame del video, se ejecuta inferencia
   ↓
10. Se muestran resultados en pantalla
```

### Componentes principales

```
src/
├── App.tsx                    # Componente principal
├── main.tsx                   # Punto de entrada
├── contexts/                  # Estado global de la app
│   ├── TransformersContext    # Carga librería Transformers.js
│   ├── WebGPUContext          # Detecta soporte WebGPU
│   ├── CameraContext          # Maneja la cámara
│   ├── ModelsContext          # Carga/descarga modelos
│   └── InferenceContext       # Ejecuta inferencia
├── hooks/                     # Lógica reutilizable
│   ├── useTransformers        # Hook para cargar Transformers.js
│   ├── useCamera              # Hook para cámara
│   ├── useModels              # Hook para manejar modelos
│   └── useInference           # Hook para inferencia
└── components/ui/             # Componentes visuales
    ├── ModelSelector          # Selector de modelos
    ├── VideoPreview           # Vista previa de cámara
    ├── ResultsDisplay         # Muestra resultados
    └── ...
```

---

## 🛠️ Herramientas de debugging {#herramientas}

### 1. Consola del navegador (DevTools)

**Cómo abrir:**
- Chrome/Edge: `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Firefox: `F12` o `Ctrl+Shift+K`
- Safari: `Cmd+Option+C`

**Tabs importantes:**

#### 📋 Console (Consola)
- Muestra logs, warnings y errores
- Ejecuta código JavaScript en vivo
- **Ejemplo de uso:**
  ```javascript
  // Escribir en consola para probar
  console.log("Hola mundo")

  // Ver el estado de React DevTools
  $r // Componente seleccionado
  ```

#### 🔍 Sources (Fuentes)
- Muestra código fuente
- Permite poner breakpoints (pausar ejecución)
- **Cómo usar breakpoints:**
  1. Abre Sources
  2. Busca el archivo (Ctrl+P)
  3. Click en número de línea para agregar breakpoint
  4. Cuando el código ejecute esa línea, se pausará

#### 🌐 Network (Red)
- Muestra todas las peticiones HTTP
- Útil para ver si los modelos se descargan correctamente
- **Qué buscar:**
  - Status 200 = OK
  - Status 404 = No encontrado
  - Status 500 = Error del servidor

#### 📱 Elements (Elementos)
- Muestra el HTML/CSS en vivo
- Permite modificar estilos en tiempo real
- **Útil para:** verificar que componentes se renderizan

### 2. React Developer Tools (Extensión)

**Instalar:**
- Chrome: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/es/firefox/addon/react-devtools/)

**Qué puedes hacer:**
- Ver árbol de componentes
- Inspeccionar props y state
- Ver qué componente se re-renderiza

---

## 🔍 Debugging paso a paso {#paso-a-paso}

### Paso 1: Identificar el problema

**Pregúntate:**
1. ¿En qué momento ocurre el error?
   - Al cargar la página
   - Al seleccionar un modelo
   - Al ejecutar inferencia
   - Otro momento

2. ¿Qué esperabas que pasara?
3. ¿Qué pasó en realidad?

### Paso 2: Revisar la consola

**Abre DevTools (F12) → Tab "Console"**

**Tipos de mensajes:**

```
✓ console.log() = Mensaje informativo (azul/negro)
⚠ console.warn() = Advertencia (amarillo)
❌ console.error() = Error (rojo)
```

**Logs de nuestra app:**

```
┌─ Cargando Transformers.js desde CDN...    # Inicio carga librería
├─ URL: https://cdn.jsdelivr...             # URL del CDN
└─ Transformers.js cargado exitosamente     # ✓ Librería OK

🚀 Precargando modelo por defecto: yolov9t  # Inicio precarga modelo
┌─ Cargando modelo: yolov9t                 # Detalles del modelo
├─ Backend: WEBGPU/WASM                     # GPU o CPU
├─ Dtype: fp16/fp32                         # Precisión
└─ Ruta: Xenova/yolov9-t                    # HuggingFace path
✓ Modelo yolov9t cargado exitosamente       # ✓ Modelo OK

🔍 handleRunInference called                # Se llamó inferencia
▶️ Ejecutando yolov9t con webgpu...         # Ejecutando modelo
📊 Raw results structure:                   # Estructura de resultados
  type: "object"
  isArray: true
  keys: [...]
  sample: [...]
✓ yolov9t completado en 0.45s               # ✓ Inferencia OK
✅ Inferencia completada: {...}             # Resultado final
```

### Paso 3: Debugging interactivo con breakpoints

**Ejemplo: Debuguear la función de inferencia**

1. Abre DevTools (F12)
2. Ve a tab "Sources"
3. Presiona `Ctrl+P` y escribe `useInference.ts`
4. Busca la línea donde dice `const startTime = performance.now();`
5. Click en el número de línea (aparece un punto azul)
6. Presiona "Ejecutar Inferencia"
7. El código se pausará en ese punto

**Controles cuando está pausado:**
- ▶️ Resume (F8) = Continuar ejecución
- ⤵️ Step Over (F10) = Ejecutar siguiente línea
- ⤴️ Step Into (F11) = Entrar en función
- ⤴️ Step Out (Shift+F11) = Salir de función

**Inspeccionar variables:**
En la columna derecha verás:
- **Scope**: Variables locales
- **Call Stack**: Pila de llamadas (qué función llamó a qué)
- **Watch**: Variables que quieres monitorear

### Paso 4: Usar console.log estratégicamente

**Buenas prácticas:**

```typescript
// ❌ MAL: No sabes qué es qué
console.log(results);

// ✅ BIEN: Contexto claro
console.log('🔍 Resultados de CLIP:', results);

// ✅ MEJOR: Estructura detallada
console.log('📊 Análisis de resultados:', {
  tipo: typeof results,
  esArray: Array.isArray(results),
  longitud: results?.length,
  primerElemento: results?.[0],
  datos: results
});
```

### Paso 5: Verificar el flujo de datos

**React DevTools**

1. Abre React DevTools
2. Busca el componente `App`
3. Ve la pestaña "Props" para ver qué datos recibe
4. Ve la pestaña "Hooks" para ver el state

**Network Tab**

1. Abre tab "Network"
2. Filtra por "Fetch/XHR"
3. Presiona "Ejecutar Inferencia"
4. Mira qué peticiones se hacen
5. Click en cada petición para ver:
   - Headers (encabezados)
   - Response (respuesta)
   - Preview (vista previa)

---

## 🐞 Errores comunes y soluciones {#errores-comunes}

### Error 1: "transformers.RawImage.fromCanvas is not a function"

**Qué significa:**
La propiedad `RawImage` no existe en el objeto `transformers`.

**Por qué pasa:**
Transformers.js no cargó completamente o la versión del CDN es incorrecta.

**Cómo debuguear:**
```javascript
// En consola, escribe:
console.log(transformers);
console.log(transformers.RawImage);
```

**Solución:**
Verificar que Transformers.js cargó correctamente. Buscar en logs:
```
✓ Transformers.js cargado exitosamente
```

Si no aparece, revisar:
1. Conexión a internet
2. URL del CDN en `useTransformers.ts`

---

### Error 2: "Cannot read properties of undefined (reading 'map')"

**Qué significa:**
Estás intentando hacer `.map()` en algo que es `undefined`.

**Por qué pasa:**
Los resultados del modelo no tienen el formato esperado.

**Cómo debuguear:**
```javascript
// Busca en consola este log:
📊 Raw results structure: {...}

// Verifica:
// - type: debería ser "object"
// - isArray: debería ser true (para clasificación)
// - sample: muestra los datos reales
```

**Solución:**
Ver qué estructura tiene `results` y ajustar el código en `ResultsDisplay.tsx`.

---

### Error 3: El modelo no carga

**Síntomas:**
- Spinner infinito
- Modelo no aparece como cargado

**Cómo debuguear:**

1. **Revisar Network tab:**
   - ¿Se está descargando el modelo?
   - ¿Qué tamaño tiene? (algunos modelos son >100MB)
   - ¿Hay errores 404 o 500?

2. **Revisar consola:**
   - ¿Hay errores de CORS?
   - ¿Hay errores de memoria?

3. **Verificar configuración:**
   ```javascript
   // En consola:
   console.log(MODEL_REGISTRY);
   ```

**Soluciones comunes:**
- Esperar más tiempo (modelos grandes tardan)
- Verificar que el nombre del modelo sea correcto
- Probar con otro modelo más pequeño

---

### Error 4: La cámara no se ve

**Síntomas:**
- Cuadro negro
- Mensaje "Iniciando cámara..." infinito

**Cómo debuguear:**

1. **Permisos del navegador:**
   - Chrome: Click en candado 🔒 al lado de URL
   - Verificar que cámara esté "Permitir"

2. **Consola:**
   - Buscar errores relacionados con `getUserMedia`
   - Error común: "Permission denied"

3. **Verificar disponibilidad:**
   ```javascript
   // En consola:
   navigator.mediaDevices.enumerateDevices()
     .then(devices => console.log(devices));
   ```

**Soluciones:**
- Dar permiso a la cámara en el navegador
- Verificar que hay una cámara conectada
- Probar en otro navegador

---

### Error 5: Resultados no se muestran

**Síntomas:**
- Inferencia se completa pero no aparecen resultados

**Cómo debuguear:**

1. **Verificar que results existe:**
   ```javascript
   // Buscar en consola:
   ✅ Inferencia completada: {...}
   ```

2. **React DevTools:**
   - Inspeccionar componente `App`
   - Ver hook `results` en la sección "Hooks"
   - ¿Es null? ¿Tiene datos?

3. **Verificar componente ResultsDisplay:**
   - ¿Se está renderizando?
   - En Elements tab, buscar elemento con clase `resultsContainer`

**Soluciones:**
- Verificar que `results` no sea `null`
- Verificar que ResultsDisplay maneje correctamente el formato
- Agregar logs en ResultsDisplay para ver qué recibe

---

## 🎯 Ejercicio práctico: Debuguea el error de CLIP

### Objetivo
Entender por qué CLIP no muestra resultados.

### Paso a paso

1. **Preparación:**
   ```bash
   npm run dev:clean
   ```
   - Abre http://localhost:8080
   - Abre DevTools (F12)
   - Ve a tab "Console"

2. **Seleccionar CLIP:**
   - Espera a que termine de cargar
   - Observa los logs en consola

3. **Ejecutar inferencia:**
   - Presiona "Ejecutar Inferencia"
   - Observa **todos** los logs que aparecen

4. **Analizar resultados:**
   - Busca el log: `📊 Raw results structure:`
   - Copia **TODO** ese objeto
   - Pégalo aquí para analizarlo juntos

5. **Identificar el problema:**
   - ¿`isArray` es `true` o `false`?
   - ¿Qué contiene `sample`?
   - ¿Coincide con el formato esperado?

6. **Solución:**
   - Basado en lo que encontremos, ajustaremos `ResultsDisplay.tsx`

---

## 📖 Recursos adicionales

### Documentación oficial
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Transformers.js](https://huggingface.co/docs/transformers.js)

### Comandos útiles de consola

```javascript
// Limpiar consola
clear()

// Ver objetos con mejor formato
console.table(array)

// Medir tiempo
console.time('label')
// ... código ...
console.timeEnd('label')

// Agrupar logs
console.group('Grupo')
console.log('Dentro del grupo')
console.groupEnd()

// Condicional
console.assert(1 === 2, 'Esto se muestra si es false')
```

### Tips finales

1. **Lee los errores completos:** No solo la primera línea
2. **Busca en Google:** Copia el mensaje de error exacto
3. **Usa breakpoints:** Son más potentes que console.log
4. **Pregunta:** No hay preguntas tontas en programación
5. **Documenta:** Cuando resuelvas un bug, escribe cómo lo hiciste

---

## 🎓 Próximos pasos

Ahora que tienes esta guía:

1. ✅ Lee toda la guía (acabas de hacerlo!)
2. ⏭️ Ejecuta el ejercicio práctico con CLIP
3. 📊 Comparte los logs que encuentres
4. 🔧 Arreglemos el problema juntos
5. 🎉 ¡Celebra tu primera sesión de debugging exitosa!

**Recuerda:** Debuguear es una habilidad que se mejora con práctica. Cada bug que resuelves te hace mejor programador. 💪
