import { ObfuscationTool } from './ObfuscationTool.js';

// Pixelate tool - quick implementation
export class PixelateTool extends ObfuscationTool {
    constructor() {
        super('pixelate');
    }

    apply(ctx, centerX, centerY, radius) {
        const pixelSize = 8; // hardcoded
        
        // Simple bounds
        const startX = Math.max(0, centerX - radius);
        const endX = Math.min(ctx.canvas.width, centerX + radius);
        const startY = Math.max(0, centerY - radius);
        const endY = Math.min(ctx.canvas.height, centerY + radius);
        
        for (let y = startY; y < endY; y += pixelSize) {
            for (let x = startX; x < endX; x += pixelSize) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distance <= radius) {
                    // Get pixel color and fill block
                    const imageData = ctx.getImageData(x, y, 1, 1);
                    const pixel = imageData.data;
                    
                    ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }
    }
} 