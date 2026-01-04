/**
 * Hook to manage modal state
 */

import { useState, useCallback } from 'react';
import type { ModalState } from '@/types/ui';

export function useModalState() {
  const [modalState, setModalState] = useState<ModalState>({
    webgpuModal: {
      isOpen: false,
      isSupported: false,
      reason: null,
    },
    configModal: {
      isOpen: false,
    },
  });

  const showWebGPUModal = useCallback((isSupported: boolean, reason: string | null = null) => {
    setModalState(prev => ({
      ...prev,
      webgpuModal: {
        isOpen: true,
        isSupported,
        reason,
      },
    }));
  }, []);

  const hideWebGPUModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      webgpuModal: {
        ...prev.webgpuModal,
        isOpen: false,
      },
    }));
  }, []);

  const showConfigModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      configModal: {
        isOpen: true,
      },
    }));
  }, []);

  const hideConfigModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      configModal: {
        isOpen: false,
      },
    }));
  }, []);

  return {
    modalState,
    showWebGPUModal,
    hideWebGPUModal,
    showConfigModal,
    hideConfigModal,
  };
}
