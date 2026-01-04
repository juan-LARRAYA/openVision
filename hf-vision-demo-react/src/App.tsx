/**
 * Main App component
 * Orchestrates the HuggingFace Vision Demo application
 */

import { useState, useRef } from 'react';
import { useModalState } from '@hooks/useModalState';
import { useCanvas } from '@hooks/useCanvas';
import { useModelsContext } from '@contexts/ModelsContext';
import { useInferenceContext } from '@contexts/InferenceContext';
import { MODEL_REGISTRY } from '@config/models';
import { usePersistedModels } from '@hooks/usePersistedModels';
import type { PipelineResult } from '@/types/transformers';
import type { ModelType } from '@/types/models';

import {
  Header,
  ModelSelector,
  VideoPreview,
  CanvasOverlay,
  ResultsDisplay,
  WebGPUModal,
  ConfigModal,
} from '@components/ui';

import styles from './App.module.css';

function App() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [results, setResults] = useState<PipelineResult | null>(null);
  const [backend, setBackend] = useState<'webgpu' | 'wasm'>('wasm');
  const [processingTime, setProcessingTime] = useState<string>('0.00');
  const [modelType, setModelType] = useState<ModelType | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { modalState, showConfigModal, hideConfigModal } = useModalState();
  const { clearCanvas, drawBoundingBoxes } = useCanvas();
  const { getLoadedModel } = useModelsContext();
  const { runInference, isRunning } = useInferenceContext();
  const { getAllModels } = usePersistedModels();

  const allModels = getAllModels(MODEL_REGISTRY);

  const handleRunInference = async () => {
    if (!selectedModelId || !videoRef.current) {
      return;
    }

    const loadedPipeline = getLoadedModel(selectedModelId);
    if (!loadedPipeline) {
      console.error('Model not loaded');
      return;
    }

    try {
      const modelConfig = allModels[selectedModelId];

      const options = modelConfig.type === 'zero-shot-image-classification'
        ? { labels: modelConfig.default_labels }
        : modelConfig.type === 'object-detection'
        ? { threshold: 0.5 }
        : undefined;

      const result = await runInference(loadedPipeline, videoRef.current, options);

      setResults(result.results);
      setBackend(result.backend);
      setProcessingTime(result.processingTime);
      setModelType(loadedPipeline.type);

      // Handle bounding boxes for object detection
      if (loadedPipeline.type === 'object-detection' && canvasRef.current && videoRef.current) {
        drawBoundingBoxes(
          canvasRef.current,
          result.results as any,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
      } else if (canvasRef.current) {
        clearCanvas(canvasRef.current);
      }
    } catch (err) {
      console.error('Error running inference:', err);
    }
  };

  return (
    <div className={styles.app}>
      <Header onConfigClick={() => showConfigModal()} />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.controls}>
            <ModelSelector
              selectedModelId={selectedModelId}
              onModelSelect={setSelectedModelId}
              disabled={isRunning}
            />

            <button
              className={styles.runBtn}
              onClick={handleRunInference}
              disabled={!selectedModelId || isRunning}
            >
              {isRunning ? 'Procesando...' : 'Ejecutar Inferencia'}
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.videoContainer}>
              <VideoPreview ref={videoRef} />
              <CanvasOverlay ref={canvasRef} />
            </div>

            <ResultsDisplay
              results={results}
              modelType={modelType}
              backend={backend}
              processingTime={processingTime}
            />
          </div>
        </div>
      </main>

      <WebGPUModal />
      <ConfigModal
        isOpen={modalState.configModal.isOpen}
        onClose={hideConfigModal}
      />
    </div>
  );
}

export default App;
