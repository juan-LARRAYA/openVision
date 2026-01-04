/**
 * Hook to load and manage Transformers.js library from CDN
 */

import { useState, useEffect } from 'react';
import type { TransformersModule } from '@/types/transformers';

const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

export function useTransformers() {
  const [transformers, setTransformers] = useState<TransformersModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTransformers() {
      try {
        console.log('┌─ Cargando Transformers.js desde CDN...');
        console.log(`├─ URL: ${TRANSFORMERS_CDN}`);

        const module = await import(/* @vite-ignore */ TRANSFORMERS_CDN) as TransformersModule;

        if (!mounted) return;

        // Configure Transformers.js environment
        module.env.backends.onnx.wasm.proxy = false;
        module.env.allowLocalModels = false;
        module.env.allowRemoteModels = true;

        console.log('└─ Transformers.js cargado exitosamente');

        setTransformers(module);
        setLoading(false);
      } catch (err) {
        console.error('✗ Error cargando Transformers.js:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setLoading(false);
        }
      }
    }

    loadTransformers();

    return () => {
      mounted = false;
    };
  }, []);

  return { transformers, loading, error };
}
