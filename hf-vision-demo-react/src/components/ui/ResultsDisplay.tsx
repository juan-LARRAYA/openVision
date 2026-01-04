/**
 * Results display component
 */

import type { PipelineResult } from '@/types/transformers';
import type { ModelType } from '@/types/models';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  results: PipelineResult | null;
  modelType: ModelType | null;
  backend: 'webgpu' | 'wasm';
  processingTime: string;
}

export function ResultsDisplay({
  results,
  modelType,
  backend,
  processingTime,
}: ResultsDisplayProps) {
  const backendClass = backend === 'webgpu' ? styles.webgpu : styles.wasm;
  const backendLabel = backend === 'webgpu' ? 'WebGPU' : 'WASM';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Resultados</h3>
        <span className={`${styles.badge} ${backendClass}`}>
          {backendLabel} · {processingTime}s
        </span>
      </div>

      <div className={styles.results}>
        {modelType === 'object-detection' ? (
          <ObjectDetectionResults results={results as any} />
        ) : (
          <ClassificationResults results={results as any} />
        )}
      </div>
    </div>
  );
}

function ClassificationResults({ results }: { results: Array<{ label: string; score: number }> }) {
  return (
    <div className={styles.list}>
      {results.slice(0, 5).map((result, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.label}>{result.label}</span>
            <span className={styles.score}>{(result.score * 100).toFixed(1)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${result.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ObjectDetectionResults({
  results,
}: {
  results: Array<{ label: string; score: number; box: any }>;
}) {
  return (
    <div className={styles.list}>
      {results.map((result, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.label}>{result.label}</span>
            <span className={styles.score}>{(result.score * 100).toFixed(1)}%</span>
          </div>
        </div>
      ))}
      {results.length === 0 && (
        <p className={styles.noResults}>No se detectaron objetos</p>
      )}
    </div>
  );
}
