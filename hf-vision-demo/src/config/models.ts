/**
 * Model registry configuration
 * Migrated from vanilla JS version
 */

import type { ModelRegistry } from '@/types/models';

export const MODEL_REGISTRY: ModelRegistry = {
  vit: {
    id: 'vit',
    icon: '',
    label: 'Vision Transformer (ViT)',
    description: 'Clasificación de imágenes en 1000 categorías de ImageNet',
    model: 'onnx-community/vit-base-patch16-224-in21k',
    type: 'image-classification',
    subtasks: ['image-classification'],
  },
  clip: {
    id: 'clip',
    icon: '',
    label: 'CLIP',
    description: 'Clasificación zero-shot con etiquetas personalizadas',
    model: 'Xenova/clip-vit-base-patch32',
    type: 'zero-shot-image-classification',
    subtasks: ['zero-shot-image-classification'],
    default_labels: ['persona', 'auto', 'perro', 'gato', 'árbol', 'edificio', 'comida'],
  },
  detr: {
    id: 'detr',
    icon: '',
    label: 'DETR',
    description: 'Detección de objetos con bounding boxes',
    model: 'Xenova/detr-resnet-50',
    type: 'object-detection',
    subtasks: ['object-detection'],
  },
};

export const STORAGE_KEY = 'hf_vision_custom_models';
