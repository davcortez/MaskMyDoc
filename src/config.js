// Application Constants
export const CONFIG = Object.freeze({
    // Canvas and Image Processing
    DEFAULT_MAX_WIDTH: 800,
    DEFAULT_MAX_HEIGHT: 600,
    
    // Color processing constants (ITU-R BT.709 standard)
    GRAYSCALE_RED_WEIGHT: 0.299,
    GRAYSCALE_GREEN_WEIGHT: 0.587,
    GRAYSCALE_BLUE_WEIGHT: 0.114,
    
    // RGBA channel indices and values
    RGBA_CHANNELS: 4,
    RED_CHANNEL: 0,
    GREEN_CHANNEL: 1,
    BLUE_CHANNEL: 2,
    ALPHA_CHANNEL: 3,
    FULL_ALPHA: 255,
    
    // Tool settings
    PIXELATE_SIZE: 8,
    DEFAULT_PIXEL_SIZE: 1,
    DEFAULT_BRUSH_SIZE: 30,
    
    // Watermark settings
    WATERMARK_TEXT: 'DATOSECUATORIANOS',
    WATERMARK_PRIMARY_ALPHA: 0.3,
    WATERMARK_SECONDARY_ALPHA: 0.25,
    WATERMARK_TERTIARY_ALPHA: 0.2,
    WATERMARK_PRIMARY_FONT: 'bold 12px Arial',
    WATERMARK_SECONDARY_FONT: 'bold 10px Arial',
    WATERMARK_TERTIARY_FONT: 'bold 8px Arial',
    WATERMARK_COLOR: '#ff0000',
    
    // Watermark layer spacing
    PRIMARY_LAYER_SPACING: 80,
    PRIMARY_LAYER_EXTRA_ROWS: 3,
    SECONDARY_LAYER_SPACING: 70,
    SECONDARY_LAYER_OFFSET: 35,
    TERTIARY_LAYER_Y_SPACING: 60,
    TERTIARY_LAYER_X_SPACING: 90,
    TERTIARY_LAYER_OFFSET: 45,
    
    // Rotation angles (in radians)
    ROTATION_30_DEG: Math.PI / 6,
    ROTATION_45_DEG: Math.PI / 4,
    ROTATION_22_5_DEG: Math.PI / 8,
    
    // Drawing and coordinate constants
    COORDINATE_ORIGIN: 0,
    HALF_DIVISOR: 2,
    SCALING_FACTOR: 0.5,
    
    // Touch event indices
    FIRST_TOUCH: 0,
    
    // File upload constraints
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MIN_FILE_SIZE: 100, // 100 bytes minimum
    MAX_IMAGE_WIDTH: 8000,
    MAX_IMAGE_HEIGHT: 8000,
    MIN_IMAGE_WIDTH: 10,
    MIN_IMAGE_HEIGHT: 10,
    ACCEPTED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    
    // File signature validation (magic numbers)
    FILE_SIGNATURES: {
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
        'image/gif': [0x47, 0x49, 0x46] // GIF
    },
    
    // Error messages
    ERRORS: {
        FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 50MB.',
        FILE_TOO_SMALL: 'El archivo es demasiado pequeño. Mínimo 100 bytes.',
        INVALID_FILE_TYPE: 'Tipo de archivo no válido. Use JPG, PNG, WebP o GIF.',
        INVALID_FILE_SIGNATURE: 'El archivo no es una imagen válida o está corrupto.',
        FILE_READ_ERROR: 'Error al leer el archivo.',
        IMAGE_LOAD_ERROR: 'Error al cargar la imagen.',
        IMAGE_TOO_LARGE: 'La imagen es demasiado grande. Máximo 8000x8000 píxeles.',
        IMAGE_TOO_SMALL: 'La imagen es demasiado pequeña. Mínimo 10x10 píxeles.',
        CANVAS_ERROR: 'Error al procesar la imagen en canvas.',
        DOWNLOAD_ERROR: 'Error al descargar la imagen.',
        PROCESSING_ERROR: 'Error al procesar la imagen.',
        NO_FILE_SELECTED: 'No se ha seleccionado ningún archivo.',
        BROWSER_NOT_SUPPORTED: 'Su navegador no soporta esta funcionalidad.',
        WATERMARK_ERROR: 'Error al aplicar marca de agua.',
        TOOL_APPLICATION_ERROR: 'Error al aplicar herramienta de obfuscación.',
        INVALID_FILE_NAME: 'Nombre de archivo no válido o contiene caracteres no permitidos.',
        NETWORK_ERROR: 'Error de red al procesar el archivo.'
    }
}); 