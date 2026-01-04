/**
 * WebGPU types
 */

export interface WebGPUState {
  supported: boolean;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  reason: string | null;
  hasFp16: boolean;
}

export interface WebGPUCheckResult {
  supported: boolean;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  reason: string | null;
  hasFp16: boolean;
}

// Extend Navigator type for WebGPU
declare global {
  interface Navigator {
    gpu?: GPU;
  }
}
