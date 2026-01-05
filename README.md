# Browser AI Vision Models

> **Client-Side AI Vision Models** - Run state-of-the-art computer vision models directly in your browser. No backend, no API keys, complete privacy.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Transformers.js](https://img.shields.io/badge/Transformers.js-2.17+-yellow.svg)](https://huggingface.co/docs/transformers.js)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

## 🎯 Quick Overview

This project demonstrates how to run **3 popular computer vision models** entirely in the browser using [Transformers.js](https://huggingface.co/docs/transformers.js):

- **CLIP** - Zero-shot image classification with natural language
- **ViT** - Vision Transformer for precise object recognition
- **DETR** - Object detection with bounding boxes

**Key Features:**
- ✅ Runs 100% client-side (no server needed)
- ✅ Complete privacy (no data leaves your device)
- ✅ Real-time webcam processing
- ✅ Easy deployment (static files only)
- ✅ No API keys or authentication required

## 🚀 For AI Agents: Quick Start

### Project Structure
```
browser-ai-vision-models/
├── hf-vision-demo/           # Main application
│   ├── index.html            # Single-file application (client-side AI)
│   ├── vercel.json           # Deployment config
│   ├── README.md             # Detailed documentation
│   ├── ARCHITECTURE.md       # Technical architecture
│   ├── API.md                # API reference (legacy)
│   ├── DEVELOPMENT.md        # Development guide
│   └── backend/              # Legacy code (not used in current version)
├── AGENT_GUIDE.md            # Guide specifically for AI agents
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
└── package.json              # Project metadata
```

### Key Information for Agents

**Application Type:** Single-page application (SPA) with embedded AI models
**Main File:** `/hf-vision-demo/index.html` (self-contained, ~450 lines)
**Dependencies:** Transformers.js loaded via CDN
**Deployment:** Static hosting (Vercel, Netlify, GitHub Pages)

### Essential Commands

```bash
# Clone repository
git clone https://github.com/juan-LARRAYA/huggin-face.git
cd huggin-face

# Start local server (option 1 - Python)
cd hf-vision-demo && python -m http.server 8080

# Start local server (option 2 - Node.js)
cd hf-vision-demo && npx serve .

# Access application
# Open browser to http://localhost:8080
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  index.html (Single File Application)             │    │
│  │                                                     │    │
│  │  ┌──────────────┐    ┌──────────────────────┐    │    │
│  │  │  HTML/CSS    │    │  JavaScript Module   │    │    │
│  │  │  - UI        │◄──►│  - Transformers.js   │    │    │
│  │  │  - Camera    │    │  - AI Models         │    │    │
│  │  │  - Canvas    │    │  - Processing        │    │    │
│  │  └──────────────┘    └──────────────────────┘    │    │
│  │                                                     │    │
│  │  Models (cached in browser):                       │    │
│  │  • CLIP (~600MB)                                  │    │
│  │  • ViT (~350MB)                                   │    │
│  │  • DETR (~170MB)                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation

Comprehensive documentation is available:

- **[Main Application README](hf-vision-demo/README.md)** - User guide, features, troubleshooting
- **[AGENT_GUIDE.md](AGENT_GUIDE.md)** - Detailed guide for AI agents (recommended)
- **[ARCHITECTURE.md](hf-vision-demo/ARCHITECTURE.md)** - Technical architecture and design
- **[DEVELOPMENT.md](hf-vision-demo/DEVELOPMENT.md)** - Development setup and guidelines
- **[API.md](hf-vision-demo/API.md)** - API reference (legacy backend)
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

## 🤖 AI Models Included

### 1. CLIP (openai/clip-vit-base-patch32)
- **Task:** Zero-shot image classification
- **Input:** Image + text prompts
- **Output:** Similarity scores for each prompt
- **Use case:** Flexible categorization without training

### 2. ViT (google/vit-base-patch16-224)
- **Task:** Image classification
- **Input:** Image
- **Output:** Top-5 predictions from 1000 ImageNet classes
- **Use case:** Precise object recognition

### 3. DETR (facebook/detr-resnet-50)
- **Task:** Object detection
- **Input:** Image
- **Output:** Detected objects with bounding boxes
- **Use case:** Locating multiple objects in a scene

## 🛠️ Technical Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI Framework:** Transformers.js 2.17+
- **AI Runtime:** WebAssembly (WASM) + WebGL acceleration
- **Browser APIs:** MediaDevices (webcam), Canvas 2D
- **Deployment:** Static hosting (no build step required)

## 🚢 Deployment

### Quick Deploy

**Vercel (Recommended):**
```bash
cd hf-vision-demo
vercel deploy
```

**Netlify:**
```bash
# Drag and drop the hf-vision-demo folder to netlify.com
```

**GitHub Pages:**
```bash
# Enable GitHub Pages in repository settings
# Set source to main branch
# Access: https://yourusername.github.io/huggin-face/hf-vision-demo/
```

### Configuration Files

- **vercel.json** - Configures CORS headers for browser AI
- **package.json** - Project metadata and scripts
- No build configuration needed (static files)

## 🔒 Privacy & Security

- **100% Client-Side:** All processing happens in the browser
- **No Data Transmission:** Images never leave your device
- **No Tracking:** No analytics or tracking scripts
- **No Authentication:** No API keys or user accounts needed
- **Open Source:** Fully transparent MIT licensed code

## 💡 Use Cases

- **Education:** Learn how browser AI works
- **Prototyping:** Quick AI demos without backend
- **Privacy-First Apps:** Applications that require data privacy
- **Offline Applications:** Works offline after initial model download
- **Edge Computing:** Run AI where data is created

## 🎓 Learning Resources

**For understanding this codebase:**
- Read `AGENT_GUIDE.md` for AI agent-specific guidance
- Review `hf-vision-demo/index.html` - single file, well-commented
- Check `ARCHITECTURE.md` for system design

**For learning the technologies:**
- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [WebAssembly Guide](https://webassembly.org/getting-started/developers-guide/)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)

## 📊 Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Initial Load | 5-10 min | First time only (model download) |
| Subsequent Loads | <5 sec | Models cached in browser |
| Inference Time | 2-5 sec | Varies by device/model |
| Memory Usage | 2-4 GB | All 3 models loaded |
| Disk Space | ~1 GB | Cached models in browser storage |

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Camera not working | Check browser permissions, try different browser |
| Models not loading | Check internet connection, clear browser cache |
| Out of memory | Close other tabs, use device with more RAM |
| CORS errors | Use proper web server (not `file://`), check headers |

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/juan-LARRAYA/huggin-face/issues)
- **Discussions:** [GitHub Discussions](https://github.com/juan-LARRAYA/huggin-face/discussions)
- **Documentation:** Check the docs folder in this repository

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) - Models and Transformers.js
- [OpenAI](https://openai.com/) - CLIP model
- [Google Research](https://github.com/google-research/vision_transformer) - Vision Transformer
- [Facebook Research](https://github.com/facebookresearch/detr) - DETR

---

**Made with ❤️ for the AI community** | [Live Demo](https://hf-vision-demo-191r2h6d6-juanlarraya00-gmailcoms-projects.vercel.app)
