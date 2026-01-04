/**
 * Hook to manage camera stream and device selection
 */

import { useState, useEffect, useCallback } from 'react';
import type { CameraState } from '@/types/camera';

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    stream: null,
    error: null,
    availableDevices: [],
    selectedDeviceId: null,
  });

  // Get available camera devices
  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        setCameraState(prev => ({
          ...prev,
          availableDevices: videoDevices,
          selectedDeviceId: videoDevices[0]?.deviceId || null,
        }));
      } catch (err) {
        console.error('Error enumerando dispositivos:', err);
      }
    }

    getDevices();
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      console.log('▶ Iniciando cámara...');

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'environment' },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('✓ Cámara iniciada exitosamente');

      setCameraState(prev => ({
        ...prev,
        isActive: true,
        stream,
        error: null,
        selectedDeviceId: deviceId || prev.selectedDeviceId,
      }));

      return stream;
    } catch (err) {
      console.error('✗ Error iniciando cámara:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

      setCameraState(prev => ({
        ...prev,
        isActive: false,
        stream: null,
        error: errorMessage,
      }));

      throw err;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      console.log('⏹ Deteniendo cámara...');
      cameraState.stream.getTracks().forEach(track => track.stop());

      setCameraState(prev => ({
        ...prev,
        isActive: false,
        stream: null,
      }));
    }
  }, [cameraState.stream]);

  const switchCamera = useCallback(async (deviceId: string) => {
    stopCamera();
    await startCamera(deviceId);
  }, [startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraState.stream]);

  return {
    cameraState,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
