// Esperamos a que todo el contenido del HTML esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- Ejemplo 1: Condicional IF-ELSE ---
    const btnVerificar = document.getElementById('btnVerificar');
    const inputParImpar = document.getElementById('numeroParImpar');
    const resultadoParImpar = document.getElementById('resultadoParImpar');

    btnVerificar.addEventListener('click', () => {
        const numero = parseInt(inputParImpar.value); // Convertimos el texto a número entero

        if (isNaN(numero)) { // Verificamos si la entrada es un número válido
            resultadoParImpar.textContent = 'Por favor, introduce un número válido.';
        } else if (numero % 2 === 0) {
            resultadoParImpar.textContent = `El número ${numero} es PAR.`;
        } else {
            resultadoParImpar.textContent = `El número ${numero} es IMPAR.`;
        }
    });

    // --- Ejemplo 2: Bucle FOR ---
    const btnGenerarTabla = document.getElementById('btnGenerarTabla');
    const inputTabla = document.getElementById('numeroTabla');
    const resultadoTabla = document.getElementById('resultadoTabla');

    btnGenerarTabla.addEventListener('click', () => {
        const numero = parseInt(inputTabla.value);
        let tablaHTML = ''; // Variable para construir el resultado

        if (isNaN(numero)) {
            resultadoTabla.innerHTML = 'Introduce un número válido.';
            return; // Salimos de la función
        }

        // Bucle que se repite 10 veces
        for (let i = 1; i <= 10; i++) {
            tablaHTML += `${numero} x ${i} = ${numero * i}<br>`; // Concatenamos cada línea
        }
        resultadoTabla.innerHTML = tablaHTML; // Mostramos el resultado en el div
    });

    // --- Ejemplo 3: Array y Bucle forEach ---
    const btnMostrarLista = document.getElementById('btnMostrarLista');
    const resultadoLista = document.getElementById('resultadoLista');
    const listaDeCompras = ['Leche', 'Pan', 'Huevos', 'Fruta', 'Verduras']; // Estructura de datos: Array

    btnMostrarLista.addEventListener('click', () => {
        resultadoLista.innerHTML = ''; // Limpiamos la lista anterior

        // Recorremos cada elemento del array
        listaDeCompras.forEach(item => {
            const li = document.createElement('li'); // Creamos un elemento <li>
            li.textContent = item; // Le ponemos el texto del item
            resultadoLista.appendChild(li); // Lo añadimos a la lista <ul>
        });
    });

    // --- Ejemplo 4: Condicional SWITCH ---
    const btnEvaluarDia = document.getElementById('btnEvaluarDia');
    const selectDia = document.getElementById('opcionDia');
    const resultadoSwitch = document.getElementById('resultadoSwitch');

    btnEvaluarDia.addEventListener('click', () => {
        const diaSeleccionado = selectDia.value;
        let mensaje = '';

        switch (diaSeleccionado) {
            case 'lunes':
                mensaje = '¡Ánimo, empieza la semana!';
                break;
            case 'miercoles':
                mensaje = '¡Ya estamos a mitad de semana!';
                break;
            case 'viernes':
                mensaje = '¡Por fin es viernes! ¡A disfrutar!';
                break;
            case 'domingo':
                mensaje = 'Día de descanso y relax.';
                break;
            default:
                mensaje = 'Selecciona una opción válida.';
                break;
        }
        resultadoSwitch.textContent = mensaje;
    });

});