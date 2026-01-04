/**
 * Hook to manage AI model loading and pipelines
 */

import { useState, useCallback } from 'react';
import type { TransformersModule } from '@/types/transformers';
import type { WebGPUState } from '@/types/webgpu';
import type { LoadedPipeline } from '@/types/inference';
import type { ModelConfig } from '@/types/models';

export function useModels(
  transformers: TransformersModule | null,
  webgpuState: WebGPUState
) {
  const [loadedModels, setLoadedModels] = useState<Map<string, LoadedPipeline>>(new Map());
  const [loadingModel, setLoadingModel] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState<{ [key: string]: number }>({});

  const loadModel = useCallback(
    async (modelConfig: ModelConfig) => {
      if (!transformers) {
        throw new Error('Transformers.js no está cargado');
      }

      // Check if already loaded
      if (loadedModels.has(modelConfig.id)) {
        console.log(`✓ Modelo ${modelConfig.id} ya está cargado`);
        return loadedModels.get(modelConfig.id)!;
      }

      setLoadingModel(modelConfig.id);

      try {
        const backend = webgpuState.supported ? 'webgpu' : 'wasm';
        const dtype = webgpuState.supported && webgpuState.hasFp16 ? 'fp16' : 'fp32';

        console.log(`┌─ Cargando modelo: ${modelConfig.id}`);
        console.log(`├─ Backend: ${backend.toUpperCase()}`);
        console.log(`├─ Dtype: ${dtype}`);
        console.log(`└─ Ruta: ${modelConfig.model}`);

        const pipeline = await transformers.pipeline(
          modelConfig.type,
          modelConfig.model,
          {
            device: backend,
            dtype: dtype,
            progress_callback: (data) => {
              if (data.progress !== undefined) {
                setLoadProgress(prev => ({
                  ...prev,
                  [modelConfig.id]: data.progress || 0,
                }));
              }
            },
          }
        );

        const loadedPipeline: LoadedPipeline = {
          pipeline,
          modelId: modelConfig.id,
          backend,
          type: modelConfig.type,
        };

        setLoadedModels(prev => new Map(prev).set(modelConfig.id, loadedPipeline));

        console.log(`✓ Modelo ${modelConfig.id} cargado exitosamente con ${backend}`);

        return loadedPipeline;
      } catch (err) {
        console.error(`✗ Error cargando modelo ${modelConfig.id}:`, err);
        throw err;
      } finally {
        setLoadingModel(null);
        setLoadProgress(prev => {
          const next = { ...prev };
          delete next[modelConfig.id];
          return next;
        });
      }
    },
    [transformers, webgpuState, loadedModels]
  );

  const unloadModel = useCallback(async (modelId: string) => {
    const loaded = loadedModels.get(modelId);
    if (loaded?.pipeline.dispose) {
      await loaded.pipeline.dispose();
    }

    setLoadedModels(prev => {
      const next = new Map(prev);
      next.delete(modelId);
      return next;
    });

    console.log(`🗑️ Modelo ${modelId} descargado`);
  }, [loadedModels]);

  const getLoadedModel = useCallback(
    (modelId: string) => {
      return loadedModels.get(modelId);
    },
    [loadedModels]
  );

  return {
    loadedModels,
    loadingModel,
    loadProgress,
    loadModel,
    unloadModel,
    getLoadedModel,
  };
}
