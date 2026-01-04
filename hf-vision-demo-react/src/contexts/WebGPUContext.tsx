/**
 * Context for WebGPU state and detection
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useWebGPU } from '@hooks/useWebGPU';
import type { WebGPUState } from '@/types/webgpu';

interface WebGPUContextValue {
  webgpuState: WebGPUState;
  checking: boolean;
  recheckWebGPU: () => Promise<void>;
}

const WebGPUContext = createContext<WebGPUContextValue | undefined>(undefined);

export function WebGPUProvider({ children }: { children: ReactNode }) {
  const { webgpuState, checking, recheckWebGPU } = useWebGPU();

  return (
    <WebGPUContext.Provider value={{ webgpuState, checking, recheckWebGPU }}>
      {children}
    </WebGPUContext.Provider>
  );
}

export function useWebGPUContext() {
  const context = useContext(WebGPUContext);
  if (context === undefined) {
    throw new Error('useWebGPUContext must be used within WebGPUProvider');
  }
  return context;
}
