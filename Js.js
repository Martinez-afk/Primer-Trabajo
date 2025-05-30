// --- ARRAY ---
// Array inicial de tareas
let tareas = ["Hacer la compra", "Estudiar JavaScript", "Pasear al perro"];

// --- ELEMENTOS DEL DOM ---
// Obtenemos referencias a los elementos HTML con los que vamos a interactuar
const listaTareasDiv = document.getElementById('lista-tareas-div');
const nuevaTareaInput = document.getElementById('nueva-tarea-input');
const btnAgregar = document.getElementById('btn-agregar');
const btnContar = document.getElementById('btn-contar');
const cantidadTareasP = document.getElementById('cantidad-tareas-p');

// --- FUNCIONES ---

/**
 * Función para mostrar las tareas del array en el HTML.
 * Crea una lista <ul> y elementos <li> para cada tarea.
 */
function mostrarTareas() {
    listaTareasDiv.innerHTML = ''; // Limpia el contenido anterior para evitar duplicados

    if (tareas.length === 0) {
        listaTareasDiv.innerHTML = '<p>No hay tareas pendientes.</p>';
        return;
    }

    const ul = document.createElement('ul'); // Crea un elemento <ul>
    tareas.forEach(function(tarea) {
        const li = document.createElement('li'); // Crea un elemento <li>
        li.textContent = tarea;                  // Establece el texto del <li>
        ul.appendChild(li);                      // Añade el <li> al <ul>
    });
    listaTareasDiv.appendChild(ul); // Añade el <ul> al div contenedor
}

/**
 * Función para agregar una nueva tarea al array y actualizar la vista.
 */
function agregarTarea() {
    const nuevaTareaTexto = nuevaTareaInput.value.trim(); // Obtiene el valor del input y quita espacios

    if (nuevaTareaTexto !== "") {
        tareas.push(nuevaTareaTexto); // Agrega la nueva tarea al FINAL del array 'tareas'
        mostrarTareas();             // Vuelve a dibujar la lista de tareas
        nuevaTareaInput.value = "";  // Limpia el campo de entrada
        cantidadTareasP.textContent = ""; // Limpia el mensaje de cantidad si estaba visible
    } else {
        alert("Por favor, escribe una tarea.");
    }
}

/**
 * Función para mostrar la cantidad total de tareas en el array.
 */
function mostrarCantidadDeTareas() {
    const cantidad = tareas.length; // Obtiene la longitud (cantidad de elementos) del array
    cantidadTareasP.textContent = `Total de tareas: ${cantidad}`;
}

// --- EVENT LISTENERS (ESCUCHADORES DE EVENTOS) ---
// Asignamos funciones a los eventos de los botones

// Cuando se hace clic en el botón 'Agregar Tarea'
btnAgregar.addEventListener('click', agregarTarea);

// Cuando se presiona Enter en el campo de texto
nuevaTareaInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

// Cuando se hace clic en el botón 'Mostrar Cantidad de Tareas'
btnContar.addEventListener('click', mostrarCantidadDeTareas);


// --- INICIALIZACIÓN ---
// Mostrar las tareas iniciales cuando la página se carga por primera vez
document.addEventListener('DOMContentLoaded', function() {
    mostrarTareas();
});