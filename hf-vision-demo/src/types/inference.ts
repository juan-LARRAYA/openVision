/**
 * Inference types
 */

import type { Pipeline, PipelineResult } from './transformers';
import type { ModelType } from './models';

export interface InferenceState {
  isRunning: boolean;
  currentModel: string | null;
  backend: 'webgpu' | 'wasm';
  processingTime: string;
}

export interface LoadedPipeline {
  pipeline: Pipeline;
  modelId: string;
  backend: 'webgpu' | 'wasm';
  type: ModelType;
}

export interface InferenceResult {
  modelId: string;
  results: PipelineResult;
  backend: 'webgpu' | 'wasm';
  processingTime: string;
}

export interface InferenceOptions {
  labels?: string[];
  threshold?: number;
}
