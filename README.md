# 🛂 MaskMyDoc

Una aplicación web simple y segura para ocultar información sensible en documentos de identificación, con marca de agua automática "DATOSECUATORIANOS" y procesamiento completamente local.

## ✨ Características

### 🔒 **Privacidad y Seguridad**
- **Procesamiento local**: Todas las imágenes se procesan en el navegador
- **Sin servidor**: No se suben archivos a ningún servidor
- **Privacidad total**: Tus documentos nunca salen de tu dispositivo

### 🎨 **Herramientas de Obfuscación**
- **Pixelar**: Crea efecto pixelado para ocultar información
- **Tachar**: Cubre áreas con color negro sólido

### 🏷️ **Marca de Agua Inteligente**
- **Cobertura completa**: Patrón de marca de agua en toda la imagen
- **Texto personalizado**: "DATOSECUATORIANOS" automático
- **Múltiples capas**: Sistema de 3 capas con diferentes tamaños y ángulos
- **Opcional**: Se puede activar/desactivar según necesidad

### 📱 **Compatibilidad**
- **Responsive**: Funciona en desktop y móvil
- **Touch Support**: Soporte para dispositivos táctiles
- **Cross-browser**: Compatible con navegadores modernos

## 🚀 Uso

### 1. **Subir Imagen**
- Haz clic en "Seleccionar Imagen"
- Elige un archivo de imagen de pasaporte
- La imagen se convertirá automáticamente a escala de grises

### 2. **Ocultar Información**
- Selecciona una herramienta de obfuscación
- Haz clic y arrastra sobre las áreas que deseas ocultar
- Repite para múltiples áreas sensibles

### 3. **Descargar**
- La marca de agua se aplica automáticamente
- Haz clic en "Descargar Imagen"
- Se guardará como archivo PNG

## 📁 Estructura del Proyecto

```
obfuscator-dni/
├── index.html          # Interfaz principal
├── styles.css          # Estilos y diseño
├── script.js           # Lógica de la aplicación
├── README.md           # Este archivo
└── LICENSE             # Licencia MIT
```

## 🛠️ Instalación

No requiere instalación. Simplemente:

1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador web
3. ¡Listo para usar!

```bash
git clone https://github.com/davcortez/MaskMyDoc.git
cd MaskMyDoc
# Abre index.html en tu navegador
```

## 🌐 Compatibilidad de Navegadores

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Navegadores móviles modernos

## 🎯 Casos de Uso

### 📄 **Documentos Oficiales**
- Pasaportes ecuatorianos
- Cédulas de identidad
- Documentos de viaje

### 🔐 **Protección de Datos**
- Ocultar números de documento
- Proteger información personal
- Crear versiones seguras para compartir

### 🏢 **Uso Profesional**
- Verificación de documentos
- Procesamiento de solicitudes
- Archivos de seguridad

## ⚡ Características Técnicas

### 🎨 **Procesamiento de Imagen**
- **Canvas HTML5**: Manipulación avanzada de imágenes
- **Algoritmos optimizados**: Blur, pixelación y ocultación eficientes
- **Conversión automática**: Escala de grises profesional

### 💾 **Gestión de Datos**
- **FileReader API**: Lectura local de archivos
- **ImageData**: Manipulación a nivel de píxel
- **Blob URLs**: Descarga segura sin servidor

### 📱 **Interfaz Responsiva**
- **CSS Grid/Flexbox**: Layout moderno y flexible
- **Touch Events**: Soporte nativo para móviles
- **Media Queries**: Adaptación automática a diferentes pantallas

## 🔧 Personalización

### Modificar Marca de Agua
En `script.js`, línea ~109:
```javascript
const text = 'TU_TEXTO_AQUI';
```

### Ajustar Tamaño de Pincel
En `script.js`, línea ~9:
```javascript
this.brushSize = 30;
```

### Cambiar Colores
En `styles.css`, modifica las variables de color:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔒 Seguridad y Privacidad

- **Sin telemetría**: No se recopilan datos de usuario
- **Procesamiento local**: Todas las operaciones en el cliente
- **Sin cookies**: No se almacenan datos persistentes
- **Código abierto**: Completamente auditable

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un [Issue](https://github.com/davcortez/MaskMyDoc/issues)
- Revisa la documentación
- Verifica la compatibilidad de tu navegador

---

⭐ **¿Te fue útil este proyecto? ¡Deja una estrella!**

Desarrollado con ❤️ para la protección de datos personales en Ecuador 🇪🇨 