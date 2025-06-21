import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ImageProcessor } from '../processors/ImageProcessor.js';

// Canvas stuff
let canvas, ctx, originalImageData;

export function initCanvas(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
}

export function setupCanvas(image) {
    console.log('CanvasManager: setupCanvas called with image:', image.width, 'x', image.height);
    
    if (!image?.width || !image?.height) {
        throw new Error('Invalid image');
    }

    // Quick scaling calculation
    let width = image.width;
    let height = image.height;
    const maxW = 800, maxH = 600;
    
    if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width *= ratio;
        height *= ratio;
    }
    
    console.log('CanvasManager: Scaled dimensions:', Math.round(width), 'x', Math.round(height));
    
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    console.log('CanvasManager: Canvas dimensions set to:', canvas.width, 'x', canvas.height);
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    console.log('CanvasManager: Image drawn to canvas');
    
    // Convert to grayscale - inline approach
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = data[i + 1] = data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    console.log('CanvasManager: Image converted to grayscale');
    
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('CanvasManager: Original image data stored');
}

export function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Clamp to bounds
    return {
        x: Math.max(0, Math.min(x, canvas.width)),
        y: Math.max(0, Math.min(y, canvas.height))
    };
}

export function redrawOriginalImage() {
    if (!originalImageData) {
        console.warn('No original image data');
        return;
    }
    ctx.putImageData(originalImageData, 0, 0);
}

export function getContext() {
    return ctx;
}

export function getImageData() {
    return ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
}

// Old class-based approach (keeping for reference)
/*
export class CanvasManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.originalImageData = null;
    }
    // ... rest of methods
}
*/ 