import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

// UI event management with enhanced validation
export class UIController {
    constructor(passportObfuscator) {
        if (!passportObfuscator) throw new Error('Need app instance');
        
        this.app = passportObfuscator;
        this.setupEvents();
        this.setupFileInput();
    }

    setupFileInput() {
        const imageInput = document.getElementById('imageInput');
        console.log('UIController: Setting up file input validation, element found:', !!imageInput);
        
        if (!imageInput) {
            console.error('UIController: imageInput element not found!');
            return;
        }

        // File selection handler
        imageInput.addEventListener('change', (e) => {
            console.log('UIController: File input change event triggered', e);
            this.handleFileChange(e);
        });

        // TODO: add drag and drop support
        // imageInput.addEventListener('dragover', this.handleDragOver);
        // imageInput.addEventListener('drop', this.handleDrop);
    }

    handleFileChange(event) {
        console.log('UIController: handleFileChange called', event);
        const file = event.target.files[0];
        console.log('UIController: File selected:', file);
        
        if (!file) {
            this.updateFileStatus('default', 'Formatos aceptados: JPG, PNG, WebP, GIF (máximo 50MB)');
            return;
        }

        // Basic validation - quick and dirty
        if (file.size > 50 * 1024 * 1024) {
            alert('File too big!');
            return;
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type');
            return;
        }

        console.log('UIController: File validation passed, calling handleImageUpload');
        this.app.handleImageUpload(event);
    }

    updateFileStatus(state, message) {
        const fileInfo = document.querySelector('.file-info small');
        if (fileInfo) {
            fileInfo.textContent = message;
            fileInfo.className = `file-status ${state}`;
        }
    }

    // Different approach for event setup
    setupEvents() {
        const canvas = this.app.canvas;
        if (!canvas) return;

        // Mouse events - arrow functions
        canvas.addEventListener('mousedown', (e) => this.app.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.app.draw(e));
        canvas.addEventListener('mouseup', () => this.app.stopDrawing());
        canvas.addEventListener('mouseout', () => this.app.stopDrawing());

        // Touch events - different style
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
                this.app.startDrawing(e.touches[0]);
            }
        }.bind(this));

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
                this.app.draw(e.touches[0]);
            }
        }.bind(this));

        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.app.stopDrawing();
        }.bind(this));

        // Button handlers - mixed approaches
        const clearBtn = document.getElementById('clearObfuscation');
        if (clearBtn) {
            clearBtn.onclick = () => this.app.clearObfuscation();
        }

        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn && downloadBtn.addEventListener('click', () => {
            this.app.downloadImage();
        });

        // Watermark checkbox
        const watermarkBox = document.getElementById('addWatermark');
        if (watermarkBox) {
            watermarkBox.addEventListener('change', () => this.app.redrawCanvas());
        }
    }

    // HACK: experimental drag and drop (not implemented yet)
    /*
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // TODO: validate dropped file
            this.app.handleImageUpload({ target: { files: [files[0]] } });
        }
    }
    */
} 
