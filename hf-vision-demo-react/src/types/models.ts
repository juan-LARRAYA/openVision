/**
 * Model configuration types
 */

export type ModelType = 'image-classification' | 'zero-shot-image-classification' | 'object-detection';

export interface ModelConfig {
  id: string;
  icon: string;
  label: string;
  description: string;
  model: string;
  type: ModelType;
  subtasks?: string[];
  default_labels?: string[];
  custom?: boolean;
}

export interface ModelRegistry {
  [key: string]: ModelConfig;
}

export interface CustomModel {
  id: string;
  label: string;
  description: string;
  model: string;
  type: ModelType;
  default_labels?: string[];
}
