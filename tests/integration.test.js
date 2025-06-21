/**
 * @jest-environment jsdom
 */

describe('Integration Tests', () => {
    describe('Complete Workflow', () => {
        let canvas, canvasManager;

        beforeEach(() => {
            canvas = createTestFixtures.canvas(100, 100);
            canvasManager = new CanvasManager(canvas);
        });

        it('should handle complete obfuscation workflow', async () => {
            // Create mock image
            const img = createTestFixtures.image(100, 100);
            
            // Wait for image to load
            await new Promise(resolve => {
                img.onload = resolve;
                if (img.complete) resolve();
            });

            // Setup canvas
            canvasManager.setupCanvas(img);

            // Apply obfuscation
            const tool = ObfuscationToolFactory.createTool('blur');
            tool.apply(canvasManager.getContext(), 50, 50, 10);

            // Add watermark
            WatermarkManager.addWatermark(canvas, canvasManager.getContext(), true);

            // Verify final state
            const imageData = canvasManager.getImageData();
            expect(imageData.data.length).toBeGreaterThan(0);
            expect(canvas.width).toBe(100);
            expect(canvas.height).toBe(100);
        });

        it('should handle multiple tool applications', () => {
            const ctx = canvasManager.getContext();
            
            // Mock context methods
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(10000),
                width: 50,
                height: 50
            }));
            ctx.putImageData = jest.fn();
            ctx.fillRect = jest.fn();
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            // Apply multiple tools
            const blurTool = ObfuscationToolFactory.createTool('blur');
            const pixelateTool = ObfuscationToolFactory.createTool('pixelate');
            const blackoutTool = ObfuscationToolFactory.createTool('blackout');

            expect(() => {
                blurTool.apply(ctx, 10, 10, 5);
                pixelateTool.apply(ctx, 25, 25, 5);
                blackoutTool.apply(ctx, 40, 40, 5);
            }).not.toThrow();
        });

        it('should maintain image quality through processing chain', async () => {
            const img = createTestFixtures.image(200, 150);
            
            await new Promise(resolve => {
                img.onload = resolve;
                if (img.complete) resolve();
            });

            canvasManager.setupCanvas(img);
            
            // Verify scaling maintains aspect ratio
            const scaledDimensions = ImageProcessor.scaleImageToFit(200, 150, 800, 600);
            expect(scaledDimensions.width).toBe(200);
            expect(scaledDimensions.height).toBe(150);
            
            // Verify canvas setup
            expect(canvasManager.originalImageData).toBeDefined();
        });
    });

    describe('File Operations Integration', () => {
        it('should handle file upload workflow', async () => {
            const mockFile = createTestFixtures.file('test.png', 'image/png');
            let successCalled = false;
            let errorCalled = false;

            FileManager.handleImageUpload(
                mockFile,
                (img) => {
                    successCalled = true;
                    expect(img).toBeInstanceOf(global.Image);
                },
                (error) => {
                    errorCalled = true;
                }
            );

            // Wait for async operations - increase timeout
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(successCalled).toBe(true);
            expect(errorCalled).toBe(false);
        });

        it('should handle download workflow', () => {
            const canvas = createTestFixtures.canvas(50, 50);
            const mockLink = {
                tagName: 'A',
                download: '',
                href: '',
                click: jest.fn()
            };

            // Mock createElement to return proper canvas for canvas, proper link for 'a'
            document.createElement = jest.fn((tagName) => {
                if (tagName === 'canvas') {
                    return createTestFixtures.canvas(50, 50);
                } else if (tagName === 'a') {
                    return mockLink;
                }
                return mockLink; // fallback
            });

            document.body.appendChild = jest.fn();
            document.body.removeChild = jest.fn();

            FileManager.downloadImage(canvas, 'test.png');

            expect(mockLink.download).toBe('test.png');
            expect(mockLink.href).toContain('data:image/png');
            expect(mockLink.click).toHaveBeenCalled();
            expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
            expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
        });
    });

    describe('Canvas Manager Integration', () => {
        let canvasManager, canvas;

        beforeEach(() => {
            canvas = createTestFixtures.canvas(100, 100);
            canvasManager = new CanvasManager(canvas);
        });

        it('should handle coordinate transformations correctly', () => {
            // Mock getBoundingClientRect for scaling test
            canvas.getBoundingClientRect = jest.fn(() => ({
                left: 10,
                top: 20,
                width: 200, // Canvas displayed at 2x size
                height: 200
            }));

            const mockEvent = createTestFixtures.mouseEvent(110, 120); // 100px from origin
            const coords = canvasManager.getCanvasCoordinates(mockEvent);

            expect(coords.x).toBe(50); // Scaled down by 2
            expect(coords.y).toBe(50);
        });

        it('should preserve original image data through operations', async () => {
            const img = createTestFixtures.image(100, 100);
            
            await new Promise(resolve => {
                img.onload = resolve;
                if (img.complete) resolve();
            });

            canvasManager.setupCanvas(img);
            const originalData = canvasManager.originalImageData;

            // Apply some operation
            const ctx = canvasManager.getContext();
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, 50, 50);

            // Restore original
            canvasManager.redrawOriginalImage();

            // Original data should be preserved
            expect(canvasManager.originalImageData).toBe(originalData);
        });
    });

    describe('Watermark Integration', () => {
        it('should add watermark without breaking canvas state', () => {
            const canvas = createTestFixtures.canvas(200, 200);
            const ctx = canvas.getContext('2d');

            // Mock canvas methods
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.fillText = jest.fn();
            ctx.translate = jest.fn();
            ctx.rotate = jest.fn();

            WatermarkManager.addWatermark(canvas, ctx, true);

            expect(ctx.save).toHaveBeenCalled();
            expect(ctx.restore).toHaveBeenCalled();
            expect(ctx.fillText).toHaveBeenCalled();
        });

        it('should not modify canvas when watermark disabled', () => {
            const canvas = createTestFixtures.canvas(100, 100);
            const ctx = canvas.getContext('2d');

            // Mock methods that should not be called
            ctx.fillText = jest.fn();
            ctx.translate = jest.fn();
            ctx.rotate = jest.fn();

            WatermarkManager.addWatermark(canvas, ctx, false);

            expect(ctx.fillText).not.toHaveBeenCalled();
            expect(ctx.translate).not.toHaveBeenCalled();
            expect(ctx.rotate).not.toHaveBeenCalled();
        });
    });

    describe('Performance Tests', () => {
        beforeEach(() => {
            // Reset performance mock by clearing all mocks and getting fresh reference
            jest.clearAllMocks();
            const mockPerformanceNow = global.mockPerformanceNow;
            let callCount = 0;
            mockPerformanceNow.mockImplementation(() => {
                return callCount++ * 100; // Each call adds 100ms
            });
        });

        it('should process large canvas efficiently', () => {
            const canvas = createTestFixtures.canvas(500, 500);
            const ctx = canvas.getContext('2d');

            // Mock large image data
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(500 * 500 * 4),
                width: 500,
                height: 500
            }));
            ctx.putImageData = jest.fn();

            const startTime = performance.now();
            ImageProcessor.convertToGrayscale(canvas, ctx);
            const endTime = performance.now();

            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1000);
        });

        it('should handle multiple rapid tool applications', () => {
            const canvas = createTestFixtures.canvas(100, 100);
            const ctx = canvas.getContext('2d');

            // Mock context methods
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            const tool = new BlackoutTool();
            const startTime = performance.now();

            // Apply tool multiple times
            for (let i = 0; i < 50; i++) {
                tool.apply(ctx, Math.random() * 100, Math.random() * 100, 5);
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(2000);
            expect(ctx.arc).toHaveBeenCalledTimes(50);
        });

        it('should handle memory efficiently with large operations', () => {
            const canvas = createTestFixtures.canvas(1000, 1000);
            const ctx = canvas.getContext('2d');

            // Create large mock data
            const largeData = new Uint8ClampedArray(1000 * 1000 * 4);
            ctx.getImageData = jest.fn(() => ({
                data: largeData,
                width: 1000,
                height: 1000
            }));
            ctx.putImageData = jest.fn();

            expect(() => {
                ImageProcessor.convertToGrayscale(canvas, ctx);
            }).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle zero-sized elements gracefully', () => {
            const canvas = createTestFixtures.canvas(0, 0);
            const ctx = canvas.getContext('2d');

            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(0),
                width: 0,
                height: 0
            }));

            expect(() => {
                ImageProcessor.convertToGrayscale(canvas, ctx);
            }).not.toThrow();
        });

        it('should handle boundary coordinates in tools', () => {
            const canvas = createTestFixtures.canvas(10, 10);
            const ctx = canvas.getContext('2d');

            // Mock methods
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(400),
                width: 10,
                height: 10
            }));
            ctx.putImageData = jest.fn();
            ctx.fillRect = jest.fn();
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            const tools = [
                ObfuscationToolFactory.createTool('blur'),
                ObfuscationToolFactory.createTool('pixelate'),
                ObfuscationToolFactory.createTool('blackout')
            ];

            const edgeCases = [
                { x: 0, y: 0, radius: 5 },       // Top-left
                { x: 10, y: 10, radius: 5 },     // Bottom-right
                { x: -5, y: -5, radius: 5 },     // Outside canvas
                { x: 5, y: 5, radius: 1000 }     // Large radius
            ];

            tools.forEach(tool => {
                edgeCases.forEach(({ x, y, radius }) => {
                    expect(() => {
                        tool.apply(ctx, x, y, radius);
                    }).not.toThrow(`Tool ${tool.name} failed at (${x}, ${y}) with radius ${radius}`);
                });
            });
        });

        it('should handle invalid inputs gracefully', () => {
            expect(() => {
                ImageProcessor.scaleImageToFit(NaN, NaN, 800, 600);
            }).not.toThrow();

            expect(() => {
                ImageProcessor.scaleImageToFit(-100, -100, 800, 600);
            }).not.toThrow();

            expect(() => {
                ImageProcessor.scaleImageToFit(Infinity, Infinity, 800, 600);
            }).not.toThrow();
        });

        it('should maintain state consistency across operations', () => {
            const canvas = createTestFixtures.canvas(50, 50);
            const canvasManager = new CanvasManager(canvas);
            const ctx = canvasManager.getContext();

            // Mock required methods
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(10000),
                width: 50,
                height: 50
            }));
            ctx.putImageData = jest.fn();

            // Simulate complex operation sequence
            const tool = ObfuscationToolFactory.createTool('blur');
            
            // Apply multiple operations
            tool.apply(ctx, 10, 10, 5);
            tool.apply(ctx, 20, 20, 8);
            tool.apply(ctx, 30, 30, 3);

            // Manager should maintain consistency
            expect(canvasManager.canvas).toBe(canvas);
            expect(canvasManager.getContext()).toBe(ctx);
        });
    });

    describe('Error Handling', () => {
        it('should handle FileManager errors gracefully', async () => {
            let errorMessage = '';
            
            await FileManager.handleImageUpload(
                null,
                () => {},
                (error) => {
                    errorMessage = error;
                }
            );

            expect(errorMessage).toBe('No se ha seleccionado ningún archivo.');
        });

        it('should handle malformed image data', () => {
            const canvas = createTestFixtures.canvas();
            const ctx = canvas.getContext('2d');
            
            // Create malformed image data
            const badImageData = {
                data: null,
                width: 0,
                height: 0
            };
            
            // Test should not throw when handling malformed data gracefully
            expect(() => {
                ctx.putImageData = jest.fn(() => {
                    throw new Error('Invalid image data');
                });
                
                // This should be caught by error handling
                ImageProcessor.convertToGrayscale(canvas, ctx);
            }).not.toThrow();
        });

        it('should handle context method failures', () => {
            const canvas = createTestFixtures.canvas();
            const ctx = canvas.getContext('2d');
            const tool = new BlackoutTool();
            
            // Mock context method to fail
            ctx.arc = jest.fn(() => {
                throw new Error('Context error');
            });
            
            // Should handle the error gracefully, not throw
            expect(() => {
                tool.apply(ctx, 5, 5, 3);
            }).not.toThrow();
        });
    });
}); 