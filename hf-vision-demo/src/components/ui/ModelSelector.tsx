/**
 * Model selector dropdown component
 */

import { useModelsContext } from '@contexts/ModelsContext';
import { usePersistedModels } from '@hooks/usePersistedModels';
import { MODEL_REGISTRY } from '@config/models';
import type { ModelConfig } from '@/types/models';
import styles from './ModelSelector.module.css';

interface ModelSelectorProps {
  selectedModelId: string | null;
  onModelSelect: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModelId, onModelSelect, disabled }: ModelSelectorProps) {
  const { loadModel, loadingModel, loadProgress } = useModelsContext();
  const { customModels, getAllModels } = usePersistedModels();

  const allModels = getAllModels(MODEL_REGISTRY);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    if (!modelId) return;

    const modelConfig = allModels[modelId];
    if (!modelConfig) return;

    try {
      await loadModel(modelConfig);
      onModelSelect(modelId);
    } catch (err) {
      console.error('Error cargando modelo:', err);
    }
  };

  return (
    <div className={styles.container}>
      <option value="" disabled>
        Seleccionar modelo a utilizar...
      </option>
      <select
        id="model-select"
        className={styles.select}
        value={selectedModelId || ''}
        onChange={handleChange}
        disabled={disabled || !!loadingModel}
      >

        {Object.values(MODEL_REGISTRY).map((model: ModelConfig) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}

        {customModels.length > 0 && (
          <>
            <option disabled className={styles.separator}>
              ──────────────
            </option>
            {customModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </>
        )}
      </select>

      {loadingModel && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>
            Cargando {loadProgress[loadingModel]?.toFixed(0) || 0}%
          </span>
        </div>
      )}
    </div>
  );
}
