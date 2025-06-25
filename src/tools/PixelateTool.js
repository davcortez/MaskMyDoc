import { ObfuscationTool } from './ObfuscationTool.js';

// Pixelate tool - proper implementation with color averaging
export class PixelateTool extends ObfuscationTool {
    constructor() {
        super('pixelate');
    }

    apply(ctx, centerX, centerY, radius) {
        const pixelSize = 8; // Size of each pixelated block
        
        // Calculate bounds
        const startX = Math.max(0, centerX - radius);
        const endX = Math.min(ctx.canvas.width, centerX + radius);
        const startY = Math.max(0, centerY - radius);
        const endY = Math.min(ctx.canvas.height, centerY + radius);
        
        // Process each pixelated block
        for (let blockY = Math.floor(startY / pixelSize) * pixelSize; blockY < endY; blockY += pixelSize) {
            for (let blockX = Math.floor(startX / pixelSize) * pixelSize; blockX < endX; blockX += pixelSize) {
                // Check if this block intersects with the circular brush area
                const blockCenterX = blockX + pixelSize / 2;
                const blockCenterY = blockY + pixelSize / 2;
                const distanceFromBrushCenter = Math.sqrt(
                    (blockCenterX - centerX) ** 2 + (blockCenterY - centerY) ** 2
                );
                
                // Only pixelate blocks that are within the brush radius
                if (distanceFromBrushCenter <= radius) {
                    // Calculate the actual block dimensions (handle edge cases)
                    const actualBlockWidth = Math.min(pixelSize, ctx.canvas.width - blockX);
                    const actualBlockHeight = Math.min(pixelSize, ctx.canvas.height - blockY);
                    
                    if (actualBlockWidth > 0 && actualBlockHeight > 0) {
                        try {
                            // Get the image data for this block
                            const blockImageData = ctx.getImageData(blockX, blockY, actualBlockWidth, actualBlockHeight);
                            const pixels = blockImageData.data;
                            
                            // Calculate average color of the block
                            let totalRed = 0, totalGreen = 0, totalBlue = 0, pixelCount = 0;
                            
                            for (let i = 0; i < pixels.length; i += 4) {
                                totalRed += pixels[i];
                                totalGreen += pixels[i + 1];
                                totalBlue += pixels[i + 2];
                                pixelCount++;
                            }
                            
                            if (pixelCount > 0) {
                                const avgRed = Math.round(totalRed / pixelCount);
                                const avgGreen = Math.round(totalGreen / pixelCount);
                                const avgBlue = Math.round(totalBlue / pixelCount);
                                
                                // Fill the entire block with the average color
                                ctx.fillStyle = `rgb(${avgRed}, ${avgGreen}, ${avgBlue})`;
                                ctx.fillRect(blockX, blockY, actualBlockWidth, actualBlockHeight);
                            }
                        } catch (error) {
                            console.error('PixelateTool: Error processing block at', blockX, blockY, error);
                        }
                    }
                }
            }
        }
    }
} 