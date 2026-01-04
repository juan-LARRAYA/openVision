/**
 * Canvas overlay for bounding boxes (object detection)
 */

import { forwardRef } from 'react';
import styles from './CanvasOverlay.module.css';

export const CanvasOverlay = forwardRef<HTMLCanvasElement>((props, ref) => {
  return (
    <canvas
      ref={ref}
      className={styles.canvas}
      {...props}
    />
  );
});

CanvasOverlay.displayName = 'CanvasOverlay';
