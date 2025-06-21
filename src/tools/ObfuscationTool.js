// Base class for obfuscation tools
export class ObfuscationTool {
    constructor(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Tool name is required and must be a string');
        }
        this.name = name;
    }

    apply(ctx, x, y, radius) {
        throw new Error('Apply method must be implemented by subclass');
    }

    validateInput(ctx, x, y, radius) {
        if (!ctx) {
            throw new Error('Canvas context is required');
        }

        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(radius)) {
            throw new Error('Invalid coordinates or radius');
        }

        if (radius <= 0) {
            throw new Error('Radius must be positive');
        }

        return true;
    }
} 