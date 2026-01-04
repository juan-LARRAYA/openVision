/**
 * Context for inference execution
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useInference } from '@hooks/useInference';
import { useTransformersContext } from './TransformersContext';
import type { LoadedPipeline, InferenceResult, InferenceOptions } from '@/types/inference';

interface InferenceContextValue {
  isRunning: boolean;
  currentModel: string | null;
  runInference: (
    loadedPipeline: LoadedPipeline,
    videoElement: HTMLVideoElement,
    options?: InferenceOptions
  ) => Promise<InferenceResult>;
}

const InferenceContext = createContext<InferenceContextValue | undefined>(undefined);

export function InferenceProvider({ children }: { children: ReactNode }) {
  const { transformers } = useTransformersContext();
  const { isRunning, currentModel, runInference } = useInference(transformers);

  return (
    <InferenceContext.Provider value={{ isRunning, currentModel, runInference }}>
      {children}
    </InferenceContext.Provider>
  );
}

export function useInferenceContext() {
  const context = useContext(InferenceContext);
  if (context === undefined) {
    throw new Error('useInferenceContext must be used within InferenceProvider');
  }
  return context;
}
