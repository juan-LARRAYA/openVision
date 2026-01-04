/**
 * Video preview component with camera feed
 */

import { useEffect, useRef, forwardRef } from 'react';
import { useCameraContext } from '@contexts/CameraContext';
import styles from './VideoPreview.module.css';

interface VideoPreviewProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ onVideoReady }, ref) => {
    const { cameraState, startCamera } = useCameraContext();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (cameraState.stream) {
        videoElement.srcObject = cameraState.stream;
        videoElement.play().then(() => {
          onVideoReady?.(videoElement);
        });
      }
    }, [cameraState.stream, onVideoReady]);

    useEffect(() => {
      startCamera();
    }, [startCamera]);

    return (
      <div className={styles.container}>
        <video
          ref={(node) => {
            videoRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={styles.video}
          autoPlay
          playsInline
          muted
        />

        {cameraState.error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠</span>
            <p className={styles.errorMessage}>{cameraState.error}</p>
          </div>
        )}

        {!cameraState.isActive && !cameraState.error && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Iniciando cámara...</p>
          </div>
        )}
      </div>
    );
  }
);

VideoPreview.displayName = 'VideoPreview';
