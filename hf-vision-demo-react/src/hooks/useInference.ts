/**
 * Hook to run inference with loaded models
 */

import { useState, useCallback } from 'react';
import type { TransformersModule } from '@/types/transformers';
import type { LoadedPipeline, InferenceResult, InferenceOptions } from '@/types/inference';

export function useInference(transformers: TransformersModule | null) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);

  const runInference = useCallback(
    async (
      loadedPipeline: LoadedPipeline,
      videoElement: HTMLVideoElement,
      options?: InferenceOptions
    ): Promise<InferenceResult> => {
      if (!transformers) {
        throw new Error('Transformers.js no está cargado');
      }

      setIsRunning(true);
      setCurrentModel(loadedPipeline.modelId);

      try {
        console.log(`▶ Ejecutando ${loadedPipeline.modelId} con ${loadedPipeline.backend}...`);

        const startTime = performance.now();

        // Create canvas from video
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoElement, 0, 0);

        // Convert to RawImage
        const image = transformers.RawImage.fromCanvas(canvas);

        // Run inference based on model type
        let results;
        if (loadedPipeline.type === 'zero-shot-image-classification') {
          const labels = options?.labels || ['object', 'person', 'animal'];
          results = await loadedPipeline.pipeline(image, labels);
        } else if (loadedPipeline.type === 'object-detection') {
          const threshold = options?.threshold || 0.5;
          results = await loadedPipeline.pipeline(image, { threshold });
        } else {
          results = await loadedPipeline.pipeline(image);
        }

        const endTime = performance.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`✓ ${loadedPipeline.modelId} completado en ${processingTime}s`);

        return {
          modelId: loadedPipeline.modelId,
          results,
          backend: loadedPipeline.backend,
          processingTime,
        };
      } catch (err) {
        console.error(`✗ Error ejecutando ${loadedPipeline.modelId}:`, err);
        throw err;
      } finally {
        setIsRunning(false);
        setCurrentModel(null);
      }
    },
    [transformers]
  );

  return {
    isRunning,
    currentModel,
    runInference,
  };
}
