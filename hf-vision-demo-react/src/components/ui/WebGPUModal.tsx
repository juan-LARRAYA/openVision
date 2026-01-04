/**
 * WebGPU status modal component
 */

import { useEffect } from 'react';
import { useModalState } from '@hooks/useModalState';
import { useWebGPUContext } from '@contexts/WebGPUContext';
import styles from './WebGPUModal.module.css';

export function WebGPUModal() {
  const { modalState, showWebGPUModal, hideWebGPUModal } = useModalState();
  const { webgpuState, checking } = useWebGPUContext();

  useEffect(() => {
    if (!checking) {
      showWebGPUModal(webgpuState.supported, webgpuState.reason);
    }
  }, [checking, webgpuState.supported, webgpuState.reason, showWebGPUModal]);

  if (!modalState.webgpuModal.isOpen) {
    return null;
  }

  const { isSupported, reason } = modalState.webgpuModal;

  return (
    <div className={styles.overlay} onClick={hideWebGPUModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={hideWebGPUModal} aria-label="Close">
          ✕
        </button>

        <div className={`${styles.status} ${isSupported ? styles.success : styles.warning}`}>
          <div className={styles.icon}>{isSupported ? '✓' : '⚠'}</div>
          <h2 className={styles.title}>
            {isSupported ? 'WebGPU Activo' : 'WebGPU No Disponible'}
          </h2>
        </div>

        <div className={styles.content}>
          {isSupported ? (
            <>
              <p className={styles.message}>
                Tu navegador soporta WebGPU. La inferencia será más rápida utilizando
                aceleración por GPU.
              </p>
              {webgpuState.hasFp16 && (
                <p className={styles.feature}>✓ Soporte FP16 detectado</p>
              )}
            </>
          ) : (
            <>
              <p className={styles.message}>
                WebGPU no está disponible en tu navegador. La aplicación utilizará WASM
                como fallback (más lento).
              </p>
              {reason && <p className={styles.reason}>Razón: {reason}</p>}
              <p className={styles.hint}>
                Para usar WebGPU, actualiza a Chrome/Edge 113+ o usa un navegador compatible.
              </p>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={hideWebGPUModal}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
