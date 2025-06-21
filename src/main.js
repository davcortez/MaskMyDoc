import { PassportObfuscator } from './PassportObfuscator.js';

// Shitty initialization
// TODO: Optimize perfomance
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new PassportObfuscator();
    } catch (error) {
        // TODO: better error handling here
        console.log('Something went wrong: ' + error.message);
        console.error(error);
    }
}); 