const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({
    autor: { type: String, required: true },
    texto: { type: String, required: true },
    // 🌟 ASEGURATE DE QUE ESTÉ ASÍ:
    fechaCreacion: { 
        type: Date, 
        default: Date.now // Si no mandás nada usa hoy, pero si mandás, usa lo tuyo
    },
    // AGREGA ESTA LÍNEA:
    foto: { type: String },

    tipo: { type: String, default: 'aniversario' },
});

module.exports = mongoose.model('Mensaje', MensajeSchema);