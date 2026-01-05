# Project Structure

This document provides an overview of the project structure for the Browser AI Vision Models application.

## Directory Tree

```
browser-ai-vision-models/
│
├── 📄 README.md                    # Main documentation (start here!)
├── 📄 AGENT_GUIDE.md               # Guide for AI agents/assistants
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 LICENSE                      # MIT License
├── 📄 package.json                 # Project metadata and scripts
├── 📄 .gitignore                   # Git ignore rules
│
└── 📁 hf-vision-demo/              # Main application directory
    │
    ├── 📄 index.html               # ⭐ Main application (single-file SPA)
    ├── 📄 vercel.json              # Vercel deployment configuration
    ├── 📄 requirements.txt         # Python dependencies (legacy)
    │
    ├── 📄 README.md                # Detailed user documentation
    ├── 📄 ARCHITECTURE.md          # Technical architecture
    ├── 📄 DEVELOPMENT.md           # Development guide
    ├── 📄 API.md                   # API reference (legacy)
    ├── 📄 INSTRUCCIONES_RAPIDAS.md # Quick start (Spanish)
    │
    ├── 📄 demo_script.py           # Demo script (legacy)
    │
    ├── 📁 backend/                 # Legacy server code (deprecated)
    │   └── main.py                 # FastAPI server (not used)
    │
    ├── 📁 frontend/                # Legacy frontend (deprecated)
    │   └── index.html              # Old version (not used)
    │
    └── 📁 .github/                 # GitHub configuration
        └── copilot-instructions.md # GitHub Copilot instructions
```

## Key Files

### Root Level

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Main project documentation | Everyone |
| `AGENT_GUIDE.md` | AI agent-specific guide | AI assistants |
| `PROJECT_STRUCTURE.md` | This file | Developers |
| `CONTRIBUTING.md` | Contribution guidelines | Contributors |
| `LICENSE` | MIT License | Legal |
| `package.json` | Project metadata | Tools/Developers |

### Application Directory (`hf-vision-demo/`)

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Main application | ✅ Active |
| `vercel.json` | Deployment config | ✅ Active |
| `README.md` | User documentation | ✅ Active |
| `ARCHITECTURE.md` | Technical docs | ✅ Active |
| `DEVELOPMENT.md` | Dev guide | ✅ Active |
| `API.md` | API reference | ⚠️ Legacy |
| `requirements.txt` | Python deps | ⚠️ Legacy |
| `demo_script.py` | Demo script | ⚠️ Legacy |
| `backend/` | Server code | ⚠️ Deprecated |
| `frontend/` | Old frontend | ⚠️ Deprecated |

## Application Architecture

### Current Version (Client-Side)

```
index.html (Single File)
├── HTML Structure
│   ├── Video element (webcam)
│   ├── Canvas element (drawing)
│   ├── Control buttons
│   └── Result displays
│
├── CSS Styles
│   ├── Layout & Grid
│   ├── Colors & Gradients
│   ├── Animations
│   └── Responsive Design
│
└── JavaScript (ES6 Module)
    ├── Transformers.js Import (CDN)
    ├── Model Initialization
    │   ├── ViT (Image Classification)
    │   ├── CLIP (Zero-Shot Classification)
    │   └── DETR (Object Detection)
    ├── Camera Management
    ├── Image Capture
    ├── Inference Functions
    ├── Result Display
    └── Event Handlers
```

### Legacy Version (Client-Server)

```
backend/
└── main.py (FastAPI)
    ├── ViT endpoint
    ├── CLIP endpoint
    ├── DETR endpoint
    └── Static file serving

frontend/
└── index.html
    └── Fetch API calls to backend
```

**Note:** The legacy version is deprecated. The current version runs entirely in the browser.

## Data Flow

### Current Architecture

```
User's Browser
    │
    ├─→ Camera Access (MediaDevices API)
    │       │
    │       ↓
    ├─→ Video Feed Display
    │       │
    │       ↓
    ├─→ Image Capture (Canvas API)
    │       │
    │       ↓
    ├─→ Transformers.js (WebAssembly)
    │       │
    │       ├─→ Model 1: ViT
    │       ├─→ Model 2: CLIP
    │       └─→ Model 3: DETR
    │           │
    │           ↓
    └─→ Display Results (DOM Update)
```

### Model Loading Flow

```
Page Load
    │
    ↓
Import Transformers.js from CDN
    │
    ↓
Initialize Models
    │
    ├─→ Download ViT (~350MB)
    │   └─→ Cache in Browser
    │
    ├─→ Download CLIP (~600MB)
    │   └─→ Cache in Browser
    │
    └─→ Download DETR (~170MB)
        └─→ Cache in Browser
    │
    ↓
Models Ready for Inference
```

## File Sizes

| Component | Size | Location |
|-----------|------|----------|
| Main HTML | ~15 KB | index.html |
| Transformers.js | ~500 KB | CDN |
| ViT Model | ~350 MB | CDN → Browser Cache |
| CLIP Model | ~600 MB | CDN → Browser Cache |
| DETR Model | ~170 MB | CDN → Browser Cache |
| **Total First Load** | **~1.1 GB** | - |
| **Subsequent Loads** | **~515 KB** | Models cached |

## Code Organization

### index.html Structure

```javascript
Lines 1-6     : HTML Head & Meta Tags
Lines 7-180   : CSS Styles (Embedded)
Lines 182-230 : HTML Body Structure
Lines 232-447 : JavaScript Module
    Lines 232-238  : Imports & Configuration
    Lines 240-252  : Global Variables
    Lines 254-258  : UI Helper Functions
    Lines 261-286  : Model Initialization
    Lines 289-298  : Camera Management
    Lines 301-334  : Image Capture & Display
    Lines 337-349  : ViT Inference
    Lines 352-371  : CLIP Inference
    Lines 374-387  : DETR Inference
    Lines 390-422  : Detection Visualization
    Lines 425-447  : Event Listeners
```

## Dependencies

### Runtime Dependencies

| Dependency | Version | Source | Purpose |
|------------|---------|--------|---------|
| Transformers.js | 2.17.2 | CDN (jsDelivr) | AI model inference |

### Development Dependencies

None required! This is a static application.

### Browser Requirements

| API | Purpose | Minimum Browser Version |
|-----|---------|------------------------|
| ES6 Modules | Script imports | Chrome 61+, Firefox 60+ |
| MediaDevices | Camera access | Chrome 53+, Firefox 36+ |
| Canvas 2D | Image processing | All modern browsers |
| WebAssembly | Model inference | Chrome 57+, Firefox 52+ |
| SharedArrayBuffer | Performance | Chrome 68+, Firefox 79+ |

## Deployment

### Required Files for Deployment

**Minimum (Essential):**
- `hf-vision-demo/index.html`

**Recommended (With config):**
- `hf-vision-demo/index.html`
- `hf-vision-demo/vercel.json` (for proper CORS headers)

**Optional (Documentation):**
- `hf-vision-demo/README.md`
- Other documentation files

### Deployment Targets

| Platform | Configuration File | Notes |
|----------|-------------------|-------|
| Vercel | `vercel.json` | Auto-detects, CORS headers |
| Netlify | None needed | Drag & drop folder |
| GitHub Pages | None needed | Enable in settings |
| Any Static Host | None needed | Serve index.html |

## Development Workflow

### For Developers

```bash
1. Clone repository
2. cd hf-vision-demo
3. Start local server (python -m http.server 8080)
4. Open browser (http://localhost:8080)
5. Edit index.html
6. Refresh browser
7. Test changes
```

**No build process required!**

### For AI Agents

1. Read `AGENT_GUIDE.md` for detailed instructions
2. Understand `index.html` structure (single file)
3. Make modifications
4. Test locally
5. Deploy

## Documentation Map

```
Start Here
    │
    ├─→ User? → README.md (root)
    │               ↓
    │         hf-vision-demo/README.md
    │               ↓
    │         ARCHITECTURE.md / DEVELOPMENT.md
    │
    ├─→ AI Agent? → AGENT_GUIDE.md
    │                   ↓
    │         PROJECT_STRUCTURE.md (this file)
    │                   ↓
    │         index.html (source code)
    │
    └─→ Contributor? → CONTRIBUTING.md
                           ↓
                     DEVELOPMENT.md
                           ↓
                     Make changes & PR
```

## Version History

- **v2.0.0** (Current) - Client-side only, browser-based AI
- **v1.x** (Legacy) - Client-server architecture with FastAPI backend

## Migration Notes

**From v1.x to v2.0:**

- Backend removed (FastAPI server deprecated)
- All processing moved to browser
- Models run via Transformers.js
- No Python dependencies needed
- Deployment simplified (static hosting)

## Future Considerations

### Potential Additions

- [ ] More AI models (segmentation, pose estimation)
- [ ] Image upload support (in addition to webcam)
- [ ] Model switching (different model variants)
- [ ] Performance optimizations
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode improvements

### Maintenance

- Update Transformers.js version periodically
- Monitor browser API changes
- Test on new browser versions
- Update documentation

---

**Document Version:** 1.0
**Last Updated:** 2025-01-23
**Maintained By:** Project Contributors
