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

        // Prepare image input - try multiple methods for compatibility
        let imageInput: any = canvas;

        // Try to use RawImage if available (preferred method)
        if (transformers.RawImage && typeof transformers.RawImage.fromCanvas === 'function') {
          try {
            imageInput = await transformers.RawImage.fromCanvas(canvas);
            console.log('✓ Using RawImage from canvas');
          } catch (e) {
            console.log('⚠ RawImage.fromCanvas failed, using canvas directly:', e);
            imageInput = canvas;
          }
        } else {
          console.log('⚠ RawImage not available, using canvas directly');
          imageInput = canvas;
        }

        // Run inference - try with options first, fallback to simple call
        let results;
        try {
          if (loadedPipeline.type === 'zero-shot-image-classification' && options?.labels) {
            results = await loadedPipeline.pipeline(imageInput, options.labels);
          } else if (loadedPipeline.type === 'object-detection') {
            results = await loadedPipeline.pipeline(imageInput, {
              threshold: options?.threshold || 0.5
            });
          } else {
            // Generic inference - works for most models
            results = await loadedPipeline.pipeline(imageInput);
          }
        } catch (err) {
          // Fallback: try simple inference without options
          console.warn('Inference with options failed, trying simple call...', err);
          try {
            results = await loadedPipeline.pipeline(imageInput);
          } catch (err2) {
            // Last resort: try with image URL
            console.warn('Inference with canvas failed, trying with data URL...', err2);
            const imageUrl = canvas.toDataURL('image/jpeg');
            results = await loadedPipeline.pipeline(imageUrl);
          }
        }

        const endTime = performance.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`✓ ${loadedPipeline.modelId} completado en ${processingTime}s`);
        console.log('📊 Raw results structure:', {
          type: typeof results,
          isArray: Array.isArray(results),
          keys: results ? Object.keys(results) : [],
          sample: results
        });

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
