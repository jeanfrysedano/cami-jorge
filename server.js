const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const Mensaje = require('./models/Mensaje'); // <--- ¡Asegúrate de tener esta línea!
// ...
require('dotenv').config();

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, '/')));

// Ruta para pedir mensajes de un tipo específico
app.get('/api/buscar-por-tipo/:tipo', async (req, res) => {    try {
        const tipoBuscado = req.params.tipo;
        const mensajes = await Mensaje.find({ tipo: tipoBuscado });
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar mensajes" });
    }
});


app.use(cors()); 
app.use(express.json());

// 🔍 MIDDLEWARE DE DIAGNÓSTICO: Nos va a mostrar en la terminal qué URLs llegan
app.use((req, res, next) => {
    console.log("-----------------------------------------");
    console.log(`Llegó una petición: ${req.method} a la URL: ${req.url}`);
    next();
});


app.use('/uploads', express.static('uploads'));


// 🔥 Ruta global de emergencia para borrar directo en server.js
app.post('/api/mensajes/todos/eliminar/:id', async (req, res) => {
    try {
        console.log("--> Intentando borrar el ID en Mongo:", req.params.id);
        const Mensaje = require('./models/Mensaje'); 
        const mensajeEliminado = await Mensaje.findByIdAndDelete(req.params.id);
        
        if (!mensajeEliminado) {
            console.log("❌ No se encontró ese recuerdo en la base de datos.");
            return res.status(404).json({ error: 'No se encontró el recuerdo en la base de datos' });
        }
        
        console.log("✅ ¡Recuerdo eliminado de la base de datos con éxito!");
        res.json({ mensaje: 'Recuerdo eliminado correctamente' });
    } catch (error) {
        console.error("💥 Error en el backend al borrar:", error.message);
        res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
});

// Conectamos las rutas de los mensajes (las demás)
app.use('/api/mensajes', require('./routes/mensajes'));

// Conexión mágica a MongoDB Atlas usando la clave oculta
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB Atlas! 🌌'))
  .catch(err => console.error('Error al conectar a la base de datos: ❌', err));

// Ruta de prueba
//app.get('/', (req, res) => {
  //res.send('El servidor de la cápsula del tiempo está corriendo 🚀');
//}); //

// 🌟 DECLARADO UNA SOLA VEZ ACÁ ABAJO 🌟
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`¡Servidor corriendo y escuchando con éxito en http://localhost:${PORT}! 🚀`);
});

