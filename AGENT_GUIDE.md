# AI Agent Guide - Browser AI Vision Models

> **Comprehensive guide for AI agents (like Claude Code, GitHub Copilot, etc.) working with this codebase**

## 🎯 Purpose of This Guide

This document is specifically designed for AI coding assistants to understand, modify, and extend this project efficiently. It provides structured information about the codebase architecture, common modification patterns, and best practices.

## 📋 Quick Reference Card

```yaml
Project Name: Browser AI Vision Models (formerly "huggin-face")
Type: Client-side single-page application
Main Technology: Transformers.js (browser-based AI)
Primary File: hf-vision-demo/index.html
Language: JavaScript (ES6+ modules)
Dependencies: None (CDN-based)
Deployment: Static hosting
Build Required: No
```

## 🏗️ Architecture Overview

### System Design

This is a **zero-backend** application that runs entirely in the browser:

1. **Single HTML File** (`index.html`) contains:
   - HTML structure
   - CSS styles (embedded)
   - JavaScript code (ES6 module)

2. **No Build Process:**
   - No webpack, no babel, no npm install
   - Direct CDN import of Transformers.js
   - Served as static files

3. **AI Processing:**
   - Models loaded from Hugging Face CDN
   - Inference runs in browser using WASM
   - Results displayed in real-time

### Component Breakdown

```javascript
// Main components in index.html

1. UI Layer (HTML/CSS)
   ├── Video element (webcam feed)
   ├── Canvas element (drawing detections)
   ├── Control buttons (model triggers)
   ├── Results display (cards with predictions)
   └── Status/progress indicators

2. JavaScript Module (ES6)
   ├── Model initialization (async)
   ├── Camera handling (MediaDevices API)
   ├── Image capture (Canvas API)
   ├── Model inference (Transformers.js)
   ├── Result processing
   └── UI updates

3. External Dependencies
   └── @xenova/transformers@2.17.2 (CDN)
```

## 🔍 Code Structure Analysis

### Key Code Sections in index.html

#### 1. Model Configuration (lines 234-238)
```javascript
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.allowRemoteModels = true;  // Allow downloading models
env.allowLocalModels = false;   // Disable local model loading
```

**When to modify:**
- Changing Transformers.js version
- Enabling local model support
- Configuring model cache behavior

#### 2. Model Initialization (lines 261-286)
```javascript
async function initializeModels() {
  classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
  clipModel = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
  detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
}
```

**When to modify:**
- Adding new models
- Replacing models with different variants
- Changing model loading order

#### 3. Camera Handling (lines 289-298)
```javascript
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 }
  });
  video.srcObject = stream;
}
```

**When to modify:**
- Changing video resolution
- Adding camera constraints (facingMode, frameRate)
- Supporting multiple cameras

#### 4. Image Capture (lines 301-304)
```javascript
function captureImage() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.9);
}
```

**When to modify:**
- Changing image format (PNG, WEBP)
- Adjusting JPEG quality
- Adding image preprocessing

#### 5. Model Inference Functions (lines 337-387)
```javascript
async function runViT() { /* ... */ }
async function runCLIP(customPrompts) { /* ... */ }
async function runDETR() { /* ... */ }
```

**When to modify:**
- Adding new model inference
- Changing result processing
- Adding error handling

## 🛠️ Common Modification Patterns

### Pattern 1: Adding a New Model

```javascript
// 1. Add model pipeline initialization
let newModel = null;

// 2. Load model in initializeModels()
async function initializeModels() {
  // ... existing code ...
  updateProgress(85, 'Loading new model...');
  newModel = await pipeline('task-type', 'model-name');
}

// 3. Create inference function
async function runNewModel() {
  if (!modelsLoaded) return;

  try {
    showLoading('newModelResult');
    const imageData = captureImage();
    const results = await newModel(imageData);
    displayResults('newModelResult', results);
  } catch (error) {
    console.error('Model error:', error);
    document.getElementById('newModelContent').innerHTML =
      `<div class="loading">❌ Error: ${error.message}</div>`;
  }
}

// 4. Add UI button
// In HTML: <button id="newModelBtn" class="new-model-btn">🆕 New Model</button>

// 5. Add event listener
document.getElementById('newModelBtn').addEventListener('click', runNewModel);

// 6. Add result display section
// In HTML: <div class="result" id="newModelResult" style="display:none;">...</div>
```

### Pattern 2: Customizing Result Display

```javascript
// Example: Display results with custom formatting
function displayCustomResults(resultId, results) {
  const contentEl = document.getElementById(resultId.replace('Result', 'Content'));

  let html = '<div class="custom-results">';
  results.forEach((result, index) => {
    html += `
      <div class="custom-result-item">
        <span class="rank">#${index + 1}</span>
        <span class="label">${result.label}</span>
        <div class="score-bar" style="width: ${result.score * 100}%"></div>
        <span class="percentage">${(result.score * 100).toFixed(1)}%</span>
      </div>
    `;
  });
  html += '</div>';
  contentEl.innerHTML = html;
}
```

### Pattern 3: Adding Image Preprocessing

```javascript
function preprocessImage(imageData, options = {}) {
  const img = new Image();
  img.src = imageData;

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize
      canvas.width = options.width || 224;
      canvas.height = options.height || 224;

      // Apply filters
      ctx.filter = options.filter || 'none';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
}

// Usage
async function runModelWithPreprocessing() {
  const rawImage = captureImage();
  const processedImage = await preprocessImage(rawImage, {
    width: 384,
    height: 384,
    filter: 'brightness(1.1) contrast(1.1)'
  });
  const results = await model(processedImage);
}
```

### Pattern 4: Adding Batch Processing

```javascript
// Capture multiple frames and average results
async function runBatchInference(numFrames = 5, delayMs = 100) {
  const allResults = [];

  for (let i = 0; i < numFrames; i++) {
    const imageData = captureImage();
    const results = await model(imageData);
    allResults.push(results);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  // Aggregate results
  const aggregated = aggregateResults(allResults);
  return aggregated;
}

function aggregateResults(allResults) {
  // Average scores across all frames
  const labelMap = {};

  allResults.forEach(results => {
    results.forEach(result => {
      if (!labelMap[result.label]) {
        labelMap[result.label] = [];
      }
      labelMap[result.label].push(result.score);
    });
  });

  // Calculate averages
  return Object.entries(labelMap).map(([label, scores]) => ({
    label,
    score: scores.reduce((a, b) => a + b, 0) / scores.length
  })).sort((a, b) => b.score - a.score);
}
```

## 📝 File Modification Guide

### index.html Line-by-Line Reference

| Lines | Content | Modification Risk | Common Changes |
|-------|---------|-------------------|----------------|
| 1-6 | HTML head, meta tags | Low | Title, charset, viewport |
| 7-180 | CSS styles | Low | Colors, layout, responsive |
| 182-230 | HTML body structure | Medium | Adding UI elements |
| 232-238 | Transformers.js import | High | Version updates |
| 240-252 | Global variables | Medium | Adding new model refs |
| 254-258 | Progress UI functions | Low | Progress display |
| 261-286 | Model initialization | High | Adding/removing models |
| 289-298 | Camera startup | Medium | Camera configuration |
| 301-304 | Image capture | Low | Image format/quality |
| 307-312 | Loading state display | Low | Loading messages |
| 315-334 | Result display | Medium | Result formatting |
| 337-349 | ViT inference | High | Model logic |
| 352-371 | CLIP inference | High | Model logic |
| 374-387 | DETR inference | High | Model logic |
| 390-422 | Detection drawing | Medium | Visualization |
| 425-442 | Event listeners | Medium | Button handlers |

### Modification Safety Levels

**Low Risk (Safe to modify):**
- CSS styles and colors
- UI text and labels
- Progress messages
- Result formatting

**Medium Risk (Test carefully):**
- HTML structure
- Event handlers
- Camera configuration
- Result display logic

**High Risk (Requires understanding):**
- Model initialization
- Inference functions
- Transformers.js configuration
- Error handling

## 🚨 Common Pitfalls for Agents

### Pitfall 1: Async/Await Misuse
```javascript
// ❌ Wrong - doesn't wait for model
function runModel() {
  const results = model(image);  // Promise not awaited!
  displayResults(results);       // Results is Promise, not data
}

// ✅ Correct
async function runModel() {
  const results = await model(image);
  displayResults(results);
}
```

### Pitfall 2: Model Not Loaded
```javascript
// ❌ Wrong - model might not be loaded
async function runModel() {
  const results = await model(image);  // model is null!
}

// ✅ Correct
async function runModel() {
  if (!modelsLoaded) {
    console.warn('Models not loaded yet');
    return;
  }
  const results = await model(image);
}
```

### Pitfall 3: Canvas Context Issues
```javascript
// ❌ Wrong - ctx can be null
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0);  // Might fail

// ✅ Correct
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
```

### Pitfall 4: Memory Leaks
```javascript
// ❌ Wrong - creates new listeners each time
function setupButton() {
  document.getElementById('btn').addEventListener('click', handler);
}
setupButton(); // Called multiple times = multiple listeners

// ✅ Correct
document.getElementById('btn').addEventListener('click', handler);
// Only add listener once, outside function
```

## 🧪 Testing Modifications

### Testing Checklist

When modifying the code, test:

1. **Model Loading:**
   - [ ] Models load successfully
   - [ ] Progress bar updates
   - [ ] Error handling works

2. **Camera Access:**
   - [ ] Camera permissions requested
   - [ ] Video feed displays
   - [ ] Works on mobile

3. **Inference:**
   - [ ] Each model button works
   - [ ] Results display correctly
   - [ ] Errors are caught and shown

4. **UI Responsiveness:**
   - [ ] Desktop layout works
   - [ ] Mobile layout works
   - [ ] Tablet layout works

5. **Performance:**
   - [ ] No memory leaks
   - [ ] Smooth frame capture
   - [ ] Reasonable inference time

### Manual Testing Commands

```bash
# Start local server
cd hf-vision-demo
python -m http.server 8080

# Open in browser
# Visit http://localhost:8080

# Test on different browsers
# - Chrome (best performance)
# - Firefox (good compatibility)
# - Safari (test webkit)
# - Edge (test chromium)
```

### Browser Console Tests

```javascript
// Test model availability
console.log('Classifier:', classifier);
console.log('CLIP:', clipModel);
console.log('DETR:', detector);

// Test image capture
const testImage = captureImage();
console.log('Captured image:', testImage.substring(0, 50));

// Test inference
runViT().then(() => console.log('ViT inference complete'));
```

## 📦 Deployment Considerations

### Deployment Checklist

- [ ] Test on localhost first
- [ ] Verify CORS headers (vercel.json)
- [ ] Check HTTPS availability (required for camera)
- [ ] Test on target deployment platform
- [ ] Verify model downloads work
- [ ] Check browser compatibility

### Deployment Files

| File | Purpose | Required |
|------|---------|----------|
| index.html | Main application | ✅ Yes |
| vercel.json | Vercel config (CORS) | Vercel only |
| package.json | Project metadata | Optional |
| README.md | Documentation | Optional |

### CORS Configuration

**Critical for Transformers.js to work:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

**Why needed:** Transformers.js uses SharedArrayBuffer which requires these headers.

## 🔧 Debugging Guide

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `SharedArrayBuffer is not defined` | Missing CORS headers | Add proper headers in hosting config |
| `getUserMedia is not a function` | Not HTTPS or localhost | Use HTTPS or localhost |
| `Model loading failed` | Network issue | Check internet, try different CDN |
| `Out of memory` | Too many tabs/models | Close tabs, reload page |
| `Canvas context is null` | Canvas not ready | Wait for DOM load |

### Debug Mode

Add debug logging:

```javascript
// At top of script
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
}

// Use throughout code
debugLog('Starting model initialization');
debugLog('Image captured:', imageData.length, 'bytes');
debugLog('Results received:', results.length, 'items');
```

### Performance Monitoring

```javascript
// Add performance tracking
async function runModelWithTiming(modelFn, modelName) {
  const start = performance.now();

  try {
    await modelFn();
    const duration = performance.now() - start;
    console.log(`${modelName} inference: ${duration.toFixed(2)}ms`);
  } catch (error) {
    console.error(`${modelName} failed:`, error);
  }
}

// Usage
runModelWithTiming(runViT, 'ViT');
```

## 📚 Additional Resources

### Transformers.js Documentation
- [Official Docs](https://huggingface.co/docs/transformers.js)
- [Available Models](https://huggingface.co/models?library=transformers.js)
- [Pipeline API](https://huggingface.co/docs/transformers.js/api/pipelines)

### Browser APIs Used
- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Related Technologies
- [WebAssembly](https://webassembly.org/)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [TensorFlow.js](https://www.tensorflow.org/js)

## ✅ Agent Task Examples

### Example Task 1: "Add a new segmentation model"

**Steps:**
1. Research compatible segmentation model on Hugging Face
2. Add model variable: `let segmentationModel = null;`
3. Initialize in `initializeModels()`: `segmentationModel = await pipeline('image-segmentation', 'model-name');`
4. Create inference function: `async function runSegmentation() { ... }`
5. Add UI button and result display
6. Add event listener
7. Test on localhost
8. Update documentation

### Example Task 2: "Add image upload support"

**Steps:**
1. Add file input: `<input type="file" id="imageUpload" accept="image/*" />`
2. Create upload handler:
```javascript
document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const imageData = await fileToDataURL(file);
  // Use imageData instead of captureImage()
});
```
3. Test with various image formats
4. Update UI to switch between webcam/upload modes

### Example Task 3: "Improve mobile experience"

**Steps:**
1. Review mobile CSS (lines 173-179)
2. Add touch-friendly button sizes
3. Optimize canvas size for mobile
4. Add orientation change handling
5. Test on iOS and Android
6. Add mobile-specific controls

## 🎯 Summary for Agents

**Key Takeaways:**

1. **Single-file application** - All code in `index.html`
2. **No build step** - Direct deployment of HTML file
3. **CDN dependencies** - Transformers.js loaded from CDN
4. **Async operations** - All model operations are async
5. **Browser APIs** - Relies on MediaDevices and Canvas
6. **Static hosting** - Can be deployed anywhere
7. **Privacy-first** - All processing client-side

**Best Practices:**

- Always await async operations
- Check if models are loaded before inference
- Handle errors gracefully
- Test on multiple browsers
- Keep code in single file for simplicity
- Document changes clearly
- Test camera permissions

**When in doubt:**
- Check the browser console for errors
- Review Transformers.js documentation
- Test on localhost before deploying
- Start with small changes
- Keep backups of working code

---

**This guide is maintained for AI agents. Last updated: 2025-01-23**
