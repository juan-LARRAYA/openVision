/**
 * HF Vision Demo - UI Management
 * Maneja todas las actualizaciones de interfaz de usuario
 */

import { MODEL_REGISTRY, APP_CONFIG, DETECTION_COLORS } from './config.js';
import { getCanvasContext, getVideoElement, getCanvasElement } from './camera.js';

/**
 * Actualiza el badge de backend (WebGPU/WASM)
 * @param {boolean} isWebGPU - true si está usando WebGPU
 */
export function updateBackendBadge(isWebGPU) {
  const badge = document.getElementById('backendBadge');
  if (!badge) return;

  if (isWebGPU) {
    badge.textContent = 'WebGPU';
    badge.className = 'badge webgpu-badge';
  } else {
    badge.textContent = 'CPU (WASM)';
    badge.className = 'badge wasm-badge';
  }
}

/**
 * Muestra el panel de estado durante la carga
 * @param {string} message - Mensaje a mostrar
 * @param {string} icon - Emoji/icono (opcional, se ignora para diseño minimalista)
 */
export function showStatusPanel(message, icon = '') {
  const panel = document.getElementById('statusPanel');
  if (!panel) return;

  const iconEl = panel.querySelector('.status-icon') || panel.querySelector('#statusIcon');
  const titleEl = panel.querySelector('.status-header span:last-child') || panel.querySelector('#statusTitle');

  if (iconEl) iconEl.textContent = '';  // Sin emoji
  if (titleEl) titleEl.textContent = message;

  panel.style.display = 'block';
}

/**
 * Oculta el panel de estado
 */
export function hideStatusPanel() {
  const panel = document.getElementById('statusPanel');
  if (panel) {
    panel.style.display = 'none';
  }
}

/**
 * Actualiza el progreso de carga de un modelo
 * @param {Object} progress - Objeto con información de progreso
 */
export function updateModelProgress(progress) {
  const { modelId, status, progress: percent, error, modelProgress } = progress;

  // Actualizar barra de progreso del modelo
  const progressEl = document.getElementById(`${modelId}Progress`);
  if (progressEl) {
    const fillEl = progressEl.querySelector('.progress-fill');
    const statusEl = progressEl.querySelector('.model-status');

    if (fillEl && modelProgress) {
      fillEl.style.width = `${modelProgress.progress || 0}%`;
    }

    if (statusEl) {
      if (status === 'loading') {
        statusEl.textContent = modelProgress?.file || 'Cargando...';
      } else if (status === 'loaded') {
        statusEl.textContent = 'Cargado';
        if (fillEl) fillEl.style.width = '100%';
      } else if (status === 'error') {
        statusEl.textContent = `Error: ${error}`;
        if (fillEl) fillEl.style.background = '#EF4444';
      }
    }
  }

  // Actualizar mensaje global de estado
  const statusText = document.getElementById('statusText');
  if (statusText && status === 'loading') {
    const modelConfig = MODEL_REGISTRY[modelId];
    statusText.textContent = `Cargando ${modelConfig?.displayName || modelId}... ${Math.round(percent)}%`;
  }
}

/**
 * Muestra el banner de advertencia cuando WebGPU no está disponible
 * @param {string} reason - Razón por la cual WebGPU no está disponible
 */
export function showWebGPUWarning(reason) {
  const banner = document.getElementById('warningBanner');
  if (!banner) return;

  banner.innerHTML = `
    <h3>WebGPU No Disponible</h3>
    <p><strong>Razón:</strong> ${reason}</p>
    <p>La aplicación funcionará en modo CPU (WASM), lo cual será más lento.</p>
    <p>Para mejor rendimiento, usa <a href="https://www.google.com/chrome/" target="_blank">Chrome 113+</a> o <a href="https://www.microsoft.com/edge" target="_blank">Edge 113+</a></p>
  `;

  banner.style.display = 'block';
}

/**
 * Genera botones de control dinámicamente desde MODEL_REGISTRY
 * @returns {string} HTML de los botones
 */
export function generateControlButtons() {
  return Object.values(MODEL_REGISTRY).map(model => `
    <button id="${model.id}Btn" class="${model.buttonClass}" data-model-id="${model.id}">
      ${model.name}
    </button>
  `).join('');
}

/**
 * Genera tarjetas de resultados dinámicamente desde MODEL_REGISTRY
 * @returns {string} HTML de las tarjetas
 */
export function generateResultCards() {
  return Object.values(MODEL_REGISTRY).map(model => `
    <div class="result" id="${model.resultId}" style="display:none;">
      <div class="result-header">
        <h3>${model.displayName}</h3>
        <!-- Badges will be added dynamically -->
      </div>
      <div class="model-info">${model.description}</div>
      <div id="${model.id}Content" class="result-content"></div>
    </div>
  `).join('');
}

/**
 * Muestra estado de carga en una tarjeta de resultados
 * @param {string} modelId - ID del modelo
 */
export function showResultLoading(modelId) {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return;

  const resultEl = document.getElementById(config.resultId);
  const contentEl = document.getElementById(`${modelId}Content`);

  if (resultEl) resultEl.style.display = 'block';
  if (contentEl) contentEl.innerHTML = '<div class="loading">Procesando imagen...</div>';

  // Limpiar badges si existen
  const existingBadges = resultEl?.querySelector('.result-badges');
  if (existingBadges) {
    existingBadges.innerHTML = '';
  }
}

/**
 * Muestra resultados de inferencia en una tarjeta (con badge consolidado)
 * @param {string} modelId - ID del modelo
 * @param {Array} results - Resultados de la inferencia
 * @param {string} backend - Backend usado (webgpu/wasm)
 * @param {number} processingTime - Tiempo de procesamiento en segundos
 */
export function showResults(modelId, results, backend, processingTime) {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return;

  const contentEl = document.getElementById(`${modelId}Content`);
  const resultEl = document.getElementById(config.resultId);

  // Find or create badge container
  let badgeContainer = resultEl?.querySelector('.result-badges');
  if (!badgeContainer && resultEl) {
    const header = resultEl.querySelector('.result-header');
    badgeContainer = document.createElement('div');
    badgeContainer.className = 'result-badges';
    header.appendChild(badgeContainer);
  }

  // Consolidated badge: Backend + Time
  if (badgeContainer) {
    const backendClass = backend === 'webgpu' ? 'webgpu' : 'wasm';
    const backendLabel = backend === 'webgpu' ? 'WebGPU' : 'WASM';

    badgeContainer.innerHTML = `
      <span class="processing-badge ${backendClass}">${backendLabel} · ${processingTime}s</span>
    `;
  }

  // Mostrar resultados
  if (!results || results.length === 0) {
    if (contentEl) {
      contentEl.innerHTML = '<div class="loading">No se encontraron resultados</div>';
    }
    return;
  }

  let html = '';
  const maxResults = APP_CONFIG.maxResults;

  results.slice(0, maxResults).forEach(result => {
    const score = Math.round(result.score * 100);
    html += `
      <div class="result-item">
        <span>${result.label}</span>
        <span class="score">${score}%</span>
      </div>
    `;
  });

  if (contentEl) {
    contentEl.innerHTML = html;
  }
}

/**
 * Muestra error en una tarjeta de resultados
 * @param {string} modelId - ID del modelo
 * @param {string} errorMessage - Mensaje de error
 */
export function showResultError(modelId, errorMessage) {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return;

  const contentEl = document.getElementById(`${modelId}Content`);
  if (contentEl) {
    contentEl.innerHTML = `<div class="loading">Error: ${errorMessage}</div>`;
  }
}

/**
 * Dibuja bounding boxes para detección de objetos
 * @param {Array} detections - Array de detecciones con boxes
 */
export function drawDetections(detections) {
  const ctx = getCanvasContext();
  const video = getVideoElement();
  const canvas = getCanvasElement();

  if (!ctx || !video || !canvas) return;

  // Limpiar y redibujar frame del video
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Configuración de dibujo
  ctx.lineWidth = 3;
  ctx.font = 'bold 16px Inter, Arial';

  detections.forEach((detection, index) => {
    if (!detection.box) return;

    const box = detection.box;
    const x = box.xmin;
    const y = box.ymin;
    const width = box.xmax - box.xmin;
    const height = box.ymax - box.ymin;

    // Color del bounding box
    const color = DETECTION_COLORS[index % DETECTION_COLORS.length];

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Dibujar bounding box
    ctx.strokeRect(x, y, width, height);

    // Preparar label
    const label = `${detection.label} ${Math.round(detection.score * 100)}%`;
    const textMetrics = ctx.measureText(label);
    const textHeight = 20;

    // Dibujar fondo del label
    ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight);

    // Dibujar texto del label
    ctx.fillStyle = 'white';
    ctx.fillText(label, x + 5, y - 5);
  });
}

/**
 * Limpia el canvas de detecciones
 */
export function clearDetections() {
  const ctx = getCanvasContext();
  const canvas = getCanvasElement();

  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Agrega clase CSS de procesamiento a un botón
 * @param {string} buttonId - ID del botón
 * @param {boolean} isProcessing - true para activar, false para desactivar
 */
export function setButtonProcessing(buttonId, isProcessing) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (isProcessing) {
    button.classList.add('processing');
    button.disabled = true;
  } else {
    button.classList.remove('processing');
    button.disabled = false;
  }
}

/**
 * Muestra u oculta controles
 * @param {boolean} show - true para mostrar, false para ocultar
 */
export function toggleControls(show) {
  const controls = document.getElementById('controls');
  const customPrompts = document.getElementById('customPromptsSection');

  if (controls) {
    controls.style.display = show ? 'flex' : 'none';
  }

  if (customPrompts) {
    customPrompts.style.display = show ? 'block' : 'none';
  }
}

/**
 * Inicializa la estructura HTML dinámica
 */
export function initializeDynamicUI() {
  // Generar botones de control
  const controlsEl = document.getElementById('controls');
  if (controlsEl && !controlsEl.hasChildNodes()) {
    controlsEl.innerHTML = generateControlButtons();
  }

  // Generar tarjetas de resultados
  const resultsGrid = document.getElementById('resultsGrid');
  if (resultsGrid && !resultsGrid.hasChildNodes()) {
    resultsGrid.innerHTML = generateResultCards();
  }
}

/* ===========================
   MODAL DE WEBGPU
   =========================== */

/**
 * Muestra el modal de notificación WebGPU
 * @param {boolean} isSupported - Si WebGPU está soportado
 * @param {string} reason - Razón si no está soportado
 */
export function showWebGPUModal(isSupported, reason = '') {
  const modal = document.getElementById('webgpuModal');
  const statusEl = document.getElementById('webgpuModalStatus');
  const iconEl = document.getElementById('webgpuStatusIcon');
  const titleEl = document.getElementById('webgpuStatusTitle');
  const descEl = document.getElementById('webgpuStatusDescription');
  const contentEl = document.getElementById('webgpuModalContent');

  if (!modal) return;

  if (isSupported) {
    // Success state
    statusEl.className = 'modal-status success';
    iconEl.textContent = '✓';
    titleEl.textContent = 'WebGPU Activo';
    descEl.textContent = 'Aceleración por hardware habilitada';

    contentEl.innerHTML = `
      <p>Tu navegador soporta WebGPU, lo que significa que los modelos de IA se ejecutarán con aceleración por hardware usando tu GPU.</p>
      <p style="margin-bottom: 0;"><strong>Rendimiento:</strong> Alto (hasta 10x más rápido que CPU)</p>
    `;
  } else {
    // Warning state
    statusEl.className = 'modal-status warning';
    iconEl.textContent = '⚠';
    titleEl.textContent = 'WebGPU No Disponible';
    descEl.textContent = 'Ejecutando en modo CPU (WASM)';

    contentEl.innerHTML = `
      <p><strong>Razón:</strong> ${reason || 'WebGPU no está disponible en este navegador'}</p>
      <p>La aplicación funcionará en modo CPU (WASM), lo cual será más lento pero funcional.</p>
      <p style="margin-bottom: 0;"><strong>Recomendación:</strong> Para mejor rendimiento, usa <a href="https://www.google.com/chrome/" target="_blank" style="color: #0EA5E9;">Chrome 113+</a> o <a href="https://www.microsoft.com/edge" target="_blank" style="color: #0EA5E9;">Edge 113+</a></p>
    `;
  }

  modal.style.display = 'flex';
}

/**
 * Cierra el modal de WebGPU
 */
export function hideWebGPUModal() {
  const modal = document.getElementById('webgpuModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/* ===========================
   MODAL DE CONFIGURACIÓN
   =========================== */

/**
 * Muestra el modal de configuración de modelos
 */
export function showConfigModal() {
  const modal = document.getElementById('configModal');
  if (!modal) return;

  // Populate model list
  updateModelList();

  modal.style.display = 'flex';
}

/**
 * Cierra el modal de configuración
 */
export function hideConfigModal() {
  const modal = document.getElementById('configModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Actualiza la lista de modelos en el modal de configuración
 * @param {string} activeModelId - ID del modelo actualmente activo
 */
export function updateModelList(activeModelId = null) {
  const listEl = document.getElementById('modelList');
  if (!listEl) return;

  const html = Object.values(MODEL_REGISTRY).map(model => {
    const isActive = model.id === activeModelId;
    const isLoaded = true; // Por ahora, asumimos que están cargados

    return `
      <div class="model-item ${isActive ? 'active' : ''}" data-model-id="${model.id}">
        <div class="model-item-header">
          <div class="model-item-title">
            <span>${model.displayName}</span>
          </div>
          <span class="model-item-status ${isActive ? 'active' : (isLoaded ? 'loaded' : 'not-loaded')}">
            ${isActive ? 'Activo' : (isLoaded ? 'Cargado' : 'No cargado')}
          </span>
        </div>
        <div class="model-item-description">${model.description}</div>
        <div class="model-item-meta">
          <span>Task: ${model.task}</span>
          <span>Model: ${model.model.split('/')[1]}</span>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = html;
}
