/**
 * @jest-environment jsdom
 */

describe('Obfuscation Tools', () => {
    describe('ObfuscationTool (Base Class)', () => {
        it('should create tool with name', () => {
            const tool = new ObfuscationTool('test');
            expect(tool.name).toBe('test');
        });

        it('should throw error when apply method is not implemented', () => {
            const tool = new ObfuscationTool('test');
            const ctx = createTestFixtures.canvas().getContext('2d');
            
            expect(() => {
                tool.apply(ctx, 10, 10, 5);
            }).toThrow('Apply method must be implemented by subclass');
        });
    });

    describe('PixelateTool', () => {
        let tool, ctx, canvas;

        beforeEach(() => {
            tool = new PixelateTool();
            canvas = createTestFixtures.canvas();
            ctx = canvas.getContext('2d');
        });

        it('should create pixelate tool correctly', () => {
            expect(tool.name).toBe('pixelate');
            expect(tool).toBeInstanceOf(ObfuscationTool);
        });

        it('should apply pixelate effect', () => {
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray([255, 0, 0, 255]),
                width: 1,
                height: 1
            }));
            ctx.fillRect = jest.fn();

            tool.apply(ctx, 10, 10, 5);

            expect(ctx.fillRect).toHaveBeenCalled();
        });

        it('should create pixelated blocks', () => {
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray([255, 0, 0, 255]),
                width: 1,
                height: 1
            }));
            ctx.fillRect = jest.fn();

            tool.apply(ctx, 10, 10, 20);

            expect(ctx.fillRect).toHaveBeenCalledWith(
                expect.any(Number), 
                expect.any(Number), 
                8, // pixelSize
                8
            );
        });

        it('should handle edge coordinates', () => {
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray([255, 0, 0, 255]),
                width: 1,
                height: 1
            }));
            ctx.fillRect = jest.fn();

            expect(() => {
                tool.apply(ctx, 0, 0, 5);
            }).not.toThrow();
        });
    });

    describe('BlackoutTool', () => {
        let tool, ctx;

        beforeEach(() => {
            tool = new BlackoutTool();
            ctx = createTestFixtures.canvas().getContext('2d');
        });

        it('should create blackout tool correctly', () => {
            expect(tool.name).toBe('blackout');
            expect(tool).toBeInstanceOf(ObfuscationTool);
        });

        it('should apply blackout effect', () => {
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            tool.apply(ctx, 10, 10, 5);

            expect(ctx.arc).toHaveBeenCalledWith(10, 10, 5, 0, Math.PI * 2);
            expect(ctx.fill).toHaveBeenCalled();
        });

        it('should set correct fill style', () => {
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            tool.apply(ctx, 10, 10, 5);

            expect(ctx.fillStyle).toBe('black');
        });

        it('should handle different positions and radii', () => {
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            const testCases = [
                { x: 5, y: 5, radius: 3 },
                { x: 50, y: 25, radius: 10 },
                { x: 100, y: 100, radius: 20 }
            ];

            testCases.forEach(({ x, y, radius }) => {
                tool.apply(ctx, x, y, radius);
                expect(ctx.arc).toHaveBeenCalledWith(x, y, radius, 0, Math.PI * 2);
            });
        });

        it('should save and restore context', () => {
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            tool.apply(ctx, 10, 10, 5);

            expect(ctx.save).toHaveBeenCalled();
            expect(ctx.restore).toHaveBeenCalled();
        });
    });

    describe('ObfuscationToolFactory', () => {
        it('should create pixelate tool', () => {
            const tool = ObfuscationToolFactory.createTool('pixelate');
            expect(tool).toBeInstanceOf(PixelateTool);
            expect(tool.name).toBe('pixelate');
        });

        it('should create blackout tool', () => {
            const tool = ObfuscationToolFactory.createTool('blackout');
            expect(tool).toBeInstanceOf(BlackoutTool);
            expect(tool.name).toBe('blackout');
        });

        it('should return default tool for unknown tool type', () => {
            const tool = ObfuscationToolFactory.createTool('unknown');
            expect(tool).toBeInstanceOf(BlackoutTool);
        });

        it('should return default tool for null/undefined tool type', () => {
            const tool1 = ObfuscationToolFactory.createTool(null);
            const tool2 = ObfuscationToolFactory.createTool(undefined);
            
            expect(tool1).toBeInstanceOf(BlackoutTool);
            expect(tool2).toBeInstanceOf(BlackoutTool);
        });

        it('should return default tool for empty string', () => {
            const tool = ObfuscationToolFactory.createTool('');
            expect(tool).toBeInstanceOf(BlackoutTool);
        });

        it('should handle case insensitive input', () => {
            const tool1 = ObfuscationToolFactory.createTool('PIXELATE');
            const tool2 = ObfuscationToolFactory.createTool('Blackout');
            
            expect(tool1).toBeInstanceOf(PixelateTool);
            expect(tool2).toBeInstanceOf(BlackoutTool);
        });
    });

    describe('Tool Integration', () => {
        it('should apply multiple tools in sequence', () => {
            const canvas = createTestFixtures.canvas();
            const ctx = canvas.getContext('2d');
            
            // Mock context methods
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(10000),
                width: 50,
                height: 50
            }));
            ctx.fillRect = jest.fn();
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            const pixelateTool = ObfuscationToolFactory.createTool('pixelate');
            const blackoutTool = ObfuscationToolFactory.createTool('blackout');

            pixelateTool.apply(ctx, 10, 10, 5);
            blackoutTool.apply(ctx, 20, 20, 8);

            expect(ctx.fillRect).toHaveBeenCalled();
            expect(ctx.arc).toHaveBeenCalled();
        });

        it('should handle overlapping applications', () => {
            const canvas = createTestFixtures.canvas();
            const ctx = canvas.getContext('2d');
            
            ctx.getImageData = jest.fn(() => ({
                data: new Uint8ClampedArray(10000),
                width: 50,
                height: 50
            }));
            ctx.fillRect = jest.fn();
            ctx.save = jest.fn();
            ctx.restore = jest.fn();
            ctx.beginPath = jest.fn();
            ctx.arc = jest.fn();
            ctx.fill = jest.fn();

            const tool1 = ObfuscationToolFactory.createTool('blackout');
            const tool2 = ObfuscationToolFactory.createTool('pixelate');

            // Apply overlapping effects
            tool1.apply(ctx, 15, 15, 10);
            tool2.apply(ctx, 20, 20, 10);

            expect(ctx.arc).toHaveBeenCalled();
            expect(ctx.fillRect).toHaveBeenCalled();
        });

        it('should maintain tool independence', () => {
            const tool1 = ObfuscationToolFactory.createTool('pixelate');
            const tool2 = ObfuscationToolFactory.createTool('blackout');

            expect(tool1.name).toBe('pixelate');
            expect(tool2.name).toBe('blackout');
            expect(tool1).not.toBe(tool2);
        });
    });
}); 