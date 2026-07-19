const express = require('express');
const router = express.Router();
const Mensaje = require('../models/Mensaje');
const multer = require('multer'); // <--- 1. AGREGA ESTO
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
// 1. RUTA PARA GUARDAR
router.post('/guardar', upload.single('foto'), async (req, res) => {
    console.log("¿Qué recibió multer?:", req.file);
  try {
    const { autor, texto, fecha } = req.body; 
    let fechaFinal = new Date();

    if (fecha) {
        const partes = fecha.split('-');
        if (partes.length === 3) {
            fechaFinal = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));
        }
    }
    
    const nuevoMensaje = new Mensaje({ 
        autor, 
        texto,
        fechaCreacion: fechaFinal,
        foto: req.file ? req.file.filename : null // <--- 3. SOLO ESTA LÍNEA NUEVA
    });

    console.log("Mensaje a guardar en MongoDB:", nuevoMensaje); // TAMBIÉN ESTO
    
    await nuevoMensaje.save();
    res.status(201).json({ mensaje: '¡Mensaje guardado!', datos: nuevoMensaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar', detalle: error.message });
  }
});

// 2. RUTA PARA TRAER TODOS (GET) - ¡ESTO ES LO QUE ESTABA MAL!
router.get('/todos', async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fechaCreacion: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

module.exports = router;