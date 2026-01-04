/**
 * HF Vision Demo - Configuration
 * Centraliza todos los modelos y configuraciones de la aplicación
 *
 * Para agregar un nuevo modelo:
 * 1. Agrega una entrada al MODEL_REGISTRY
 * 2. La UI se generará automáticamente
 */

// Registro de modelos disponibles
export const MODEL_REGISTRY = {
  vit: {
    id: 'vit',
    name: 'ViT Classifier',
    icon: '',
    task: 'image-classification',
    model: 'Xenova/vit-base-patch16-224',
    displayName: 'Vision Transformer (ViT)',
    description: 'google/vit-base-patch16-224',
    buttonClass: 'vit-btn',
    resultId: 'vitResult',
    // Configuración WebGPU
    webgpu: {
      device: 'webgpu',
      dtype: 'fp32'
    },
    // Fallback a WASM si WebGPU no disponible
    fallback: {
      device: 'wasm',
      dtype: 'q8'
    }
  },

  clip: {
    id: 'clip',
    name: 'CLIP Zero-Shot',
    icon: '',
    task: 'zero-shot-image-classification',
    model: 'Xenova/clip-vit-base-patch32',
    displayName: 'CLIP (Contrastive Language-Image)',
    description: 'openai/clip-vit-base-patch32',
    buttonClass: 'clip-btn',
    resultId: 'clipResult',
    // Prompts por defecto para CLIP
    defaultPrompts: [
      'a photo of a person',
      'a photo of an animal',
      'a photo of a car',
      'a photo of food',
      'a photo of a building',
      'a photo of nature',
      'a photo of technology',
      'a photo of furniture',
      'a photo of clothing'
    ],
    webgpu: {
      device: 'webgpu',
      dtype: 'fp32'
    },
    fallback: {
      device: 'wasm',
      dtype: 'q8'
    }
  },

  detr: {
    id: 'detr',
    name: 'DETR Object Detection',
    icon: '',
    task: 'object-detection',
    model: 'Xenova/detr-resnet-50',
    displayName: 'DETR (Detection Transformer)',
    description: 'facebook/detr-resnet-50',
    buttonClass: 'detr-btn',
    resultId: 'detrResult',
    webgpu: {
      device: 'webgpu',
      dtype: 'fp32'
    },
    fallback: {
      device: 'wasm',
      dtype: 'q8'
    }
  }
};

// Configuración de WebGPU
export const WEBGPU_CONFIG = {
  enabled: true,
  fallbackToWasm: true,
  checkSupport: true,
  // Timeout para detección de WebGPU (ms)
  detectionTimeout: 5000
};

// Configuración general de la aplicación
export const APP_CONFIG = {
  // Configuración de cámara
  camera: {
    width: 640,
    height: 480,
    facingMode: 'user'
  },
  // Calidad de imagen capturada
  imageQuality: 0.9,
  // Número máximo de resultados a mostrar
  maxResults: 5,
  // Transformers.js CDN
  transformersVersion: '2.17.2'
};

// Información de compatibilidad de navegadores
export const BROWSER_SUPPORT = {
  chrome: {
    supported: true,
    minVersion: 113,
    name: 'Google Chrome',
    url: 'https://www.google.com/chrome/',
    notes: 'WebGPU completamente soportado'
  },
  edge: {
    supported: true,
    minVersion: 113,
    name: 'Microsoft Edge',
    url: 'https://www.microsoft.com/edge',
    notes: 'WebGPU completamente soportado'
  },
  firefox: {
    supported: false,
    name: 'Mozilla Firefox',
    notes: 'WebGPU experimental - requiere habilitar flag'
  },
  safari: {
    supported: false,
    name: 'Apple Safari',
    notes: 'WebGPU no disponible - usará WASM'
  }
};

// Colores para visualización de bounding boxes
export const DETECTION_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#FF8E53',
  '#7FCDCD'
];
