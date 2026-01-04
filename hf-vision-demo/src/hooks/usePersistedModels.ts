/**
 * Hook to manage custom models in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import type { CustomModel, ModelRegistry } from '@/types/models';
import { STORAGE_KEY } from '@config/models';

export function usePersistedModels() {
  const [customModels, setCustomModels] = useState<CustomModel[]>([]);

  // Load custom models from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomModels(parsed);
        console.log(`✓ Cargados ${parsed.length} modelos custom desde localStorage`);
      }
    } catch (err) {
      console.error('Error cargando modelos custom:', err);
    }
  }, []);

  const addCustomModel = useCallback((model: CustomModel) => {
    setCustomModels(prev => {
      const next = [...prev, model];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      console.log(`✓ Modelo custom agregado: ${model.id}`);
      return next;
    });
  }, []);

  const removeCustomModel = useCallback((modelId: string) => {
    setCustomModels(prev => {
      const next = prev.filter(m => m.id !== modelId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      console.log(`✓ Modelo custom eliminado: ${modelId}`);
      return next;
    });
  }, []);

  const clearCustomModels = useCallback(() => {
    setCustomModels([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('✓ Todos los modelos custom eliminados');
  }, []);

  const getAllModels = useCallback(
    (baseRegistry: ModelRegistry): ModelRegistry => {
      const combined = { ...baseRegistry };

      customModels.forEach(model => {
        combined[model.id] = {
          ...model,
          icon: '',
          custom: true,
        };
      });

      return combined;
    },
    [customModels]
  );

  return {
    customModels,
    addCustomModel,
    removeCustomModel,
    clearCustomModels,
    getAllModels,
  };
}
