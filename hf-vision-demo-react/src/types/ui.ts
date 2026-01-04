/**
 * UI state types
 */

export interface ModalState {
  webgpuModal: {
    isOpen: boolean;
    isSupported: boolean;
    reason: string | null;
  };
  configModal: {
    isOpen: boolean;
  };
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}
