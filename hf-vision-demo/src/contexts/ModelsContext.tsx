/**
 * Context for model loading and management
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useModels } from '@hooks/useModels';
import { useTransformersContext } from './TransformersContext';
import { useWebGPUContext } from './WebGPUContext';
import type { LoadedPipeline } from '@/types/inference';
import type { ModelConfig } from '@/types/models';

interface ModelsContextValue {
  loadedModels: Map<string, LoadedPipeline>;
  loadingModel: string | null;
  loadProgress: { [key: string]: number };
  loadModel: (modelConfig: ModelConfig) => Promise<LoadedPipeline>;
  unloadModel: (modelId: string) => Promise<void>;
  getLoadedModel: (modelId: string) => LoadedPipeline | undefined;
}

const ModelsContext = createContext<ModelsContextValue | undefined>(undefined);

export function ModelsProvider({ children }: { children: ReactNode }) {
  const { transformers } = useTransformersContext();
  const { webgpuState } = useWebGPUContext();

  const {
    loadedModels,
    loadingModel,
    loadProgress,
    loadModel,
    unloadModel,
    getLoadedModel,
  } = useModels(transformers, webgpuState);

  return (
    <ModelsContext.Provider
      value={{
        loadedModels,
        loadingModel,
        loadProgress,
        loadModel,
        unloadModel,
        getLoadedModel,
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
}

export function useModelsContext() {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error('useModelsContext must be used within ModelsProvider');
  }
  return context;
}
