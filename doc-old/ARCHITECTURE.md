# 🏗️ Architecture Documentation

This document describes the technical architecture of the HF Vision Demo application.

## System Overview

The HF Vision Demo is a real-time computer vision application that demonstrates three popular AI models from Hugging Face. The system consists of a FastAPI backend serving AI models and a vanilla JavaScript frontend for user interaction.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (HTML/CSS/JavaScript)                                 │
│  ├── Camera capture                                             │
│  ├── Image preprocessing                                        │
│  ├── API communication                                          │
│  └── Results visualization                                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP/WebRTC
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                             │
├─────────────────────────────────────────────────────────────────┤
│  API Layer                                                      │
│  ├── /classify (ViT)                                           │
│  ├── /clip (CLIP zero-shot)                                    │
│  ├── /clip-custom (CLIP custom)                                │
│  └── /detect (DETR)                                            │
├─────────────────────────────────────────────────────────────────┤
│  Model Management Layer                                         │
│  ├── Model loading and caching                                 │
│  ├── Image preprocessing                                        │
│  ├── Inference orchestration                                   │
│  └── Result postprocessing                                     │
├─────────────────────────────────────────────────────────────────┤
│  AI Models (Hugging Face Transformers)                         │
│  ├── CLIP (openai/clip-vit-base-patch32)                      │
│  ├── ViT (google/vit-base-patch16-224)                        │
│  └── DETR (facebook/detr-resnet-50)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **HTML5**: Structure and Canvas API for image manipulation
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No frameworks for simplicity and performance
- **WebRTC**: Camera access via `getUserMedia()`

### Key Components

#### 1. Camera Handler
```javascript
// Handles webcam access and frame capture
async function start() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}
```

#### 2. Image Capture
```javascript
// Captures frames from video stream
function captureBlob() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
}
```

#### 3. API Communication
```javascript
// Sends images to backend for processing
async function runModel(endpoint, resultId, renderFn, extraData = {}) {
  const blob = await captureBlob();
  const form = new FormData();
  form.append('file', blob, 'frame.jpg');
  
  const res = await fetch(`http://localhost:8000/${endpoint}`, {
    method: 'POST',
    body: form
  });
}
```

#### 4. Visualization Engine
- **Results Display**: Dynamic HTML generation for classification results
- **Bounding Boxes**: Canvas-based drawing for object detection
- **Real-time Updates**: Continuous processing and display

## Backend Architecture

### Technology Stack
- **FastAPI**: Modern Python web framework
- **Transformers**: Hugging Face library for AI models
- **PyTorch**: Deep learning framework
- **Pillow**: Image processing
- **Uvicorn**: ASGI server

### Key Components

#### 1. Model Manager
```python
# Global model instances for efficient reuse
clip_model = None
clip_processor = None
vit_classifier = None
detr_detector = None

def load_pipelines():
    # Load all models on startup
    global clip_model, clip_processor, vit_classifier, detr_detector
    # ... model loading logic
```

#### 2. Image Processing Pipeline
```python
def read_imagefile(file) -> Image.Image:
    img = Image.open(BytesIO(file)).convert("RGB")
    return img
```

#### 3. API Endpoints
- **Stateless design**: Each request is independent
- **Error handling**: Comprehensive error responses
- **CORS enabled**: Cross-origin requests allowed
- **Async support**: Non-blocking request handling

## Model Integration

### 1. CLIP (Contrastive Language-Image Pre-training)
```python
# Zero-shot classification with text prompts
inputs = clip_processor(text=text_prompts, images=img, return_tensors="pt", padding=True)
with torch.no_grad():
    outputs = clip_model(**inputs)
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)
```

**Features**:
- Text-image understanding
- Zero-shot classification
- Custom prompt support
- Multilingual capabilities

### 2. ViT (Vision Transformer)
```python
# Traditional image classification
results = vit_classifier(img)
```

**Features**:
- 1000 ImageNet classes
- High accuracy
- Fast inference
- Transformer architecture

### 3. DETR (Detection Transformer)
```python
# Object detection with bounding boxes
results = detr_detector(img)
```

**Features**:
- End-to-end object detection
- No anchor boxes needed
- Multiple object detection
- Precise localization

## Data Flow

### 1. Image Capture Flow
```
User Camera → WebRTC → HTML5 Video → Canvas → Blob → FormData
```

### 2. Processing Flow
```
FormData → FastAPI → PIL Image → Model Preprocessing → Inference → Postprocessing → JSON Response
```

### 3. Visualization Flow
```
JSON Response → JavaScript → DOM Updates → Canvas Drawing (for DETR)
```

## Performance Optimizations

### Frontend
- **Canvas reuse**: Single canvas element for all operations
- **Blob optimization**: JPEG compression at 90% quality
- **Debouncing**: Prevent rapid successive API calls
- **Error handling**: Graceful degradation on failures

### Backend
- **Model caching**: Load models once, reuse for all requests
- **Memory management**: Efficient tensor operations
- **Async processing**: Non-blocking request handling
- **GPU acceleration**: Automatic CUDA/MPS detection

## Security Considerations

### Current Implementation (Development)
- **CORS**: Enabled for all origins (`*`)
- **File validation**: Basic image format checking
- **No authentication**: Open access for demo purposes

### Production Recommendations
- **CORS**: Restrict to specific domains
- **Rate limiting**: Implement request throttling
- **File validation**: Enhanced security checks
- **Authentication**: Add API keys or OAuth
- **HTTPS**: Secure communication
- **Input sanitization**: Validate all inputs

## Scalability

### Current Limitations
- **Single instance**: No horizontal scaling
- **Memory bound**: Models loaded in single process
- **Synchronous inference**: One request at a time per model

### Scaling Strategies
- **Model serving**: Use dedicated model servers (TorchServe, TensorFlow Serving)
- **Load balancing**: Multiple backend instances
- **Caching**: Redis for result caching
- **Queue system**: Async processing with Celery
- **Microservices**: Separate services per model

## Deployment

### Development
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker (Recommended)
```dockerfile
FROM python:3.10-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Monitoring and Logging

### Metrics to Track
- **Request latency**: Time per inference
- **Memory usage**: Model memory consumption
- **Error rates**: Failed requests
- **Model accuracy**: Inference quality metrics

### Logging Strategy
- **Structured logging**: JSON format
- **Request tracing**: Unique request IDs
- **Performance metrics**: Timing information
- **Error tracking**: Detailed error context

## Future Enhancements

### Technical Improvements
- **WebSocket support**: Real-time streaming
- **Model quantization**: Reduced memory usage
- **Batch processing**: Multiple images per request
- **Progressive loading**: Lazy model loading

### Feature Additions
- **Model comparison**: Side-by-side results
- **Custom model upload**: User-provided models
- **Result export**: Save predictions
- **Video processing**: Continuous stream analysis
