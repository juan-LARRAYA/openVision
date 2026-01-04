/**
 * WebGPU status modal component
 */

import { useState, useEffect } from 'react';
import { useWebGPUContext } from '@contexts/WebGPUContext';
import styles from './WebGPUModal.module.css';

export function WebGPUModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { webgpuState, checking } = useWebGPUContext();

  useEffect(() => {
    if (!checking) {
      setIsOpen(true);
    }
  }, [checking]);

  if (!isOpen) {
    return null;
  }

  const isSupported = webgpuState.supported;
  const reason = webgpuState.reason;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close">
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
                La inferencia será más rápida con aceleración GPU.
              </p>
              {webgpuState.hasFp16 && (
                <p className={styles.feature}>✓ Soporte FP16 detectado</p>
              )}
            </>
          ) : (
            <>
              <p className={styles.message}>
                WebGPU no disponible. Se usará WASM (más lento).
              </p>
              {reason && <p className={styles.reason}>{reason}</p>}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={() => setIsOpen(false)}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
