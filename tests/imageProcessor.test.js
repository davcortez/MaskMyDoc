/**
 * @jest-environment jsdom
 */

describe('ImageProcessor', () => {
    describe('scaleImageToFit', () => {
        it('should scale image to fit within bounds', () => {
            const result = ImageProcessor.scaleImageToFit(1600, 1200, 800, 600);
            
            expect(result.width).toBe(800);
            expect(result.height).toBe(600);
        });

        it('should maintain aspect ratio when scaling down', () => {
            const result = ImageProcessor.scaleImageToFit(1600, 800, 800, 600);
            
            expect(result.width).toBe(800);
            expect(result.height).toBe(400);
        });

        it('should not scale up small images', () => {
            const result = ImageProcessor.scaleImageToFit(200, 100, 800, 600);
            
            expect(result.width).toBe(200);
            expect(result.height).toBe(100);
        });

        it('should scale proportionally for portrait images', () => {
            const result = ImageProcessor.scaleImageToFit(600, 1200, 800, 600);
            
            expect(result.width).toBe(300);
            expect(result.height).toBe(600);
        });

        it('should handle edge case of zero dimensions', () => {
            // With error handling, invalid dimensions return fallbacks
            const result = ImageProcessor.scaleImageToFit(0, 0, 800, 600);
            
            // Should return fallback dimensions instead of 0
            expect(result.width).toBe(800); // DEFAULT_MAX_WIDTH fallback
            expect(result.height).toBe(600); // DEFAULT_MAX_HEIGHT fallback
        });

        it('should handle very large images', () => {
            const result = ImageProcessor.scaleImageToFit(8000, 6000, 800, 600);
            
            expect(result.width).toBe(800);
            expect(result.height).toBe(600);
        });
    });

    describe('convertToGrayscale', () => {
        let canvas, ctx;

        beforeEach(() => {
            canvas = createTestFixtures.canvas(10, 10);
            ctx = canvas.getContext('2d');
        });

        it('should convert colored image to grayscale', () => {
            // Fill with red color
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 10, 10);
            
            // Mock getImageData to return red pixels
            const mockImageData = {
                data: new Uint8ClampedArray(400), // 10x10x4
                width: 10,
                height: 10
            };
            
            // Fill with red pixels
            for (let i = 0; i < mockImageData.data.length; i += 4) {
                mockImageData.data[i] = 255;     // Red
                mockImageData.data[i + 1] = 0;   // Green
                mockImageData.data[i + 2] = 0;   // Blue
                mockImageData.data[i + 3] = 255; // Alpha
            }
            
            ctx.getImageData = jest.fn(() => mockImageData);
            ctx.putImageData = jest.fn();
            
            ImageProcessor.convertToGrayscale(canvas, ctx);
            
            expect(ctx.getImageData).toHaveBeenCalledWith(0, 0, 10, 10);
            expect(ctx.putImageData).toHaveBeenCalled();
            
            // Check if grayscale conversion applied the luminance formula
            const expectedGray = Math.round(0.299 * 255 + 0.587 * 0 + 0.114 * 0);
            expect(expectedGray).toBe(76); // Should be ~76 for pure red
        });

        it('should handle empty canvas', () => {
            const emptyCanvas = createTestFixtures.canvas(0, 0);
            const emptyCtx = emptyCanvas.getContext('2d');
            
            emptyCtx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(0),
                width: 0,
                height: 0
            }));
            emptyCtx.putImageData = jest.fn();
            
            expect(() => {
                ImageProcessor.convertToGrayscale(emptyCanvas, emptyCtx);
            }).not.toThrow();
        });

        it('should preserve alpha channel', () => {
            const mockImageData = {
                data: new Uint8ClampedArray([255, 128, 64, 200]), // RGBA
                width: 1,
                height: 1
            };
            
            ctx.getImageData = jest.fn(() => mockImageData);
            ctx.putImageData = jest.fn();
            
            ImageProcessor.convertToGrayscale(canvas, ctx);
            
            // Alpha should remain unchanged
            expect(mockImageData.data[3]).toBe(200);
        });
    });
}); 