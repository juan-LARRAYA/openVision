/**
 * Application entry point
 * Sets up React root and Context providers
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  TransformersProvider,
  WebGPUProvider,
  CameraProvider,
  ModelsProvider,
  InferenceProvider,
} from '@/contexts';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TransformersProvider>
      <WebGPUProvider>
        <CameraProvider>
          <ModelsProvider>
            <InferenceProvider>
              <App />
            </InferenceProvider>
          </ModelsProvider>
        </CameraProvider>
      </WebGPUProvider>
    </TransformersProvider>
  </StrictMode>
);
