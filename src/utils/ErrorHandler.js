import { CONFIG } from '../config.js';

// Enhanced error handling utility class
// TODO: Look for a better way to display error messages to the user
export class ErrorHandler {
    static logError(context, error, userMessage = null) {
        console.error(`[${context}] Error:`, error);
        
        if (userMessage) {
            this.showUserError(userMessage);
        }
    }

    static showUserError(message) {
        // Show user-friendly error message
        alert(message);
        console.warn('User Error:', message);
        
        // Update UI to show error state
        this.updateFileInputState('error', message);
    }

    static showUserSuccess(message) {
        console.info('Success:', message);
        this.updateFileInputState('success', message);
    }

    static updateFileInputState(state, message) {
        const fileInfo = document.querySelector('.file-info small');
        if (fileInfo) {
            fileInfo.textContent = message;
            fileInfo.className = `file-status ${state}`;
        }
    }

    static async validateFile(file) {
        if (!file) {
            throw new Error(CONFIG.ERRORS.NO_FILE_SELECTED);
        }

        // Basic file properties validation
        this.validateFileProperties(file);
        
        // File signature validation (magic numbers)
        await this.validateFileSignature(file);
        
        return true;
    }

    static validateFileProperties(file) {
        // File size validation
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            throw new Error(CONFIG.ERRORS.FILE_TOO_LARGE);
        }
        
        if (file.size < CONFIG.MIN_FILE_SIZE) {
            throw new Error(CONFIG.ERRORS.FILE_TOO_SMALL);
        }

        // MIME type validation
        if (!CONFIG.ACCEPTED_MIME_TYPES.includes(file.type)) {
            throw new Error(CONFIG.ERRORS.INVALID_FILE_TYPE);
        }

        // File extension validation
        const fileName = file.name.toLowerCase();
        const hasValidExtension = CONFIG.ACCEPTED_EXTENSIONS.some(ext => 
            fileName.endsWith(ext)
        );
        
        if (!hasValidExtension) {
            throw new Error(CONFIG.ERRORS.INVALID_FILE_TYPE);
        }

        // File name validation (basic security check)
        if (this.containsSuspiciousCharacters(file.name)) {
            throw new Error(CONFIG.ERRORS.INVALID_FILE_NAME);
        }
    }

    static async validateFileSignature(file) {
        try {
            const arrayBuffer = await this.readFileHeader(file, 12); // Read first 12 bytes
            const bytes = new Uint8Array(arrayBuffer);
            
            const expectedSignature = CONFIG.FILE_SIGNATURES[file.type];
            if (!expectedSignature) {
                throw new Error(CONFIG.ERRORS.INVALID_FILE_TYPE);
            }

            // Check file signature
            const isValidSignature = expectedSignature.every((byte, index) => 
                bytes[index] === byte
            );

            if (!isValidSignature) {
                // Special case for WebP - check for WEBP in bytes 8-11
                if (file.type === 'image/webp') {
                    const webpSignature = [0x57, 0x45, 0x42, 0x50]; // "WEBP"
                    const isWebP = webpSignature.every((byte, index) => 
                        bytes[8 + index] === byte
                    );
                    if (!isWebP) {
                        throw new Error(CONFIG.ERRORS.INVALID_FILE_SIGNATURE);
                    }
                } else {
                    throw new Error(CONFIG.ERRORS.INVALID_FILE_SIGNATURE);
                }
            }
        } catch (error) {
            if (error.message.includes('signature') || error.message.includes('corrupto')) {
                throw error;
            }
            throw new Error(CONFIG.ERRORS.FILE_READ_ERROR);
        }
    }

    static readFileHeader(file, bytes) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const blob = file.slice(0, bytes);
            
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file header'));
            
            reader.readAsArrayBuffer(blob);
        });
    }

    static containsSuspiciousCharacters(filename) {
        // Check for potentially dangerous characters
        const suspiciousChars = /[<>:"|?*\x00-\x1f]/;
        const suspiciousPatterns = /\.(exe|bat|cmd|scr|vbs|js|jar|com|pif)$/i;
        
        return suspiciousChars.test(filename) || suspiciousPatterns.test(filename);
    }

    static validateImageDimensions(image) {
        if (!image || !image.width || !image.height) {
            throw new Error('Invalid image dimensions');
        }

        if (image.width > CONFIG.MAX_IMAGE_WIDTH || image.height > CONFIG.MAX_IMAGE_HEIGHT) {
            throw new Error(CONFIG.ERRORS.IMAGE_TOO_LARGE);
        }

        if (image.width < CONFIG.MIN_IMAGE_WIDTH || image.height < CONFIG.MIN_IMAGE_HEIGHT) {
            throw new Error(CONFIG.ERRORS.IMAGE_TOO_SMALL);
        }

        return true;
    }

    static validateCanvas(canvas) {
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        if (!canvas.getContext) {
            throw new Error(CONFIG.ERRORS.BROWSER_NOT_SUPPORTED);
        }

        return true;
    }

    static validateImageData(imageData) {
        if (!imageData || !imageData.data) {
            throw new Error('Invalid image data');
        }

        if (imageData.width <= 0 || imageData.height <= 0) {
            throw new Error('Invalid image dimensions');
        }

        return true;
    }

    static safeOperation(operation, context, fallback = null) {
        try {
            return operation();
        } catch (error) {
            this.logError(context, error);
            return fallback;
        }
    }

    static async safeAsyncOperation(operation, context, fallback = null) {
        try {
            return await operation();
        } catch (error) {
            this.logError(context, error);
            return fallback;
        }
    }
} 