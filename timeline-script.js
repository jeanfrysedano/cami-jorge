document.addEventListener("DOMContentLoaded", () => {
    // --- Lógica del Timeline ---
    const contenedor = document.getElementById("timeline");
    if (contenedor) {
        fetch("https://cami-jorge.onrender.com/api/mensajes/todos")
            .then(response => response.json())
            .then(datos => {
                for (let i = datos.length - 1; i >= 0; i--) {
                    agregarTarjetaAlDOM(datos[i], i);
                }
                activarAnimacionScroll();
            })
            .catch(error => console.error("Error cargando:", error));
    }

    // --- Lógica del Formulario ---
    const formRecuerdo = document.getElementById('form-recuerdo');
    if (formRecuerdo) {
        formRecuerdo.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append("autor", document.getElementById('nuevo-titulo').value);
            formData.append("texto", document.getElementById('nueva-desc').value);
            formData.append("fecha", document.getElementById('nueva-fecha').value);
            
            const fotoInput = document.getElementById("fotoInput");
            if (fotoInput && fotoInput.files.length > 0) {
                formData.append("foto", fotoInput.files[0]);
                console.log("Archivo seleccionado:", fotoInput.files[0].name); // Agrega esto para ver si entra aquí
} else {
    console.log("No se detectó ningún archivo");
            }

            try {
                const respuesta = await fetch('https://cami-jorge.onrender.com/api/mensajes/guardar', {
    method: 'POST',
    body: formData
});;

                if (respuesta.ok) {
                    alert('¡Anécdota guardada con éxito! 🎁');
                    window.location.href = 'timeline.html'; 
                } else {
                    alert('Error al guardar en la base de datos.');
                }
            } catch (error) {
                console.error("Error de conexión:", error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});

// --- Funciones auxiliares (mantén estas tal cual) ---
function agregarTarjetaAlDOM(momento, index) {
    const contenedor = document.getElementById("timeline");
    if (!contenedor) return; 

    const item = document.createElement("div");
    const lado = index % 2 === 0 ? "izquierda" : "derecha";
    item.className = `timeline-item ${lado} visible`;

    const posicionTacho = lado === "izquierda" ? "top: 10px; left: 10px;" : "top: 10px; right: 10px;";

    item.innerHTML = `
        <div class="timeline-contenido" style="position: relative;">
            <button class="btn-borrar-recuerdo" onclick="eliminarMomento('${momento._id}')" style="position: absolute; ${posicionTacho} background: transparent; border: none; cursor: pointer;">🗑️</button>
            <span class="fecha-tag">${momento.fechaCreacion ? new Date(momento.fechaCreacion).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : 'Sin fecha'}</span>
            <h3>${momento.autor}</h3>
            <p>${momento.texto}</p>
            ${momento.foto ? `<img src="https://cami-jorge.onrender.com/uploads/${momento.foto}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">` : ''}
        </div>
    `;
    contenedor.prepend(item);
}

function activarAnimacionScroll() {
    const items = document.querySelectorAll(".timeline-item");
    const comprobarScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        items.forEach(item => {
            if (item.getBoundingClientRect().top < triggerBottom) item.classList.add("visible");
        });
    };
    window.addEventListener("scroll", comprobarScroll);
    comprobarScroll();
}

async function eliminarMomento(id) {
    if (confirm("¿Borrar este recuerdo? 🥺")) {
        try {
const respuesta = await fetch(`https://cami-jorge.onrender.com/api/mensajes/todos/eliminar/${id}`, { method: 'POST' });            if (respuesta.ok) window.location.reload(); 
        } catch (error) { console.error("Error:", error); }
    }
}

async function cargarRecuerdos() {
    const respuesta = await fetch('https://cami-jorge.onrender.com/api/mensajes/todos');
    const todos = await respuesta.json();
    
    // Filtramos para obtener SOLO los recuerdos normales
    const recuerdos = todos.filter(m => m.tipo === 'recuerdo');
    
    const contenedor = document.getElementById('contenedor-linea-tiempo');
    contenedor.innerHTML = ""; 
    
    recuerdos.forEach(msg => {
        // ... aquí pintas tus tarjetas de la línea de tiempo
    });
}