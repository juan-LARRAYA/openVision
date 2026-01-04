/**
 * HF Vision Demo - Main Application
 * Orquesta toda la aplicación: inicialización, eventos, y ejecución de modelos
 */

import { MODEL_REGISTRY, APP_CONFIG } from './config.js';
import { checkWebGPUSupport, loadAllModels, runInference } from './models.js';
import { initCamera, captureImage } from './camera.js';
import {
  updateBackendBadge,
  showStatusPanel,
  hideStatusPanel,
  updateModelProgress,
  showWebGPUWarning,
  showResultLoading,
  showResults,
  showResultError,
  drawDetections,
  setButtonProcessing,
  toggleControls,
  initializeDynamicUI,
  showWebGPUModal,
  hideWebGPUModal,
  showConfigModal,
  hideConfigModal,
  updateModelList
} from './ui.js';

// Estado global de la aplicación
const appState = {
  modelsLoaded: false,
  webgpuSupported: false,
  transformers: null
};

/**
 * Inicializa Transformers.js desde CDN
 * @returns {Promise<Object>} Objeto de transformers.js
 */
async function initTransformers() {
  try {
    console.log('Cargando Transformers.js...');

    // Importar desde CDN
    const transformers = await import(
      `https://cdn.jsdelivr.net/npm/@xenova/transformers@${APP_CONFIG.transformersVersion}`
    );

    appState.transformers = transformers;
    return transformers;

  } catch (error) {
    console.error('Error cargando Transformers.js:', error);
    throw new Error('No se pudo cargar Transformers.js desde CDN');
  }
}

/**
 * Inicializa todos los modelos de IA
 */
async function initModels() {
  try {
    showStatusPanel('Inicializando modelos de IA...');

    // Cargar modelos
    await loadAllModels(appState.transformers, (progress) => {
      updateModelProgress(progress);

      // Si todos los modelos están cargados
      if (progress.status === 'loaded' && progress.modelIndex === Object.keys(MODEL_REGISTRY).length - 1) {
        console.log('Todos los modelos cargados');

        setTimeout(() => {
          hideStatusPanel();
          toggleControls(true);
          appState.modelsLoaded = true;
        }, 500);
      }
    });

  } catch (error) {
    console.error('Error inicializando modelos:', error);
    showStatusPanel('Error cargando modelos: ' + error.message);
  }
}

/**
 * Procesa una imagen con un modelo específico
 * @param {string} modelId - ID del modelo a usar
 * @param {Object} options - Opciones adicionales (ej: prompts para CLIP)
 */
async function processImage(modelId, options = {}) {
  if (!appState.modelsLoaded) {
    alert('Los modelos aún se están cargando. Por favor espera...');
    return;
  }

  const buttonId = `${modelId}Btn`;

  try {
    // Marcar botón como procesando
    setButtonProcessing(buttonId, true);

    // Mostrar estado de carga en resultados
    showResultLoading(modelId);

    // Capturar imagen
    const imageData = captureImage();

    // Ejecutar inferencia
    const { results, processingTime, backend } = await runInference(
      modelId,
      imageData,
      options
    );

    console.log(`Inferencia ${modelId} completada en ${processingTime}s con ${backend}`);

    // Mostrar resultados
    showResults(modelId, results, backend, processingTime);

    // Si es DETR, dibujar bounding boxes
    if (modelId === 'detr') {
      drawDetections(results);
    }

  } catch (error) {
    console.error(`Error procesando con ${modelId}:`, error);
    showResultError(modelId, error.message);

  } finally {
    // Quitar estado de procesamiento del botón
    setButtonProcessing(buttonId, false);
  }
}

/**
 * Maneja el formulario de agregar nuevo modelo
 * @param {Event} e - Evento de submit
 */
async function handleAddNewModel(e) {
  e.preventDefault();

  const modelId = document.getElementById('newModelId').value.trim();
  const modelName = document.getElementById('newModelName').value.trim();
  const modelPath = document.getElementById('newModelPath').value.trim();
  const modelTask = document.getElementById('newModelTask').value;

  if (!modelId || !modelName || !modelPath || !modelTask) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Verificar si ya existe
  if (MODEL_REGISTRY[modelId]) {
    alert(`El modelo con ID "${modelId}" ya existe`);
    return;
  }

  // Crear configuración del modelo
  const newModel = {
    id: modelId,
    name: modelName,
    icon: '',
    task: modelTask,
    model: modelPath,
    displayName: modelName,
    description: modelPath,
    buttonClass: `${modelId}-btn`,
    resultId: `${modelId}Result`,
    webgpu: {
      device: 'webgpu',
      dtype: 'fp32'
    },
    fallback: {
      device: 'wasm',
      dtype: 'q8'
    }
  };

  // Agregar al registro
  MODEL_REGISTRY[modelId] = newModel;

  // Guardar en localStorage
  try {
    const customModels = JSON.parse(localStorage.getItem('hf-vision-custom-models') || '{}');
    customModels[modelId] = newModel;
    localStorage.setItem('hf-vision-custom-models', JSON.stringify(customModels));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }

  // Actualizar UI
  updateModelList();

  // Mostrar confirmación
  alert(`Modelo "${modelName}" agregado correctamente.\n\nRecarga la página para que esté disponible.`);

  // Limpiar formulario
  e.target.reset();
}

/**
 * Configura event listeners del modal de WebGPU
 * Se ejecuta inmediatamente después de mostrar el modal
 */
function setupWebGPUModalListeners() {
  const webgpuModalClose = document.getElementById('webgpuModalClose');
  const webgpuModalConfirm = document.getElementById('webgpuModalConfirm');
  const webgpuModal = document.getElementById('webgpuModal');

  console.log('Configurando listeners del modal WebGPU...');
  console.log('- Close button:', webgpuModalClose ? 'found' : 'NOT FOUND');
  console.log('- Confirm button:', webgpuModalConfirm ? 'found' : 'NOT FOUND');
  console.log('- Modal overlay:', webgpuModal ? 'found' : 'NOT FOUND');

  if (webgpuModalClose) {
    webgpuModalClose.addEventListener('click', () => {
      console.log('Close button clicked');
      hideWebGPUModal();
    });
  }

  if (webgpuModalConfirm) {
    webgpuModalConfirm.addEventListener('click', () => {
      console.log('Confirm button clicked');
      hideWebGPUModal();
    });
  }

  // Cerrar al hacer click fuera del modal
  if (webgpuModal) {
    webgpuModal.addEventListener('click', (e) => {
      if (e.target === webgpuModal) {
        console.log('Clicked outside modal');
        hideWebGPUModal();
      }
    });
  }
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
  // Event listeners para botones de modelos
  Object.keys(MODEL_REGISTRY).forEach(modelId => {
    const button = document.getElementById(`${modelId}Btn`);
    if (button) {
      button.addEventListener('click', () => {
        // Caso especial para CLIP con prompts por defecto
        if (modelId === 'clip') {
          const config = MODEL_REGISTRY.clip;
          processImage(modelId, { prompts: config.defaultPrompts });
        } else {
          processImage(modelId);
        }
      });
    }
  });

  // Event listener para CLIP custom
  const customClipBtn = document.getElementById('customClipBtn');
  const customPromptsInput = document.getElementById('customPrompts');

  if (customClipBtn) {
    customClipBtn.addEventListener('click', () => {
      const promptsText = customPromptsInput?.value.trim();

      if (!promptsText) {
        alert('Por favor ingresa algunos prompts separados por comas');
        return;
      }

      const prompts = promptsText.split(',').map(p => p.trim()).filter(p => p);

      if (prompts.length === 0) {
        alert('Por favor ingresa prompts válidos');
        return;
      }

      processImage('clip', { prompts });
    });
  }

  // Event listener para Enter en input de prompts
  if (customPromptsInput) {
    customPromptsInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        customClipBtn?.click();
      }
    });
  }

  // Event listeners para modal de configuración
  const configBtn = document.getElementById('configBtn');
  const configModalClose = document.getElementById('configModalClose');
  const configModalCancel = document.getElementById('configModalCancel');
  const configModal = document.getElementById('configModal');

  if (configBtn) {
    configBtn.addEventListener('click', showConfigModal);
  }

  if (configModalClose) {
    configModalClose.addEventListener('click', hideConfigModal);
  }

  if (configModalCancel) {
    configModalCancel.addEventListener('click', hideConfigModal);
  }

  // Cerrar al hacer click fuera del modal
  if (configModal) {
    configModal.addEventListener('click', (e) => {
      if (e.target === configModal) {
        hideConfigModal();
      }
    });
  }

  // Event listener para formulario de agregar modelo
  const addModelForm = document.getElementById('addModelForm');
  if (addModelForm) {
    addModelForm.addEventListener('submit', handleAddNewModel);
  }
}

/**
 * Inicializa la aplicación completa
 */
/**
 * Restaura modelos personalizados desde localStorage
 */
function restoreCustomModels() {
  try {
    const customModels = JSON.parse(localStorage.getItem('hf-vision-custom-models') || '{}');
    Object.entries(customModels).forEach(([id, config]) => {
      if (!MODEL_REGISTRY[id]) {
        MODEL_REGISTRY[id] = config;
        console.log(`Modelo personalizado ${id} restaurado`);
      }
    });
  } catch (error) {
    console.error('Error restaurando modelos personalizados:', error);
  }
}

async function initApp() {
  try {
    console.log('Iniciando HF Vision Demo...');

    // Restaurar modelos personalizados
    restoreCustomModels();

    // Inicializar UI dinámica
    initializeDynamicUI();

    // Verificar soporte de WebGPU
    showStatusPanel('Detectando WebGPU...');
    const webgpuState = await checkWebGPUSupport();

    appState.webgpuSupported = webgpuState.supported;

    // Actualizar UI según soporte de WebGPU
    if (webgpuState.supported) {
      console.log('WebGPU disponible - Modo de alto rendimiento');
      updateBackendBadge(true);
    } else {
      console.warn('WebGPU no disponible:', webgpuState.reason);
      updateBackendBadge(false);
      showWebGPUWarning(webgpuState.reason);
    }

    // Mostrar modal de WebGPU
    showWebGPUModal(webgpuState.supported, webgpuState.reason);

    // Configurar event listeners del modal WebGPU INMEDIATAMENTE
    setupWebGPUModalListeners();

    // Inicializar Transformers.js
    showStatusPanel('Cargando Transformers.js...');
    await initTransformers();

    // Inicializar cámara
    showStatusPanel('Iniciando cámara...');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    try {
      await initCamera(video, canvas);
      console.log('Cámara inicializada');
    } catch (cameraError) {
      console.error('Error con cámara:', cameraError);
      showStatusPanel(cameraError.message);
      // Continuar sin cámara - se puede usar imagen estática
    }

    // Cargar modelos
    await initModels();

    // Configurar event listeners
    setupEventListeners();

    console.log('Aplicación inicializada correctamente');

  } catch (error) {
    console.error('Error fatal durante inicialización:', error);
    showStatusPanel(`Error fatal: ${error.message}`);
  }
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Exportar funciones para debugging
window.appDebug = {
  getState: () => appState,
  processImage,
  reloadModels: initModels
};
