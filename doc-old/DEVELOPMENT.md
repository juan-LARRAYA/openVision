# 🛠️ Development Guide

This guide provides detailed instructions for developers who want to contribute to or extend the HF Vision Demo project.

## 📋 Prerequisites

### System Requirements
- **Python 3.9+** (3.10+ recommended)
- **Git** for version control
- **4GB+ RAM** (8GB+ recommended)
- **Webcam** for testing
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### Optional but Recommended
- **GPU support**: NVIDIA GPU with CUDA or Apple Silicon for faster inference
- **IDE**: VS Code, PyCharm, or similar
- **Docker**: For containerized development

## 🚀 Quick Setup

### 1. Clone and Navigate
```bash
git clone https://github.com/juan-LARRAYA/huggin-face.git
cd huggin-face/hf-vision-demo
```

### 2. Create Virtual Environment
```bash
# Create virtual environment
python3 -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate
```

### 3. Install Dependencies
```bash
# Install all dependencies
pip install -r requirements.txt

# For development, also install dev dependencies
pip install pytest black flake8 mypy
```

### 4. Verify Installation
```bash
# Test the demo script
python demo_script.py

# Start the backend
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## 📁 Project Structure

```
hf-vision-demo/
├── backend/
│   └── main.py              # FastAPI backend server
├── frontend/
│   └── index.html           # Web interface
├── docs/                    # Documentation (if added)
├── tests/                   # Test files (if added)
├── .gitignore              # Git ignore rules
├── requirements.txt        # Python dependencies
├── demo_script.py         # Demo and testing script
├── API.md                 # API documentation
├── ARCHITECTURE.md        # Technical architecture
├── DEVELOPMENT.md         # This file
├── INSTRUCCIONES_RAPIDAS.md # Quick start guide (Spanish)
└── README.md              # Main documentation
```

## 🔧 Development Workflow

### 1. Setting Up Your Environment

#### Environment Variables (Optional)
Create a `.env` file for configuration:
```bash
# .env
HUGGINGFACE_HUB_CACHE=/path/to/cache
CUDA_VISIBLE_DEVICES=0
LOG_LEVEL=INFO
```

#### IDE Configuration
For VS Code, create `.vscode/settings.json`:
```json
{
    "python.defaultInterpreterPath": "./.venv/bin/python",
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "black"
}
```

### 2. Code Style and Formatting

#### Black (Code Formatting)
```bash
# Format all Python files
black backend/ *.py

# Check formatting
black --check backend/ *.py
```

#### Flake8 (Linting)
```bash
# Lint Python files
flake8 backend/ *.py --max-line-length=88
```

#### MyPy (Type Checking)
```bash
# Type checking
mypy backend/main.py
```

### 3. Testing

#### Manual Testing
```bash
# Test API endpoints
python demo_script.py

# Test with curl
curl -X GET "http://localhost:8000/"
```

#### Unit Tests (if implemented)
```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=backend tests/
```

## 🔄 Making Changes

### Backend Development

#### Adding New Models
1. **Install model dependencies** in `requirements.txt`
2. **Add model loading** in `load_pipelines()`:
```python
def load_pipelines():
    global new_model
    print("Loading new model...")
    new_model = pipeline("task", model="model-name")
```

3. **Create new endpoint**:
```python
@app.post("/new-endpoint")
async def new_endpoint(file: UploadFile = File(...)):
    data = await file.read()
    img = read_imagefile(data)
    results = new_model(img)
    return {"model": "New Model", "results": results}
```

#### Modifying Existing Endpoints
- **Input validation**: Add proper error handling
- **Response format**: Maintain consistent JSON structure
- **Performance**: Consider caching and optimization

### Frontend Development

#### Adding New UI Elements
1. **HTML structure** in `index.html`
2. **CSS styling** in the `<style>` section
3. **JavaScript functionality** in the `<script>` section

#### Modifying Visualization
- **Canvas operations**: For drawing bounding boxes
- **DOM manipulation**: For displaying results
- **Event handling**: For user interactions

## 🧪 Testing Your Changes

### 1. Backend Testing
```bash
# Start backend in development mode
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Test endpoints
curl -X POST "http://localhost:8000/classify" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.jpg"
```

### 2. Frontend Testing
1. **Open** `frontend/index.html` in browser
2. **Allow camera access** when prompted
3. **Test each button** and verify results
4. **Check browser console** for errors

### 3. Integration Testing
```bash
# Run the demo script
python demo_script.py
```

## 🐛 Debugging

### Common Issues and Solutions

#### Model Loading Errors
```python
# Add debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Check model cache
import transformers
print(transformers.file_utils.default_cache_path)
```

#### Memory Issues
```python
# Monitor memory usage
import psutil
print(f"Memory usage: {psutil.virtual_memory().percent}%")

# Clear GPU cache (if using CUDA)
import torch
torch.cuda.empty_cache()
```

#### CORS Issues
```python
# Add specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Debugging Tools

#### Backend Debugging
```bash
# Run with debug mode
uvicorn backend.main:app --reload --log-level debug

# Use Python debugger
import pdb; pdb.set_trace()
```

#### Frontend Debugging
- **Browser DevTools**: F12 to open
- **Console logs**: Check for JavaScript errors
- **Network tab**: Monitor API requests
- **Application tab**: Check local storage

## 📦 Building and Deployment

### Development Server
```bash
# Backend
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (optional local server)
python -m http.server 3000
```

### Production Build
```bash
# Install production dependencies only
pip install --no-dev -r requirements.txt

# Run with production settings
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker Development
```dockerfile
# Dockerfile.dev
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "backend.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -f Dockerfile.dev -t hf-vision-demo:dev .
docker run -p 8000:8000 -v $(pwd):/app hf-vision-demo:dev
```

## 🔍 Performance Optimization

### Backend Optimization
- **Model caching**: Keep models in memory
- **Async processing**: Use FastAPI's async capabilities
- **GPU utilization**: Ensure CUDA/MPS is working
- **Memory management**: Monitor and optimize usage

### Frontend Optimization
- **Image compression**: Optimize JPEG quality
- **Request debouncing**: Prevent rapid API calls
- **Canvas optimization**: Reuse canvas elements
- **Error handling**: Graceful degradation

## 📚 Learning Resources

### FastAPI
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

### Hugging Face Transformers
- [Transformers Documentation](https://huggingface.co/docs/transformers)
- [Model Hub](https://huggingface.co/models)

### Computer Vision
- [PyTorch Vision](https://pytorch.org/vision/stable/index.html)
- [OpenCV Python](https://opencv-python-tutroals.readthedocs.io/)

## 🤝 Contributing Guidelines

### Before Contributing
1. **Check existing issues** and pull requests
2. **Create an issue** for new features or bugs
3. **Fork the repository** and create a feature branch
4. **Follow code style** guidelines

### Pull Request Process
1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update README** if necessary
5. **Create detailed PR description**

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact is considered

## 🆘 Getting Help

### Documentation
- Check this `DEVELOPMENT.md` file
- Read the main `README.md`
- Review `API.md` for endpoint details
- Check `ARCHITECTURE.md` for system design

### Community
- [GitHub Issues](https://github.com/juan-LARRAYA/huggin-face/issues)
- [Hugging Face Forums](https://discuss.huggingface.co/)
- [FastAPI Discord](https://discord.gg/VQjSZaeJmf)

### Debugging Steps
1. **Check logs** for error messages
2. **Verify dependencies** are installed correctly
3. **Test with minimal example**
4. **Search existing issues**
5. **Create detailed bug report** if needed

---

Happy coding! 🚀
