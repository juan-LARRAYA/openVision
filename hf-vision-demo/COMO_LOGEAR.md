# 📝 Guía Rápida: Cómo Logear Variables

## 🎯 Objetivo
Aprender a ver qué está pasando en tu código mientras corre.

---

## 🚀 INICIO RÁPIDO (5 pasos)

### 1. Corre tu app
```bash
npm run dev
```

### 2. Abre la consola del navegador
- Ve a http://localhost:8080
- Presiona **F12** (o clic derecho → Inspeccionar)
- Click en pestaña **"Console"**

### 3. Interactúa con la app
- Selecciona un modelo (ej: CLIP)
- Presiona "Ejecutar Inferencia"

### 4. Observa los logs
Verás mensajes como:
```
🔍 handleRunInference called {selectedModelId: 'clip', hasVideo: true, ...}
🔍 Loaded pipeline: {pipeline: ƒ, modelId: 'clip', ...}
▶️ Ejecutando clip con wasm...
📊 Raw results structure: {...}
✅ Inferencia completada: {...}
```

### 5. Click para expandir
- Los objetos `{...}` tienen una flechita ▶️
- Click para ver TODO el contenido

---

## 📋 Logs que YA TIENES en el código

### En App.tsx (línea 69-74)
```typescript
console.log('🔍 handleRunInference called', {
  selectedModelId,
  hasVideo: !!videoRef.current,
  videoWidth: videoRef.current?.videoWidth,
  videoHeight: videoRef.current?.videoHeight,
});
```
**Qué muestra:** Estado inicial cuando presionas "Ejecutar Inferencia"

### En App.tsx (línea 85)
```typescript
console.log('🔍 Loaded pipeline:', loadedPipeline);
```
**Qué muestra:** El modelo que se va a usar para inferencia

### En useInference.ts (línea 85-90)
```typescript
console.log('📊 Raw results structure:', {
  type: typeof results,
  isArray: Array.isArray(results),
  keys: results ? Object.keys(results) : [],
  sample: results
});
```
**Qué muestra:** Estructura COMPLETA de los resultados del modelo

### En ResultsDisplay.tsx (línea 47)
```typescript
console.log('🔍 Classification results received:', results);
```
**Qué muestra:** Los datos que recibe el componente para mostrar

---

## ✍️ Cómo AGREGAR tus propios logs

### Método 1: Log simple
```typescript
const miVariable = { nombre: 'Juan', edad: 25 };
console.log(miVariable);
```

### Método 2: Log con etiqueta (MEJOR)
```typescript
const miVariable = { nombre: 'Juan', edad: 25 };
console.log('👤 Datos del usuario:', miVariable);
```

### Método 3: Log con contexto completo (MEJOR AÚN)
```typescript
const miVariable = { nombre: 'Juan', edad: 25 };
console.log('👤 Análisis completo:', {
  tipo: typeof miVariable,
  esObjeto: typeof miVariable === 'object',
  llaves: Object.keys(miVariable),
  datos: miVariable
});
```

---

## 🎨 Tipos de mensajes

### console.log() - Información normal
```typescript
console.log('✅ Todo OK');
```
Aparece en **blanco/negro**

### console.warn() - Advertencia
```typescript
console.warn('⚠️ Cuidado, algo raro');
```
Aparece en **amarillo**

### console.error() - Error
```typescript
console.error('❌ Algo salió mal');
```
Aparece en **rojo**

### console.table() - Tablas (para arrays)
```typescript
const usuarios = [
  { nombre: 'Juan', edad: 25 },
  { nombre: 'María', edad: 30 }
];
console.table(usuarios);
```
Muestra una **tabla bonita**

---

## 🔥 EJERCICIO PRÁCTICO

### Objetivo: Ver qué estructura tiene CLIP

#### Paso 1: Asegúrate que los logs estén activos
Los logs ya están en el código (líneas que mencioné arriba).

#### Paso 2: Ejecuta la app
```bash
npm run dev
```

#### Paso 3: Abre DevTools
- F12 → Console

#### Paso 4: Ejecuta CLIP
1. Selecciona modelo "CLIP"
2. Espera que cargue
3. Presiona "Ejecutar Inferencia"

#### Paso 5: Encuentra este log específico
Busca en la consola:
```
📊 Raw results structure:
```

#### Paso 6: Expande el objeto
- Click en la flechita ▶️ al lado de `{...}`
- Click en "sample" para ver los datos reales

#### Paso 7: Copia TODO ese objeto
- Clic derecho en el objeto
- "Copy object"
- Pégalo en un mensaje para analizarlo

---

## 🎯 Dónde poner logs según qué quieres ver

### ¿Quieres ver qué modelo se seleccionó?
**Archivo:** `App.tsx`
**Función:** `handleRunInference` (ya tiene logs)

### ¿Quieres ver la estructura de resultados?
**Archivo:** `useInference.ts`
**Línea:** 85 (ya tiene el log `📊 Raw results structure`)

### ¿Quieres ver qué recibe el componente de resultados?
**Archivo:** `ResultsDisplay.tsx`
**Línea:** 47 (ya tiene el log `🔍 Classification results received`)

### ¿Quieres ver si el modelo se cargó correctamente?
**Archivo:** `useModels.ts`
**Busca:** La función `loadModel`
**Agrega:**
```typescript
console.log('🎯 Modelo cargado:', {
  modelId: modelConfig.id,
  tipo: modelConfig.type,
  backend: backend,
  pipeline: pipeline
});
```

---

## 💡 Tips Pro

### 1. Usa emojis para identificar rápido
```typescript
console.log('🚀 INICIO');      // Inicio de proceso
console.log('✅ ÉXITO');       // Operación exitosa
console.log('❌ ERROR');        // Error
console.log('📊 DATOS');        // Datos/resultados
console.log('🔍 DEBUG');        // Debugging
console.log('⚠️ ADVERTENCIA');  // Warning
```

### 2. Agrupa logs relacionados
```typescript
console.group('🎯 Proceso de Inferencia');
console.log('Modelo:', modelId);
console.log('Backend:', backend);
console.log('Opciones:', options);
console.groupEnd();
```

### 3. Mide tiempo de ejecución
```typescript
console.time('⏱️ Inferencia');
// ... código que tarda ...
console.timeEnd('⏱️ Inferencia');
// Muestra: ⏱️ Inferencia: 450ms
```

### 4. Log condicional (solo si hay error)
```typescript
if (!results) {
  console.error('❌ No hay resultados:', {
    modelId,
    videoElement,
    options
  });
}
```

### 5. Limpiar consola cuando quieras
```typescript
console.clear(); // Borra todo
```

---

## 🐛 Ejemplo Real: Debuguear CLIP

### Problema
CLIP no muestra resultados correctamente.

### Estrategia de logs

1. **Ver si el modelo cargó:**
   - Busca: `✓ Modelo clip cargado exitosamente`

2. **Ver si la inferencia se ejecutó:**
   - Busca: `▶️ Ejecutando clip con wasm...`

3. **Ver la estructura de resultados:**
   - Busca: `📊 Raw results structure:`
   - Expande el objeto `sample`

4. **Ver qué recibe ResultsDisplay:**
   - Busca: `🔍 Classification results received:`

5. **Comparar:**
   - ¿`sample` y `results received` son iguales?
   - ¿`isArray` es true?
   - ¿Tiene la estructura esperada: `[{label, score}, ...]`?

### Ejemplo de lo que deberías ver

```javascript
📊 Raw results structure: {
  type: "object",
  isArray: true,  // ← Debería ser true
  keys: ["0", "1", "2", "3", "4", "5", "6"],  // ← 7 resultados
  sample: [
    { label: "persona", score: 0.85 },
    { label: "auto", score: 0.10 },
    { label: "perro", score: 0.03 },
    // ...
  ]
}
```

Si ves algo **diferente**, ese es tu bug! 🎯

---

## 📝 Plantilla para agregar logs

Copia y pega esto donde necesites:

```typescript
// =====================================
// 🔍 DEBUG: [Descripción de qué estás investigando]
// =====================================
console.log('🔍 [NOMBRE_VARIABLE]:', {
  valor: tuVariable,
  tipo: typeof tuVariable,
  esArray: Array.isArray(tuVariable),
  esNull: tuVariable === null,
  esUndefined: tuVariable === undefined,
  keys: tuVariable ? Object.keys(tuVariable) : [],
});
// =====================================
```

---

## ⚡ Shortcuts útiles

- **F12**: Abrir/cerrar DevTools
- **Ctrl+L**: Limpiar consola
- **Ctrl+F**: Buscar en consola
- **▶️**: Expandir objeto
- **⬇️**: Colapsar objeto

---

## 🎓 Próximos pasos

1. ✅ Lee esta guía
2. ⏭️ Abre tu app con `npm run dev`
3. 🔍 Abre DevTools (F12)
4. 🎯 Ejecuta CLIP y mira los logs
5. 📋 Copia el log `📊 Raw results structure:`
6. 💬 Compártelo conmigo para analizarlo juntos

**¡Ahora ya sabes logear como un pro!** 🚀
