# OpenVision

> **OpenVision** is a handy and minimalistic tool for testing new artificial vision models. You can upload your Hugging Face models through the UI and try them out directly in your browser.

![Demo of OpenVision](images/demo.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Transformers.js](https://img.shields.io/badge/Transformers.js-2.17+-yellow.svg)](https://huggingface.co/docs/transformers.js)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success.svg)](https://open-vision-hf.vercel.app)

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

## 🚀 Quick Start

### Project Structure
```
OpenVision/
├── hf-vision-demo/           # Main Vite + React application
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── index.html            # HTML entry point
│   ├── vite.config.ts        # Vite configuration
│   ├── vercel.json           # Vercel deployment config
│   ├── package.json          # Dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
├── AGENT_GUIDE.md            # Guide for AI agents
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
└── package.json              # Root project metadata
```

### Tech Stack

- **Framework:** React 19.2 + TypeScript
- **Build Tool:** Vite 7.2
- **AI Library:** Transformers.js (client-side inference)
- **Styling:** CSS Modules
- **Deployment:** Vercel

### Local Development

```bash
# Clone repository
git clone git@github.com:juan-LARRAYA/openVision.git
cd openVision

# Install dependencies
cd hf-vision-demo
npm install

# Start development server
npm run dev

# Access application at http://localhost:8080
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
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

- **Frontend:** React 19.2 with TypeScript 5.9
- **Build Tool:** Vite 7.2 (fast HMR, optimized builds)
- **AI Framework:** Transformers.js 2.17+ (browser-based inference)
- **AI Runtime:** WebAssembly (WASM) + WebGL/WebGPU acceleration
- **Browser APIs:** MediaDevices (webcam), Canvas 2D
- **Styling:** CSS Modules (scoped, modular styles)
- **Deployment:** Vercel (optimized for SPAs)

## 🚢 Deployment

### Vercel Deployment (Recommended)

This project is configured for deployment on Vercel:

**Deployment Account:** juanlarraya00@gmail.com
**Repository:** [https://github.com/juan-LARRAYA/openVision](https://github.com/juan-LARRAYA/openVision)

#### Deploy via Vercel CLI

```bash
cd hf-vision-demo

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `juan-LARRAYA/openVision`
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `hf-vision-demo`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click "Deploy"

#### Important Configuration

The project includes a [vercel.json](hf-vision-demo/vercel.json) file that configures:
- CORS headers required for WebGPU/SharedArrayBuffer support
- SPA routing (all routes redirect to index.html)

### Alternative Deployment Options

**Netlify:**
- Root directory: `hf-vision-demo`
- Build command: `npm run build`
- Publish directory: `dist`

**Other Static Hosts:**
- Build the project: `npm run build`
- Deploy the `dist` folder to any static hosting service

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

- **Issues:** [GitHub Issues](https://github.com/juan-LARRAYA/OpenVision/issues)
- **Discussions:** [GitHub Discussions](https://github.com/juan-LARRAYA/OpenVision/discussions)
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

**Made with ❤️ for the AI community**

## 🌐 Live Demo

**🚀 [Try OpenVision Live](https://open-vision-hf.vercel.app)**

**Deployment Info:**
- **Status:** ✅ Live on Vercel
- **Account:** juanlarraya00@gmail.com
- **Repository:** [juan-LARRAYA/openVision](https://github.com/juan-LARRAYA/openVision)
- **Production URL:** https://open-vision-hf.vercel.app