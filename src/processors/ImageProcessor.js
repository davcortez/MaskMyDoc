import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

// Class to handle process image operations like convert to gray scale
// and scale image to fit
export class ImageProcessor {
    static convertToGrayscale(canvas, ctx) {
        try {
            ErrorHandler.validateCanvas(canvas);
            
            if (!ctx) {
                throw new Error('Canvas context not available');
            }

            const imageData = ctx.getImageData(CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN, canvas.width, canvas.height);
            ErrorHandler.validateImageData(imageData);
            
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += CONFIG.RGBA_CHANNELS) {
                const gray = Math.round(
                    CONFIG.GRAYSCALE_RED_WEIGHT * data[i + CONFIG.RED_CHANNEL] + 
                    CONFIG.GRAYSCALE_GREEN_WEIGHT * data[i + CONFIG.GREEN_CHANNEL] + 
                    CONFIG.GRAYSCALE_BLUE_WEIGHT * data[i + CONFIG.BLUE_CHANNEL]
                );
                data[i + CONFIG.RED_CHANNEL] = gray;
                data[i + CONFIG.GREEN_CHANNEL] = gray;
                data[i + CONFIG.BLUE_CHANNEL] = gray;
            }
            
            ctx.putImageData(imageData, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
        } catch (error) {
            ErrorHandler.logError('ImageProcessor.convertToGrayscale', error, CONFIG.ERRORS.PROCESSING_ERROR);
            throw error;
        }
    }

    static scaleImageToFit(originalWidth, originalHeight, maxWidth = CONFIG.DEFAULT_MAX_WIDTH, maxHeight = CONFIG.DEFAULT_MAX_HEIGHT) {
        try {
            if (!Number.isFinite(originalWidth) || !Number.isFinite(originalHeight) || 
                originalWidth <= 0 || originalHeight <= 0) {
                throw new Error('Invalid image dimensions for scaling');
            }

            if (!Number.isFinite(maxWidth) || !Number.isFinite(maxHeight) || 
                maxWidth <= 0 || maxHeight <= 0) {
                throw new Error('Invalid maximum dimensions for scaling');
            }

            let { width, height } = { width: originalWidth, height: originalHeight };
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            return { width: Math.round(width), height: Math.round(height) };
        } catch (error) {
            ErrorHandler.logError('ImageProcessor.scaleImageToFit', error, CONFIG.ERRORS.PROCESSING_ERROR);
            // Return original dimensions as fallback
            return { width: originalWidth || CONFIG.DEFAULT_MAX_WIDTH, height: originalHeight || CONFIG.DEFAULT_MAX_HEIGHT };
        }
    }
} 