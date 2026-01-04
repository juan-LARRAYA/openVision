/**
 * Hook to manage canvas overlay for bounding boxes
 */

import { useCallback } from 'react';
import type { ObjectDetectionResult } from '@/types/transformers';

export function useCanvas() {
  const clearCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawBoundingBoxes = useCallback(
    (
      canvas: HTMLCanvasElement,
      results: ObjectDetectionResult[],
      videoWidth: number,
      videoHeight: number
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear previous drawings
      clearCanvas(canvas);

      // Set canvas size to match video
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Style for bounding boxes
      ctx.strokeStyle = '#0EA5E9'; // Accent color from theme
      ctx.lineWidth = 2;
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#0EA5E9';

      results.forEach((detection) => {
        const { box, label, score } = detection;

        // Draw box
        ctx.strokeRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);

        // Draw label background
        const text = `${label} ${(score * 100).toFixed(0)}%`;
        const textMetrics = ctx.measureText(text);
        const textHeight = 20;

        ctx.fillStyle = '#0EA5E9';
        ctx.fillRect(
          box.xmin,
          box.ymin - textHeight,
          textMetrics.width + 8,
          textHeight
        );

        // Draw label text
        ctx.fillStyle = '#0A0A0A';
        ctx.fillText(text, box.xmin + 4, box.ymin - 6);

        // Reset fill style for next iteration
        ctx.fillStyle = '#0EA5E9';
      });
    },
    [clearCanvas]
  );

  return {
    clearCanvas,
    drawBoundingBoxes,
  };
}
