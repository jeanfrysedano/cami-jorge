async function cargarMensajes() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/obtener-tipo/aniversario');
        const mensajes = await respuesta.json(); // Esto trae solo los de tipo 'aniversario'
        
        const contenedor = document.getElementById('contenedor-mensajes');
        contenedor.innerHTML = ""; 

        mensajes.forEach(msg => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="tarjeta-mensaje">
                    <h3>${msg.autor}</h3>
                    <p>${msg.texto}</p>
                </div>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
cargarMensajes();