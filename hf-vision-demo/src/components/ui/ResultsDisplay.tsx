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

function ClassificationResults({ results }: { results: any }) {
  // Handle different result formats
  console.log('🔍 Classification results received:', results);

  // If results is null/undefined or not an array
  if (!results) {
    return (
      <div className={styles.list}>
        <p className={styles.noResults}>No se recibieron resultados</p>
      </div>
    );
  }

  // Convert to array if needed (some models return objects)
  let resultsArray: Array<{ label: string; score: number }>;

  if (Array.isArray(results)) {
    resultsArray = results;
  } else if (typeof results === 'object') {
    // Check if it's wrapped (e.g., results.data or results[0])
    if ('data' in results && Array.isArray(results.data)) {
      resultsArray = results.data;
    } else if (results[0] && Array.isArray(results[0])) {
      resultsArray = results[0];
    } else {
      // Convert object to array
      resultsArray = Object.entries(results as Record<string, any>).map(([label, score]) => ({
        label,
        score: typeof score === 'number' ? score : 0
      }));
    }
  } else {
    console.error('❌ Unexpected results format:', results);
    return (
      <div className={styles.list}>
        <p className={styles.noResults}>Formato de resultados inesperado</p>
      </div>
    );
  }

  // Ensure we have valid results
  if (resultsArray.length === 0) {
    return (
      <div className={styles.list}>
        <p className={styles.noResults}>No se encontraron clasificaciones</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {resultsArray.slice(0, 5).map((result, index) => (
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
  results: any;
}) {
  console.log('🔍 Object detection results received:', results);

  // Handle null/undefined results
  if (!results) {
    return (
      <div className={styles.list}>
        <p className={styles.noResults}>No se recibieron resultados</p>
      </div>
    );
  }

  // Convert to array if needed
  let resultsArray: Array<{ label: string; score: number; box?: any }> = Array.isArray(results) ? results : [results];

  return (
    <div className={styles.list}>
      {resultsArray.map((result, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.label}>{result.label}</span>
            <span className={styles.score}>{(result.score * 100).toFixed(1)}%</span>
          </div>
        </div>
      ))}
      {resultsArray.length === 0 && (
        <p className={styles.noResults}>No se detectaron objetos</p>
      )}
    </div>
  );
}
