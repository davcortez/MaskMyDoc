import { CONFIG } from '../config.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { PixelateTool } from './PixelateTool.js';
import { BlackoutTool } from './BlackoutTool.js';

// Factory for creating obfuscation tools
export class ObfuscationToolFactory {
    static createTool(toolType) {
        try {
            if (!toolType || typeof toolType !== 'string') {
                throw new Error('Tool type must be a non-empty string');
            }

            switch (toolType.toLowerCase()) {
                case 'pixelate':
                    return new PixelateTool();
                case 'blackout':
                    return new BlackoutTool();
                default:
                    throw new Error(`Unknown tool type: ${toolType}`);
            }
        } catch (error) {
            ErrorHandler.logError('ObfuscationToolFactory.createTool', error, CONFIG.ERRORS.TOOL_APPLICATION_ERROR);
            // Return default tool as fallback
            return new BlackoutTool();
        }
    }
} 