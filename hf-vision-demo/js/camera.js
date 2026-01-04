/**
 * HF Vision Demo - Camera Management
 * Maneja la cámara, video stream y captura de imágenes
 */

import { APP_CONFIG } from './config.js';

let videoElement = null;
let canvasElement = null;
let ctx = null;
let stream = null;

/**
 * Inicializa la cámara y conecta con el elemento de video
 * @param {HTMLVideoElement} video - Elemento de video para mostrar el stream
 * @param {HTMLCanvasElement} canvas - Elemento canvas para captura
 * @returns {Promise<boolean>} true si se inicializó correctamente
 */
export async function initCamera(video, canvas) {
  videoElement = video;
  canvasElement = canvas;
  ctx = canvas.getContext('2d');

  try {
    console.log('📷 Solicitando acceso a cámara...');

    // Request user media con configuración
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: APP_CONFIG.camera.width },
        height: { ideal: APP_CONFIG.camera.height },
        facingMode: APP_CONFIG.camera.facingMode
      },
      audio: false
    });

    // Conectar stream al video element
    videoElement.srcObject = stream;

    // Esperar a que el video esté listo
    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        resolve();
      };
    });

    console.log('✅ Cámara inicializada correctamente');
    return true;

  } catch (error) {
    console.error('❌ Error accediendo a la cámara:', error);

    // Mensajes de error más específicos
    let errorMessage = 'No se pudo acceder a la cámara';

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = 'Permiso de cámara denegado. Por favor permite el acceso a la cámara.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = 'No se encontró ninguna cámara conectada.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = 'La cámara está siendo usada por otra aplicación.';
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'La configuración de cámara solicitada no es compatible.';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Acceso a cámara bloqueado por razones de seguridad (¿HTTPS requerido?).';
    }

    throw new Error(errorMessage);
  }
}

/**
 * Captura una imagen del video stream actual
 * @returns {string} Data URL de la imagen capturada (JPEG)
 */
export function captureImage() {
  if (!videoElement || !canvasElement || !ctx) {
    throw new Error('Cámara no inicializada');
  }

  // Asegurar que el canvas tenga el mismo tamaño que el video
  canvasElement.width = videoElement.videoWidth || APP_CONFIG.camera.width;
  canvasElement.height = videoElement.videoHeight || APP_CONFIG.camera.height;

  // Dibujar frame actual del video en el canvas
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // Convertir a Data URL (JPEG con calidad configurada)
  const dataUrl = canvasElement.toDataURL('image/jpeg', APP_CONFIG.imageQuality);

  console.log('📸 Imagen capturada');
  return dataUrl;
}

/**
 * Captura una imagen como Blob (útil para enviar a modelos)
 * @returns {Promise<Blob>} Blob de la imagen capturada
 */
export function captureImageBlob() {
  return new Promise((resolve, reject) => {
    if (!videoElement || !canvasElement || !ctx) {
      reject(new Error('Cámara no inicializada'));
      return;
    }

    // Asegurar que el canvas tenga el mismo tamaño que el video
    canvasElement.width = videoElement.videoWidth || APP_CONFIG.camera.width;
    canvasElement.height = videoElement.videoHeight || APP_CONFIG.camera.height;

    // Dibujar frame actual
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convertir a Blob
    canvasElement.toBlob(
      (blob) => {
        if (blob) {
          console.log('📸 Imagen capturada como Blob');
          resolve(blob);
        } else {
          reject(new Error('No se pudo crear Blob de la imagen'));
        }
      },
      'image/jpeg',
      APP_CONFIG.imageQuality
    );
  });
}

/**
 * Obtiene el contexto del canvas para dibujar
 * @returns {CanvasRenderingContext2D|null} Contexto del canvas
 */
export function getCanvasContext() {
  return ctx;
}

/**
 * Obtiene el elemento de video
 * @returns {HTMLVideoElement|null} Elemento de video
 */
export function getVideoElement() {
  return videoElement;
}

/**
 * Obtiene el elemento de canvas
 * @returns {HTMLCanvasElement|null} Elemento de canvas
 */
export function getCanvasElement() {
  return canvasElement;
}

/**
 * Limpia el canvas
 */
export function clearCanvas() {
  if (ctx && canvasElement) {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
}

/**
 * Detiene el stream de la cámara
 */
export function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    console.log('🛑 Cámara detenida');
  }

  if (videoElement) {
    videoElement.srcObject = null;
  }
}

/**
 * Verifica si la cámara está activa
 * @returns {boolean} true si la cámara está activa
 */
export function isCameraActive() {
  return stream !== null && stream.active;
}

/**
 * Obtiene información sobre las cámaras disponibles
 * @returns {Promise<Array>} Lista de dispositivos de video disponibles
 */
export async function getAvailableCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('📷 Cámaras disponibles:', videoDevices.length);
    return videoDevices;
  } catch (error) {
    console.error('Error obteniendo cámaras:', error);
    return [];
  }
}

/**
 * Cambia a una cámara específica
 * @param {string} deviceId - ID del dispositivo de video
 * @returns {Promise<boolean>} true si se cambió correctamente
 */
export async function switchCamera(deviceId) {
  // Detener stream actual
  stopCamera();

  try {
    // Request nuevo stream con el dispositivo específico
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: APP_CONFIG.camera.width },
        height: { ideal: APP_CONFIG.camera.height }
      },
      audio: false
    });

    videoElement.srcObject = stream;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        resolve();
      };
    });

    console.log('✅ Cámara cambiada correctamente');
    return true;

  } catch (error) {
    console.error('❌ Error cambiando cámara:', error);
    throw error;
  }
}
