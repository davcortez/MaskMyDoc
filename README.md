# MaskMyDoc - Document Obfuscation Tool

A modern, modular web application for obfuscating sensitive information in identification documents.

## 🏗️ Architecture

The application follows a modular ES6 architecture with clear separation of concerns

### 📁 Project Structure

```
MaskMyDoc/
├── 📄 index.html              # Main application interface
├── 🎨 styles.css              # Application styling
├── 📦 package.json            # Dependencies and scripts
├── 🔒 LICENSE                 # MIT License
├── 📚 README.md               # This documentation
├── 🔧 .gitignore              # Git ignore rules
├── 📁 src/                    # Source code (ES6 modules)
│   ├── 🚀 main.js             # Application entry point
│   ├── 📋 index.js            # Barrel exports
│   ├── ⚙️ config.js           # Immutable configuration
│   ├── 🎯 PassportObfuscator.js # Main orchestrator
│   ├── 🛠️ utils/
│   │   └── ErrorHandler.js    # Centralized error handling
│   ├── 🖼️ processors/
│   │   └── ImageProcessor.js  # Image processing operations
│   ├── 🎨 canvas/
│   │   └── CanvasManager.js   # Canvas management
│   ├── 🔧 tools/
│   │   ├── ObfuscationTool.js # Base tool class
│   │   ├── PixelateTool.js    # Pixelation tool
│   │   ├── BlackoutTool.js    # Blackout tool
│   │   └── ObfuscationToolFactory.js # Tool factory
│   ├── 📋 managers/
│   │   ├── WatermarkManager.js # Watermark operations
│   │   └── FileManager.js     # File operations
│   └── 🎮 controllers/
│       └── UIController.js    # UI event management
└── 🧪 tests/                  # Jest test suite
    ├── setup.js               # Test configuration
    ├── imageProcessor.test.js # Image processing tests
    ├── obfuscationTools.test.js # Tool tests
    ├── integration.test.js    # Integration tests
```

## 🛠️ Development

### Prerequisites

- Modern web browser with ES6 module support
- Python 3 (for development server)
- Node.js (for testing)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MaskMyDoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🧪 Testing

The application includes comprehensive Jest tests with **48 passing tests**:

```bash
# Run all tests
npm test

# Test specific modules
npm test -- --testNamePattern="ErrorHandler"
npm test -- --testNamePattern="ObfuscationTools"
```

### Test Coverage

✅ **48 tests passing** with comprehensive coverage of:

- **🖼️ ImageProcessor** - Scaling and grayscale conversion
- **🎨 CanvasManager** - Canvas operations and coordinates
- **🔧 ObfuscationTools** - All tools + factory pattern
- **🏷️ WatermarkManager** - Watermark logic
- **📁 FileManager** - Upload/download operations
- **🔗 Integration Tests** - Complete workflow testing
- **⚡ Performance Tests** - Benchmarks and optimization
- **🛡️ Edge Cases** - Error handling and validation

## 🌐 Browser Support

- ✅ Chrome 61+ (ES6 modules support)
- ✅ Firefox 60+ (ES6 modules support)
- ✅ Safari 10.1+ (ES6 modules support)
- ✅ Edge 16+ (ES6 modules support)

## 🔒 Security Features

- **🔍 File Signature Validation**: Magic number checking prevents malicious files
- **📏 Size Limits**: Prevents memory exhaustion attacks
- **📝 Extension Validation**: Whitelist of allowed file types
- **🏠 Local Processing**: No data sent to external servers
- **🛡️ Input Sanitization**: Comprehensive validation of all inputs

## 🎯 Performance

- **⚡ Lazy Loading**: Modules loaded on demand
- **💾 Memory Management**: Proper cleanup of canvas operations
- **🛡️ Error Boundaries**: Graceful degradation on failures

## 🚀 Usage

### 1. **📤 Upload Image**
- Click "Seleccionar Imagen"
- Choose a passport/ID image file
- Image automatically converts to grayscale

### 2. **🎭 Hide Information**
- Select an obfuscation tool
- Click and drag over sensitive areas
- Repeat for multiple areas

### 3. **📥 Download**
- Optionally enable watermark
- Click "Descargar Imagen"
- Saves as PNG file

## 🎯 Use Cases

### 📄 **Official Documents**
- Ecuadorian passports
- Identity cards
- Travel documents

### 🔐 **Data Protection**
- Hide document numbers
- Protect personal information
- Create secure versions for sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

The modular architecture makes contributions easier by allowing developers to work on specific modules without affecting the entire codebase.

## 📄 License

MIT License - see LICENSE file for details.

## 🔒 Security and Privacy

- **🚫 No Telemetry**: No user data collection
- **🏠 Local Processing**: All operations on client-side
- **🍪 No Cookies**: No persistent data storage
- **📖 Open Source**: Completely auditable
- **🧪 Rigorous Testing**: Test suite ensures reliability

## 📞 Support

If you have problems or questions:
- Open an [Issue](https://github.com/davcortez/MaskMyDoc/issues)
- Review the documentation
- Check browser compatibility
- Run tests: `npm test`

---

⭐ **Found this project helpful? Give it a star!**

Developed with ❤️ for personal data protection in Ecuador 🇪🇨 