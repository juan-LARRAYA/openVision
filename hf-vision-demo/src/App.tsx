/**
 * Main App component
 * Orchestrates the HuggingFace Vision Demo application
 */

import { useState, useRef, useEffect } from 'react';
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

// Default model ID to preload
const DEFAULT_MODEL_ID = 'yolov9t';

function App() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [results, setResults] = useState<PipelineResult | null>(null);
  const [backend, setBackend] = useState<'webgpu' | 'wasm'>('wasm');
  const [processingTime, setProcessingTime] = useState<string>('0.00');
  const [modelType, setModelType] = useState<ModelType | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { clearCanvas, drawBoundingBoxes } = useCanvas();
  const { getLoadedModel, loadModel } = useModelsContext();
  const { runInference, isRunning } = useInferenceContext();
  const { getAllModels } = usePersistedModels();

  const allModels = getAllModels(MODEL_REGISTRY);

  // Preload default model on mount
  useEffect(() => {
    const preloadDefaultModel = async () => {
      const defaultModel = allModels[DEFAULT_MODEL_ID];
      if (defaultModel) {
        console.log(`🚀 Precargando modelo por defecto: ${DEFAULT_MODEL_ID}`);
        try {
          await loadModel(defaultModel);
          setSelectedModelId(DEFAULT_MODEL_ID);
          console.log(`✓ Modelo ${DEFAULT_MODEL_ID} precargado exitosamente`);
        } catch (err) {
          console.error(`✗ Error precargando modelo ${DEFAULT_MODEL_ID}:`, err);
        }
      }
    };

    preloadDefaultModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleRunInference = async () => {
    console.log('🔍 handleRunInference called', {
      selectedModelId,
      hasVideo: !!videoRef.current,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
    });

    if (!selectedModelId || !videoRef.current) {
      console.warn('⚠️ Missing requirements:', {
        selectedModelId,
        hasVideo: !!videoRef.current,
      });
      return;
    }

    const loadedPipeline = getLoadedModel(selectedModelId);
    console.log('🔍 Loaded pipeline:', loadedPipeline);

    if (!loadedPipeline) {
      console.error('❌ Model not loaded:', selectedModelId);
      alert(`Modelo ${selectedModelId} no está cargado. Por favor, selecciona un modelo primero.`);
      return;
    }

    try {
      const modelConfig = allModels[selectedModelId];

      const options = modelConfig.type === 'zero-shot-image-classification'
        ? { labels: modelConfig.default_labels }
        : modelConfig.type === 'object-detection'
        ? { threshold: 0.5 }
        : undefined;

      console.log('▶️ Ejecutando inferencia...', { modelConfig, options });

      const result = await runInference(loadedPipeline, videoRef.current, options);

      console.log('✅ Inferencia completada:', result);

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
      console.error('❌ Error running inference:', err);
      alert(`Error ejecutando inferencia: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className={styles.app}>
      <Header onConfigClick={() => setShowConfig(true)} />

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

          <div className={`${styles.content} ${results ? styles.hasResults : ''}`}>
            <div className={styles.videoContainer}>
              <VideoPreview ref={videoRef} />
              <CanvasOverlay ref={canvasRef} />
            </div>

            {results && (
              <div className={styles.resultsContainer}>
                <ResultsDisplay
                  results={results}
                  modelType={modelType}
                  backend={backend}
                  processingTime={processingTime}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <WebGPUModal />
      <ConfigModal
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />

      <footer className={styles.footer}>
        <p>
          Desarrollado con ♥️ desde Argentina por Juan Cruz Larraya
        </p>
        <div className={styles.footerLinks}>
          <a
            href="https://www.linkedin.com/in/juan-cruz-larraya/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/juan-LARRAYA"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
