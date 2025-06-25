import { PassportObfuscator } from './PassportObfuscator.js';

// Shitty initialization
// TODO: Optimize perfomance
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create PassportObfuscator if canvas exists
        const canvas = document.getElementById('canvas');
        let app = null;
        
        if (canvas) {
            app = new PassportObfuscator();
            console.log('PassportObfuscator initialized successfully');
        } else {
            console.log('No canvas found, skipping PassportObfuscator initialization');
        }
        
        window.app = app;
        
        window.updateSelectedTool = (toolType) => {
            if (app) {
                app.updateSelectedTool(toolType);
            }
        };
    } catch (error) {
        // TODO: better error handling here
        console.log('Something went wrong: ' + error.message);
        console.error(error);

        window.app = null;
    }
}); 