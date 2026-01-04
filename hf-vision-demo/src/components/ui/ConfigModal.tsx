/**
 * Configuration modal for adding custom models
 */

import { useState } from 'react';
import { usePersistedModels } from '@hooks/usePersistedModels';
import type { CustomModel, ModelType } from '@/types/models';
import styles from './ConfigModal.module.css';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const { customModels, addCustomModel, removeCustomModel } = usePersistedModels();

  const [formData, setFormData] = useState({
    id: '',
    label: '',
    description: '',
    model: '',
    type: 'image-classification' as ModelType,
    default_labels: '',
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newModel: CustomModel = {
      id: formData.id || `custom_${Date.now()}`,
      label: formData.label,
      description: formData.description,
      model: formData.model,
      type: formData.type,
      default_labels: formData.default_labels
        ? formData.default_labels.split(',').map((s) => s.trim())
        : undefined,
    };

    addCustomModel(newModel);

    // Reset form
    setFormData({
      id: '',
      label: '',
      description: '',
      model: '',
      type: 'image-classification',
      default_labels: '',
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Configuración de Modelos</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>ID (opcional):</label>
              <input
                type="text"
                className={styles.input}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Ej: my_custom_model"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre *:</label>
              <input
                type="text"
                className={styles.input}
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ej: My Custom Model"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción *:</label>
              <input
                type="text"
                className={styles.input}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Custom trained model for..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Ruta del modelo *:</label>
              <input
                type="text"
                className={styles.input}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ej: username/model-name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo *:</label>
              <select
                className={styles.select}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as ModelType })
                }
              >
                <option value="image-classification">Image Classification</option>
                <option value="zero-shot-image-classification">
                  Zero-shot Classification
                </option>
                <option value="object-detection">Object Detection</option>
              </select>
            </div>

            {formData.type === 'zero-shot-image-classification' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Etiquetas por defecto:</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.default_labels}
                  onChange={(e) =>
                    setFormData({ ...formData, default_labels: e.target.value })
                  }
                  placeholder="Ej: person, car, dog (separadas por comas)"
                />
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              Agregar Modelo
            </button>
          </form>

          {customModels.length > 0 && (
            <div className={styles.modelList}>
              <h3 className={styles.listTitle}>Modelos Personalizados</h3>
              {customModels.map((model) => (
                <div key={model.id} className={styles.modelItem}>
                  <div className={styles.modelInfo}>
                    <p className={styles.modelName}>{model.label}</p>
                    <p className={styles.modelPath}>{model.model}</p>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeCustomModel(model.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
