import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

// Enhanced File operations management
export class FileManager {
    static async handleImageUpload(file, onSuccess, onError) {
        try {
            // Show loading state
            ErrorHandler.updateFileInputState('loading', 'Validando archivo...');
            
            // Comprehensive file validation
            await ErrorHandler.validateFile(file);
            
            ErrorHandler.updateFileInputState('loading', 'Cargando imagen...');

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    if (!e.target || !e.target.result) {
                        throw new Error('File reading failed - no result');
                    }

                    const img = new Image();
                    
                    img.onload = () => {
                        try {
                            // Validate image dimensions
                            ErrorHandler.validateImageDimensions(img);
                            
                            ErrorHandler.showUserSuccess(
                                `Imagen cargada: ${img.width}x${img.height} píxeles`
                            );
                            
                            onSuccess(img);
                        } catch (loadError) {
                            ErrorHandler.logError('FileManager.imageOnLoad', loadError);
                            onError(loadError.message);
                        }
                    };
                    
                    img.onerror = () => {
                        const error = new Error('Image failed to load');
                        ErrorHandler.logError('FileManager.imageOnError', error);
                        onError(CONFIG.ERRORS.IMAGE_LOAD_ERROR);
                    };
                    
                    img.src = e.target.result;
                } catch (imgError) {
                    ErrorHandler.logError('FileManager.readerOnLoad', imgError);
                    onError(CONFIG.ERRORS.IMAGE_LOAD_ERROR);
                }
            };
            
            reader.onerror = () => {
                const error = new Error('FileReader error occurred');
                ErrorHandler.logError('FileManager.readerOnError', error);
                onError(CONFIG.ERRORS.FILE_READ_ERROR);
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            ErrorHandler.logError('FileManager.handleImageUpload', error);
            onError(error.message);
        }
    }

    static downloadImage(canvas, filename = `passport_obfuscated_${Date.now()}.png`) {
        try {
            ErrorHandler.validateCanvas(canvas);

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            if (!tempCtx) {
                throw new Error('Failed to create temporary canvas context');
            }
            
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCtx.drawImage(canvas, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
            
            const dataURL = tempCanvas.toDataURL('image/png');
            
            if (!dataURL || dataURL === 'data:,') {
                throw new Error('Failed to generate image data URL');
            }
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataURL;
            
            // Verify link creation
            if (!link.href) {
                throw new Error('Failed to create download link');
            }
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            ErrorHandler.logError('FileManager.downloadImage', error, CONFIG.ERRORS.DOWNLOAD_ERROR);
            throw error;
        }
    }
}