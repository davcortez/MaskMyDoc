import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

// Watermark management
export class WatermarkManager {
    static addWatermark(canvas, ctx, enabled = true) {
        if (!enabled) return;

        try {
            ErrorHandler.validateCanvas(canvas);
            
            if (!ctx) {
                throw new Error('Canvas context is required');
            }

            ctx.save();
            
            ctx.globalAlpha = CONFIG.WATERMARK_PRIMARY_ALPHA;
            ctx.fillStyle = CONFIG.WATERMARK_COLOR;
            ctx.font = CONFIG.WATERMARK_PRIMARY_FONT;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const text = CONFIG.WATERMARK_TEXT;
            const spacing = CONFIG.PRIMARY_LAYER_SPACING;
            const rows = Math.ceil(canvas.height / spacing) + CONFIG.PRIMARY_LAYER_EXTRA_ROWS;
            const cols = Math.ceil(canvas.width / spacing) + CONFIG.PRIMARY_LAYER_EXTRA_ROWS;
            
            // First layer
            for (let row = CONFIG.COORDINATE_ORIGIN; row < rows; row++) {
                for (let col = CONFIG.COORDINATE_ORIGIN; col < cols; col++) {
                    try {
                        ctx.save();
                        
                        const x = (col * spacing) - spacing / CONFIG.HALF_DIVISOR + (row % 2) * (spacing / CONFIG.HALF_DIVISOR);
                        const y = (row * spacing) - spacing / CONFIG.HALF_DIVISOR;
                        
                        ctx.translate(x, y);
                        ctx.rotate(-CONFIG.ROTATION_30_DEG);
                        ctx.fillText(text, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
                        
                        ctx.restore();
                    } catch (layerError) {
                        ctx.restore();
                        console.warn('Watermark layer error:', layerError);
                    }
                }
            }
            
            // Second layer
            ctx.save();
            ctx.globalAlpha = CONFIG.WATERMARK_SECONDARY_ALPHA;
            ctx.font = CONFIG.WATERMARK_SECONDARY_FONT;
            
            for (let i = -canvas.width; i < canvas.width + canvas.height; i += CONFIG.SECONDARY_LAYER_SPACING) {
                try {
                    ctx.save();
                    ctx.translate(i, i * CONFIG.SCALING_FACTOR);
                    ctx.rotate(-CONFIG.ROTATION_45_DEG);
                    ctx.fillText(text, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
                    ctx.restore();
                    
                    ctx.save();
                    ctx.translate(i + CONFIG.SECONDARY_LAYER_OFFSET, i * CONFIG.SCALING_FACTOR + CONFIG.SECONDARY_LAYER_OFFSET);
                    ctx.rotate(CONFIG.ROTATION_45_DEG);
                    ctx.fillText(text, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
                    ctx.restore();
                } catch (layerError) {
                    ctx.restore();
                    console.warn('Watermark second layer error:', layerError);
                }
            }
            
            // Third layer
            ctx.save();
            ctx.globalAlpha = CONFIG.WATERMARK_TERTIARY_ALPHA;
            ctx.font = CONFIG.WATERMARK_TERTIARY_FONT;
            
            for (let y = CONFIG.COORDINATE_ORIGIN; y < canvas.height; y += CONFIG.TERTIARY_LAYER_Y_SPACING) {
                for (let x = CONFIG.COORDINATE_ORIGIN; x < canvas.width; x += CONFIG.TERTIARY_LAYER_X_SPACING) {
                    try {
                        ctx.save();
                        ctx.translate(x + (y % 2) * CONFIG.TERTIARY_LAYER_OFFSET, y);
                        ctx.rotate(-CONFIG.ROTATION_22_5_DEG);
                        ctx.fillText(text, CONFIG.COORDINATE_ORIGIN, CONFIG.COORDINATE_ORIGIN);
                        ctx.restore();
                    } catch (layerError) {
                        ctx.restore();
                        console.warn('Watermark third layer error:', layerError);
                    }
                }
            }
            
            ctx.restore();
        } catch (error) {
            ErrorHandler.logError('WatermarkManager.addWatermark', error, CONFIG.ERRORS.WATERMARK_ERROR);
            // Ensure context is restored even on error
            try {
                ctx.restore();
            } catch (restoreError) {
                console.warn('Failed to restore context after watermark error:', restoreError);
            }
        }
    }
} 