// Este "oyente" espera a que todo el documento HTML esté listo.
// Es la solución estándar para evitar errores de "elemento no encontrado".
document.addEventListener('DOMContentLoaded', () => {

    // --- TODO NUESTRO CÓDIGO AHORA VA AQUÍ DENTRO ---

    // PASO 1: DEFINIR DATOS Y ELEMENTOS
    const estudiantes = ["Ana", "Juan", "Carlos", "Sofía", "Laura"];
    
    // Ahora, esta línea se ejecuta cuando es seguro que el botón ya existe.
    const botonSaludar = document.getElementById('boton-saludar');
    const divResultado = document.getElementById('resultado');

    // Si por alguna razón el botón no se encuentra, mostramos un error en la consola.
    if (!botonSaludar) {
        console.error("Error: No se encontró el botón con id 'boton-saludar'. Revisa tu HTML.");
        return; // Detiene la ejecución si el botón no existe.
    }

    // PASO 2: DEFINIR LA FUNCIÓN
    function generarListaDeSaludos(listaDeNombres) {
        let listaHTML = '<ul>';
        listaDeNombres.forEach(nombre => {
            listaHTML += `<li>¡Hola, ${nombre}! Bienvenido/a al curso.</li>`;
        });
        listaHTML += '</ul>';
        return listaHTML;
    }

    // PASO 3: AÑADIR INTERACTIVIDAD (EVENTO)
    botonSaludar.addEventListener('click', () => {
        const saludosHTML = generarListaDeSaludos(estudiantes);
        divResultado.innerHTML = saludosHTML;
    });

    console.log("Script cargado y listo para funcionar.");

});