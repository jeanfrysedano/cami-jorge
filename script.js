const formulario = document.getElementById('formulario-capsula'); // Asegurate de que tu <form> en el HTML tenga este ID

if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Agarramos lo que el usuario escribió (usando los IDs reales de tu pantalla)
    const fechaInput = document.getElementById('cuando').value; // O el ID que tenga tu primer input
    const tituloInput = document.getElementById('titulo').value; // O el ID de tu segundo input
    const historiaInput = document.getElementById('historia').value; // O el ID de tu textarea

    try {
      // 2. Le mandamos TODO al servidor para que lo guarde en MongoDB
      const respuesta = await fetch('http://localhost:3000/api/mensajes/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({
          autor: tituloInput, // Usamos el título como autor por ahora para probar
          texto: historiaInput,
          tipo: 'linea-tiempo' // <--- AGREGA ESTA LÍNEA AQUÍ // Tu anécdota va al texto
        })
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Anécdota guardada en MongoDB Atlas con éxito! 🎁');
        formulario.reset(); // Limpia los campos
        
        // Opcional: Si querés ocultar el recuadro de abajo para que no confunda, 
        // podés borrarlo de tu HTML o dejarlo vacío con JS:
        const contenedorJson = document.getElementById('bloque-json'); // El ID de tu recuadro de abajo si lo tiene
        if (contenedorJson) contenedorJson.style.display = 'none'; 

      } else {
        alert('Hubo un problema: ' + resultado.error);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar al servidor. Asegurate de tener la terminal corriendo.');
    }
  });
}

// --- CONFIGURACIÓN: Cambia esto por tu fecha de inicio ---
// Formato: new Date(Año, Mes-1, Día)
// Ejemplo: new Date(2025, 4, 15) es 15 de Mayo de 2025
const fechaInicio = new Date(2025, 9, 6); 

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    if (diferencia < 0) return; // Por si la fecha es futura

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Actualizar los elementos con los IDs que tienes en tu HTML
    document.getElementById("dias").innerText = String(dias).padStart(2, '0');
    document.getElementById("horas").innerText = String(horas).padStart(2, '0');
    document.getElementById("minutos").innerText = String(minutos).padStart(2, '0');
    document.getElementById("segundos").innerText = String(segundos).padStart(2, '0');
}

// Ejecutar cada segundo
setInterval(actualizarContador, 1000);
actualizarContador();



//DISEÑO CARTITAS


function toggleAnotador(id) {
    const elemento = document.getElementById(id);
    
    // Si tiene la clase 'activo', se la quitamos; si no, se la ponemos.
    elemento.classList.toggle('activo');
}

function intentarAbrir() {
    const fechaAniversario = new Date(2027, 0, 1); // Cambia por tu fecha
    const hoy = new Date();

    if (hoy >= fechaAniversario) {
        window.location.href = 'mensajes-aniversario.html';
    } else {
        const errorMsg = document.getElementById('mensaje-error');
        errorMsg.style.display = 'block';
        alert("¡Espera un poco más! Este secreto se revela en el aniversario.");
    }
}


// Abrir el modal
function abrirModal(quien) {
    document.getElementById('titulo-modal').innerText = "Escribe un pensamiento cool " + quien;
    document.getElementById('modal-anotador').style.display = "block";
}

// Variable para guardar a quién le escribimos
let destinatarioActual = "";

// Modificamos ligeramente abrirModal para guardar el nombre
function abrirModal(quien) {
    destinatarioActual = quien;
    document.getElementById('titulo-modal').innerText = "Escribe un pensamiento cool " + quien;
    document.getElementById('modal-anotador').style.display = "block";
}

// NUEVA FUNCIÓN: Esta es la que guarda el pensamiento
async function guardarAnotacion() {
    const textoInput = document.getElementById('texto-anotacion').value;

    if (!textoInput) {
        alert("Escribe algo antes de guardar.");
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/mensajes/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                autor: destinatarioActual, // "Cami" o "Jorge"
                texto: textoInput,
                tipo: 'aniversario' // <--- ESTA ES LA ETIQUETA MÁGICA
            })
        });

        if (respuesta.ok) {
            alert("¡Pensamiento guardado en la cápsula! 🔒");
            document.getElementById('texto-anotacion').value = ""; // Limpiamos el campo
            cerrarModal();
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
}

// Cerrar el modal
function cerrarModal() {
    document.getElementById('modal-anotador').style.display = "none";
}

// Cierra si haces clic fuera del recuadro
window.onclick = function(event) {
    const modal = document.getElementById('modal-anotador');
    if (event.target == modal) {
        cerrarModal();
    }
}