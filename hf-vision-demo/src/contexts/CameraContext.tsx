/**
 * Context for camera state and controls
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useCamera } from '@hooks/useCamera';
import type { CameraState } from '@/types/camera';

interface CameraContextValue {
  cameraState: CameraState;
  startCamera: (deviceId?: string) => Promise<MediaStream>;
  stopCamera: () => void;
  switchCamera: (deviceId: string) => Promise<void>;
}

const CameraContext = createContext<CameraContextValue | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const { cameraState, startCamera, stopCamera, switchCamera } = useCamera();

  return (
    <CameraContext.Provider value={{ cameraState, startCamera, stopCamera, switchCamera }}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCameraContext() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCameraContext must be used within CameraProvider');
  }
  return context;
}
