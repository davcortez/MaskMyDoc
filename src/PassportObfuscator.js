import { CONFIG } from './config.js';
import * as CanvasManager from './canvas/CanvasManager.js';
import { ObfuscationToolFactory } from './tools/ObfuscationToolFactory.js';
import { WatermarkManager } from './managers/WatermarkManager.js';
import { FileManager } from './managers/FileManager.js';
import { UIController } from './controllers/UIController.js';

// Main class that handles ID documents obfuscation
// TODO: Refactor magic numbers smells
export class PassportObfuscator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        if (!this.canvas) throw new Error('Canvas not found');
        
        CanvasManager.initCanvas(this.canvas);
        this.originalImage = null;
        this.isDrawing = false;
        this.brushSize = 30; // hardcoded for now
        this.obfuscatedAreas = [];
        
        // TODO: move this to a separate method
        this.uiController = new UIController(this);
    }

    handleImageUpload(event) {
        console.log('PassportObfuscator: handleImageUpload called', event);
        
        const file = event.target.files[0];
        if (!file) return; // exit
        
        console.log('PassportObfuscator: File from event:', file);
        
        FileManager.handleImageUpload(
            file,
            (img) => {
                console.log('PassportObfuscator: Image loaded successfully', img.width, 'x', img.height);
                
                this.originalImage = img;
                CanvasManager.setupCanvas(img);
                this.drawImage();
                
                // Show canvas section
                const canvasSection = document.getElementById('canvasSection');
                canvasSection.style.display = 'block';
                console.log('PassportObfuscator: Canvas section made visible');
                
                this.obfuscatedAreas = [];
            },
            (error) => {
                console.error('PassportObfuscator: Image upload error:', error);
                console.log('Error loading image: ' + error); // quick fix
            }
        );
    }

    drawImage() {
        console.log('PassportObfuscator: drawImage called');
        CanvasManager.redrawOriginalImage();
        this.addWatermark();
        console.log('PassportObfuscator: Watermark added');
    }

    addWatermark() {
        const watermarkCheckbox = document.getElementById('addWatermark');
        const watermarkEnabled = watermarkCheckbox ? watermarkCheckbox.checked : false;
        
        const ctx = CanvasManager.getContext();
        if (ctx) {
            WatermarkManager.addWatermark(this.canvas, ctx, watermarkEnabled);
        }
    }

    startDrawing(event) {
        if (!event) return;
        
        this.isDrawing = true;
        const coords = CanvasManager.getCanvasCoordinates(event);
        this.applyObfuscation(coords.x, coords.y);
    }

    draw(event) {
        if (!this.isDrawing || !event) return;
        
        const coords = CanvasManager.getCanvasCoordinates(event);
        this.applyObfuscation(coords.x, coords.y);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    applyObfuscation(x, y) {
        const toolSelect = document.getElementById('obfuscationTool');
        const toolType = toolSelect ? toolSelect.value : 'blackout';
        
        const tool = ObfuscationToolFactory.createTool(toolType);
        const radius = this.brushSize;
        
        this.obfuscatedAreas.push({ x, y, radius, tool: toolType });
        
        const ctx = CanvasManager.getContext();
        if (ctx) {
            tool.apply(ctx, x, y, radius);
            this.addWatermark();
        }
    }

    clearObfuscation() {
        if (!CanvasManager.getImageData()) {
            console.warn('No original image data to restore');
            return;
        }
        
        this.obfuscatedAreas = [];
        this.drawImage();
    }

    // FIXME: complex lgic here
    redrawCanvas() {
        if (!CanvasManager.getImageData()) {
            console.warn('No original image data available for redraw');
            return;
        }
        
        CanvasManager.redrawOriginalImage();
        
        // Redraw all obfuscated areas
        // Look for a better approach
        this.obfuscatedAreas.forEach(area => {
            const tool = ObfuscationToolFactory.createTool(area.tool);
            const ctx = CanvasManager.getContext();
            if (ctx) {
                tool.apply(ctx, area.x, area.y, area.radius);
            }
        });
        
        this.addWatermark();
    }

    downloadImage() {
        if (!this.canvas) {
            alert('No canvas available');
            return;
        }

        FileManager.downloadImage(this.canvas);
    }
} 