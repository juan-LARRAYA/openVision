/**
 * Hook to detect and manage WebGPU support
 */

import { useState, useEffect } from 'react';
import type { WebGPUState } from '@/types/webgpu';

export function useWebGPU() {
  const [webgpuState, setWebgpuState] = useState<WebGPUState>({
    supported: false,
    adapter: null,
    device: null,
    reason: null,
    hasFp16: false,
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkWebGPUSupport();
  }, []);

  async function checkWebGPUSupport() {
    setChecking(true);

    console.log('┌─ Verificando soporte WebGPU...');

    // Check if WebGPU API is available
    if (!navigator.gpu) {
      console.log('└─ WebGPU no está disponible en este navegador');
      setWebgpuState({
        supported: false,
        adapter: null,
        device: null,
        reason: 'WebGPU API no disponible en este navegador. Usa Chrome/Edge 113+',
        hasFp16: false,
      });
      setChecking(false);
      return;
    }

    try {
      // Request adapter
      const adapter = await navigator.gpu.requestAdapter();

      if (!adapter) {
        console.log('└─ No se pudo obtener adaptador WebGPU');
        setWebgpuState({
          supported: false,
          adapter: null,
          device: null,
          reason: 'No se encontró adaptador WebGPU compatible',
          hasFp16: false,
        });
        setChecking(false);
        return;
      }

      console.log('├─ Adaptador WebGPU encontrado');
      console.log('├─ Features:', Array.from(adapter.features).join(', '));

      // Check for FP16 support
      const hasFp16 = adapter.features.has('shader-f16');
      console.log(`├─ FP16 support: ${hasFp16 ? 'Sí' : 'No'}`);

      // Request device
      const device = await adapter.requestDevice();
      console.log('└─ WebGPU completamente funcional');

      setWebgpuState({
        supported: true,
        adapter,
        device,
        reason: null,
        hasFp16,
      });
    } catch (err) {
      console.error('✗ Error inicializando WebGPU:', err);
      setWebgpuState({
        supported: false,
        adapter: null,
        device: null,
        reason: err instanceof Error ? err.message : 'Error desconocido',
        hasFp16: false,
      });
    }

    setChecking(false);
  }

  return { webgpuState, checking, recheckWebGPU: checkWebGPUSupport };
}
