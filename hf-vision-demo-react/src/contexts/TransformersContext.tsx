/**
 * Context for Transformers.js library
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useTransformers } from '@hooks/useTransformers';
import type { TransformersModule } from '@/types/transformers';

interface TransformersContextValue {
  transformers: TransformersModule | null;
  loading: boolean;
  error: string | null;
}

const TransformersContext = createContext<TransformersContextValue | undefined>(undefined);

export function TransformersProvider({ children }: { children: ReactNode }) {
  const { transformers, loading, error } = useTransformers();

  return (
    <TransformersContext.Provider value={{ transformers, loading, error }}>
      {children}
    </TransformersContext.Provider>
  );
}

export function useTransformersContext() {
  const context = useContext(TransformersContext);
  if (context === undefined) {
    throw new Error('useTransformersContext must be used within TransformersProvider');
  }
  return context;
}
