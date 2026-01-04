# 🚀 Instrucciones Rápidas - HF Vision Demo

## ⚡ Inicio Rápido (5 minutos)

### 1. Activar entorno y ejecutar backend
```bash
cd "IA/huggin face/hf-vision-demo"
source .venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Abrir frontend
- Abre `frontend/index.html` en tu navegador
- Permite acceso a la cámara

### 3. ¡Listo! Prueba los botones:
- 🔍 **ViT Classifier** - Clasifica objetos
- 🎯 **CLIP Zero-Shot** - Categorías predefinidas  
- 📦 **DETR Object Detection** - Detecta y marca objetos
- 🎨 **CLIP Custom** - Tus propios prompts

## 🎯 Los 3 Modelos Más Populares

### 1. CLIP (OpenAI)
- **Qué hace**: Entiende texto + imágenes
- **Ejemplo**: "una persona feliz, un gato, comida"
- **Uso**: Clasificación flexible con palabras

### 2. ViT (Google)  
- **Qué hace**: Clasifica en 1000 categorías
- **Ejemplo**: "Golden Retriever 85%"
- **Uso**: Identificación precisa de objetos

### 3. DETR (Facebook)
- **Qué hace**: Encuentra objetos y los marca
- **Ejemplo**: Cajas alrededor de personas/carros
- **Uso**: Detección múltiple de objetos

## 🎨 Prompts Divertidos para CLIP Custom

### Emociones
```
persona feliz, persona triste, persona sorprendida, persona enojada
```

### Animales
```
gato, perro, pájaro, pez, conejo
```

### Comida
```
pizza, hamburguesa, ensalada, fruta, postre
```

### Tecnología
```
computadora, teléfono, tablet, auriculares, cámara
```

### Actividades
```
persona trabajando, persona ejercitándose, persona leyendo, persona cocinando
```

## 🔧 Solución de Problemas

### ❌ Error de cámara
- Verifica permisos del navegador
- Prueba con otro navegador

### ❌ Modelos lentos
- Normal en primera ejecución (descarga modelos)
- Usa GPU si está disponible

### ❌ Error de conexión
- Verifica que el backend esté ejecutándose en puerto 8000
- Revisa la consola del navegador

## 📊 Estadísticas de los Modelos

| Modelo | Tamaño | Velocidad | Precisión |
|--------|--------|-----------|-----------|
| CLIP   | ~600MB | Media     | Alta      |
| ViT    | ~350MB | Rápida    | Muy Alta  |
| DETR   | ~170MB | Media     | Alta      |

## 🎯 Casos de Uso Reales

### 🏥 Medicina
- CLIP: "radiografía normal, fractura, tumor"

### 🛒 E-commerce  
- ViT: Clasificar productos automáticamente

### 🚗 Vehículos Autónomos
- DETR: Detectar peatones, carros, señales

### 📱 Redes Sociales
- CLIP: "contenido apropiado, contenido inapropiado"

### 🏭 Control de Calidad
- DETR: Detectar defectos en productos

## 💡 Tips Avanzados

### Para mejores resultados con CLIP:
- Usa descripciones específicas
- Incluye contexto: "una foto de..."
- Prueba sinónimos si no funciona

### Para ViT:
- Funciona mejor con objetos centrados
- Buena iluminación mejora resultados

### Para DETR:
- Puede detectar múltiples objetos
- Las cajas de colores indican diferentes detecciones

## 🎉 ¡Experimenta!

La aplicación está diseñada para ser intuitiva. ¡Prueba diferentes objetos, poses y escenarios para ver cómo responden los modelos!

---
**Creado con los 3 modelos de visión artificial más descargados de Hugging Face** 🤗
