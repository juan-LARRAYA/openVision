/**
 * HF Vision Demo - Model Loading & WebGPU Management
 * Maneja la detección de WebGPU y carga de modelos
 */

import { MODEL_REGISTRY, WEBGPU_CONFIG } from './config.js';

// Cache de modelos cargados
const modelCache = {};

// Estado de WebGPU
let webgpuState = {
  supported: false,
  adapter: null,
  device: null,
  reason: null,
  hasFp16: false
};

/**
 * Detecta si WebGPU está disponible en el navegador
 * @returns {Promise<Object>} Estado de soporte de WebGPU
 */
export async function checkWebGPUSupport() {
  if (!WEBGPU_CONFIG.checkSupport) {
    return { supported: false, reason: 'WebGPU check disabled in config' };
  }

  // Verificar si navigator.gpu existe
  if (!navigator.gpu) {
    return {
      supported: false,
      reason: 'WebGPU no disponible en este navegador'
    };
  }

  try {
    // Request adapter
    const adapter = await Promise.race([
      navigator.gpu.requestAdapter(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), WEBGPU_CONFIG.detectionTimeout)
      )
    ]);

    if (!adapter) {
      return {
        supported: false,
        reason: 'No se pudo obtener adaptador WebGPU'
      };
    }

    // Request device
    const device = await adapter.requestDevice();

    // Detectar soporte de fp16 (opcional pero recomendado)
    const hasFp16 = adapter.features.has('shader-f16');

    webgpuState = {
      supported: true,
      adapter,
      device,
      hasFp16,
      reason: null
    };

    console.log('✓ WebGPU disponible');
    console.log('  - FP16 support:', hasFp16);
    console.log('  - Max buffer size:', device.limits.maxBufferSize);

    return webgpuState;

  } catch (error) {
    console.warn('⚠ Error detectando WebGPU:', error.message);
    return {
      supported: false,
      reason: error.message
    };
  }
}

/**
 * Obtiene el estado actual de WebGPU
 * @returns {Object} Estado de WebGPU
 */
export function getWebGPUState() {
  return webgpuState;
}

/**
 * Carga un modelo con la configuración apropiada
 * @param {Object} modelConfig - Configuración del modelo desde MODEL_REGISTRY
 * @param {Object} transformers - Objeto de transformers.js
 * @param {Function} progressCallback - Callback para reportar progreso
 * @returns {Promise<Object>} Modelo cargado
 */
export async function loadModel(modelConfig, transformers, progressCallback) {
  const { pipeline, env } = transformers;

  // Verificar si el modelo ya está en cache
  if (modelCache[modelConfig.id]) {
    console.log(`Modelo ${modelConfig.id} recuperado del cache`);
    return modelCache[modelConfig.id];
  }

  // Determinar configuración según disponibilidad de WebGPU
  const useWebGPU = webgpuState.supported && WEBGPU_CONFIG.enabled;
  const config = useWebGPU ? modelConfig.webgpu : modelConfig.fallback;

  // Logging detallado con estructura
  console.log(`┌─ Cargando modelo: ${modelConfig.id}`);
  console.log(`├─ Backend: ${config.device.toUpperCase()}`);
  console.log(`├─ Dtype: ${config.dtype}`);
  console.log(`└─ Ruta: ${modelConfig.model}`);

  try {
    // Configurar Transformers.js
    env.allowRemoteModels = true;
    env.allowLocalModels = false;

    // Cargar modelo con configuración específica
    const model = await pipeline(
      modelConfig.task,
      modelConfig.model,
      {
        device: config.device,
        dtype: config.dtype,
        progress_callback: (progress) => {
          if (progressCallback) {
            progressCallback(modelConfig.id, progress);
          }
        }
      }
    );

    // Guardar en cache
    modelCache[modelConfig.id] = model;

    console.log(`✓ Modelo ${modelConfig.id} cargado exitosamente con ${config.device.toUpperCase()}`);
    return model;

  } catch (error) {
    console.error(`✗ Error cargando modelo ${modelConfig.id}:`, error);

    // Si falló con WebGPU, intentar fallback a WASM
    if (useWebGPU && WEBGPU_CONFIG.fallbackToWasm) {
      console.log(`Intentando fallback a WASM para ${modelConfig.id}`);

      try {
        const fallbackConfig = modelConfig.fallback;
        const model = await pipeline(
          modelConfig.task,
          modelConfig.model,
          {
            device: fallbackConfig.device,
            dtype: fallbackConfig.dtype,
            progress_callback: (progress) => {
              if (progressCallback) {
                progressCallback(modelConfig.id, progress);
              }
            }
          }
        );

        modelCache[modelConfig.id] = model;
        console.log(`✓ Modelo ${modelConfig.id} cargado con WASM (fallback)`);
        return model;

      } catch (fallbackError) {
        console.error(`✗ Fallback también falló:`, fallbackError);
        throw new Error(`No se pudo cargar el modelo: ${fallbackError.message}`);
      }
    }

    throw error;
  }
}

/**
 * Carga todos los modelos del registro de forma secuencial
 * @param {Object} transformers - Objeto de transformers.js
 * @param {Function} progressCallback - Callback para reportar progreso global
 * @returns {Promise<Object>} Objeto con todos los modelos cargados
 */
export async function loadAllModels(transformers, progressCallback) {
  const models = {};
  const modelIds = Object.keys(MODEL_REGISTRY);
  const totalModels = modelIds.length;

  for (let i = 0; i < modelIds.length; i++) {
    const modelId = modelIds[i];
    const modelConfig = MODEL_REGISTRY[modelId];

    try {
      // Callback de progreso global
      if (progressCallback) {
        progressCallback({
          modelId,
          modelIndex: i,
          totalModels,
          status: 'loading',
          progress: (i / totalModels) * 100
        });
      }

      // Callback de progreso individual del modelo
      const individualProgress = (id, progress) => {
        if (progressCallback) {
          progressCallback({
            modelId: id,
            modelIndex: i,
            totalModels,
            status: 'loading',
            progress: ((i + (progress.progress || 0) / 100) / totalModels) * 100,
            modelProgress: progress
          });
        }
      };

      // Cargar modelo
      models[modelId] = await loadModel(modelConfig, transformers, individualProgress);

      // Callback de finalización individual
      if (progressCallback) {
        progressCallback({
          modelId,
          modelIndex: i,
          totalModels,
          status: 'loaded',
          progress: ((i + 1) / totalModels) * 100
        });
      }

    } catch (error) {
      console.error(`Error cargando modelo ${modelId}:`, error);

      if (progressCallback) {
        progressCallback({
          modelId,
          modelIndex: i,
          totalModels,
          status: 'error',
          error: error.message,
          progress: ((i + 1) / totalModels) * 100
        });
      }

      // No romper la carga completa, continuar con el siguiente modelo
      models[modelId] = null;
    }
  }

  return models;
}

/**
 * Obtiene un modelo del cache
 * @param {string} modelId - ID del modelo
 * @returns {Object|null} Modelo o null si no está cargado
 */
export function getModel(modelId) {
  return modelCache[modelId] || null;
}

/**
 * Limpia el cache de modelos (útil para liberar memoria)
 */
export function clearModelCache() {
  Object.keys(modelCache).forEach(key => {
    delete modelCache[key];
  });
  console.log('Cache de modelos limpiado');
}

/**
 * Ejecuta inferencia con un modelo
 * @param {string} modelId - ID del modelo
 * @param {*} input - Input para el modelo (imagen, texto, etc.)
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<*>} Resultados de la inferencia
 */
export async function runInference(modelId, input, options = {}) {
  const model = getModel(modelId);

  if (!model) {
    throw new Error(`Modelo ${modelId} no está cargado`);
  }

  const backend = webgpuState.supported ? 'WebGPU' : 'WASM';
  console.log(`▶ Ejecutando ${modelId} con ${backend}...`);

  const startTime = performance.now();

  try {
    let results;

    // Caso especial para CLIP con prompts
    if (modelId === 'clip' && options.prompts) {
      results = await model(input, options.prompts);
    } else {
      results = await model(input);
    }

    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✓ ${modelId} completado en ${processingTime}s`);

    return {
      results,
      processingTime,
      backend: webgpuState.supported ? 'webgpu' : 'wasm'
    };

  } catch (error) {
    console.error(`✗ Error en inferencia de ${modelId}:`, error);
    throw error;
  }
}
