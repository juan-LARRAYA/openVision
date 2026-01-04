/**
 * Camera types
 */

export interface CameraState {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
  availableDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
}

export interface CameraConstraints {
  video: {
    deviceId?: { exact: string };
    width?: { ideal: number };
    height?: { ideal: number };
    facingMode?: string;
  };
}
