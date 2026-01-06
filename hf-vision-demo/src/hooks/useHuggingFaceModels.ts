/**
 * Hook to fetch popular vision models from HuggingFace API
 */

import { useState, useEffect } from 'react';

interface HFModel {
  id: string;
  downloads: number;
  likes: number;
  modelId: string;
  pipeline_tag?: string;
}

interface ModelsByType {
  'object-detection': HFModel[];
  'image-classification': HFModel[];
  'zero-shot-image-classification': HFModel[];
}

export function useHuggingFaceModels() {
  const [models, setModels] = useState<ModelsByType>({
    'object-detection': [],
    'image-classification': [],
    'zero-shot-image-classification': [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch top models for each type
        const [objectDetection, imageClassification, zeroShot] = await Promise.all([
          fetch('https://huggingface.co/api/models?pipeline_tag=object-detection&sort=downloads&direction=-1&limit=5')
            .then(res => res.json()),
          fetch('https://huggingface.co/api/models?pipeline_tag=image-classification&sort=downloads&direction=-1&limit=5')
            .then(res => res.json()),
          fetch('https://huggingface.co/api/models?pipeline_tag=zero-shot-image-classification&sort=downloads&direction=-1&limit=5')
            .then(res => res.json()),
        ]);

        setModels({
          'object-detection': objectDetection || [],
          'image-classification': imageClassification || [],
          'zero-shot-image-classification': zeroShot || [],
        });
      } catch (err) {
        console.error('Error fetching HuggingFace models:', err);
        setError('Error al cargar modelos de HuggingFace');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, loading, error };
}
