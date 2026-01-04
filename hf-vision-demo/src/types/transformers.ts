/**
 * Transformers.js types
 */

export interface TransformersModule {
  env: {
    backends: {
      onnx: {
        wasm: {
          proxy: boolean;
        };
      };
    };
    allowLocalModels: boolean;
    allowRemoteModels: boolean;
  };
  pipeline: PipelineFactory;
  AutoModel: unknown;
  AutoProcessor: unknown;
  RawImage: RawImageConstructor;
}

export type PipelineFactory = (
  task: string,
  model: string,
  config?: PipelineConfig
) => Promise<Pipeline>;

export interface PipelineConfig {
  device?: string;
  dtype?: string;
  progress_callback?: (progress: ProgressCallbackData) => void;
}

export interface ProgressCallbackData {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export interface Pipeline {
  (input: unknown, options?: unknown): Promise<PipelineResult>;
  dispose?: () => Promise<void>;
}

export type PipelineResult =
  | ImageClassificationResult[]
  | ZeroShotClassificationResult[]
  | ObjectDetectionResult[];

export interface ImageClassificationResult {
  label: string;
  score: number;
}

export interface ZeroShotClassificationResult {
  label: string;
  score: number;
}

export interface ObjectDetectionResult {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export interface RawImageConstructor {
  fromCanvas(canvas: HTMLCanvasElement): RawImage;
}

export interface RawImage {
  toCanvas(): HTMLCanvasElement;
}
