# 🔌 API Documentation

This document describes the FastAPI backend endpoints for the HF Vision Demo application.

## Base URL

```
http://localhost:8000
```

## Authentication

No authentication required for this demo application.

## Endpoints

### GET /

**Description**: Get API information and available models

**Response**:
```json
{
  "message": "HF Vision Demo API - 3 Most Popular Vision Models",
  "models": [
    "CLIP (openai/clip-vit-base-patch32)",
    "ViT (google/vit-base-patch16-224)",
    "DETR (facebook/detr-resnet-50)"
  ]
}
```

---

### POST /classify

**Description**: Image classification using Vision Transformer (ViT)

**Parameters**:
- `file` (required): Image file (multipart/form-data)

**Supported formats**: JPEG, PNG, WebP

**Request Example**:
```bash
curl -X POST "http://localhost:8000/classify" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg"
```

**Response**:
```json
{
  "model": "ViT (google/vit-base-patch16-224)",
  "results": [
    {
      "label": "Golden retriever",
      "score": 0.8945
    },
    {
      "label": "Labrador retriever",
      "score": 0.0823
    },
    {
      "label": "Nova Scotia duck tolling retriever",
      "score": 0.0156
    }
  ]
}
```

---

### POST /clip

**Description**: Zero-shot classification using CLIP with predefined categories

**Parameters**:
- `file` (required): Image file (multipart/form-data)

**Predefined categories**:
- "a photo of a person"
- "a photo of an animal"
- "a photo of a car"
- "a photo of food"
- "a photo of a building"
- "a photo of nature"
- "a photo of technology"
- "a photo of furniture"
- "a photo of clothing"

**Request Example**:
```bash
curl -X POST "http://localhost:8000/clip" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg"
```

**Response**:
```json
{
  "model": "CLIP (openai/clip-vit-base-patch32)",
  "results": [
    {
      "label": "animal",
      "score": 0.7234
    },
    {
      "label": "nature",
      "score": 0.1456
    },
    {
      "label": "person",
      "score": 0.0892
    }
  ]
}
```

---

### POST /clip-custom

**Description**: CLIP classification with custom text prompts

**Parameters**:
- `file` (required): Image file (multipart/form-data)
- `prompts` (required): Comma-separated text prompts (form data)

**Request Example**:
```bash
curl -X POST "http://localhost:8000/clip-custom" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg" \
  -F "prompts=happy person,sad person,angry person,surprised person"
```

**Response**:
```json
{
  "model": "CLIP (openai/clip-vit-base-patch32)",
  "results": [
    {
      "label": "happy person",
      "score": 0.6789
    },
    {
      "label": "surprised person",
      "score": 0.2134
    },
    {
      "label": "sad person",
      "score": 0.0876
    },
    {
      "label": "angry person",
      "score": 0.0201
    }
  ]
}
```

---

### POST /detect

**Description**: Object detection using DETR (Detection Transformer)

**Parameters**:
- `file` (required): Image file (multipart/form-data)

**Request Example**:
```bash
curl -X POST "http://localhost:8000/detect" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg"
```

**Response**:
```json
{
  "model": "DETR (facebook/detr-resnet-50)",
  "results": [
    {
      "label": "person",
      "score": 0.9876,
      "box": {
        "xmin": 123,
        "ymin": 45,
        "xmax": 456,
        "ymax": 789
      }
    },
    {
      "label": "car",
      "score": 0.8234,
      "box": {
        "xmin": 200,
        "ymin": 300,
        "xmax": 600,
        "ymax": 500
      }
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid file format. Supported formats: JPEG, PNG, WebP"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "file"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Model inference failed. Please try again."
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider implementing rate limiting based on your requirements.

## Performance Notes

- **First request**: May take longer due to model loading
- **Subsequent requests**: Faster as models are cached in memory
- **Image size**: Larger images take more time to process
- **Concurrent requests**: Limited by available memory and CPU/GPU resources

## CORS

CORS is enabled for all origins (`*`) in development. For production, configure specific allowed origins.

## Model Details

### CLIP (openai/clip-vit-base-patch32)
- **Input size**: 224x224 pixels
- **Processing time**: ~1-2 seconds
- **Memory usage**: ~600MB

### ViT (google/vit-base-patch16-224)
- **Input size**: 224x224 pixels
- **Processing time**: ~0.5-1 seconds
- **Memory usage**: ~350MB
- **Classes**: 1000 ImageNet categories

### DETR (facebook/detr-resnet-50)
- **Input size**: Variable (automatically resized)
- **Processing time**: ~1-3 seconds
- **Memory usage**: ~170MB
- **Max detections**: 100 objects per image
- **Confidence threshold**: 0.7 (configurable)

## Development

To run the API server in development mode:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation is automatically available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
