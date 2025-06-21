import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ObfuscationTool } from './ObfuscationTool.js';

export class BlackoutTool extends ObfuscationTool {
    constructor() {
        super('blackout');
    }

    apply(ctx, centerX, centerY, radius) {
        try {
            this.validateInput(ctx, centerX, centerY, radius);
            
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, CONFIG.COORDINATE_ORIGIN, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } catch (error) {
            ErrorHandler.logError('BlackoutTool.apply', error, CONFIG.ERRORS.TOOL_APPLICATION_ERROR);
            // Ensure context is restored even on error
            try {
                ctx.restore();
            } catch (restoreError) {
                console.warn('Failed to restore context:', restoreError);
            }
            throw error;
        }
    }
} 