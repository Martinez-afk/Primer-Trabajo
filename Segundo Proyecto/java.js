document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes y Variables Globales ---
    const PESO_CORTE_1 = 0.30;
    const PESO_CORTE_2 = 0.30;
    const PESO_CORTE_3 = 0.40;
    const NOTA_MINIMA = 0.0;
    const NOTA_MAXIMA = 5.0;

    // --- Elementos del DOM para Calcular Nota Final ---
    const nota1Input = document.getElementById('nota1');
    const nota2Input = document.getElementById('nota2');
    const nota3Input = document.getElementById('nota3');
    const btnCalcularFinal = document.getElementById('btnCalcularFinal');
    const resultadoFinalDiv = document.getElementById('resultadoFinal');

    // --- Elementos del DOM para Calcular Nota Necesaria ---
    const notaDeseadaInput = document.getElementById('notaDeseada');
    const nota1ConocidaInput = document.getElementById('nota1Conocida');
    const nota2ConocidaInput = document.getElementById('nota2Conocida');
    const nota3ConocidaInput = document.getElementById('nota3Conocida');
    const btnCalcularNecesaria = document.getElementById('btnCalcularNecesaria');
    const resultadoNecesariaDiv = document.getElementById('resultadoNecesaria');

    // --- Funciones Auxiliares ---
    function esNotaValida(notaStr) {
        if (notaStr === null || notaStr.trim() === '') return false; // No es válida si está vacía
        const notaNum = parseFloat(notaStr);
        return !isNaN(notaNum) && notaNum >= NOTA_MINIMA && notaNum <= NOTA_MAXIMA;
    }

    function parseNota(notaStr) {
        // Retorna el número o null si está vacío o inválido (simplificado)
        if (notaStr === null || notaStr.trim() === '') return null;
        const notaNum = parseFloat(notaStr);
        return !isNaN(notaNum) ? notaNum : null;
    }

    function mostrarResultado(divResultado, mensaje, tipo = 'info') {
        divResultado.textContent = mensaje;
        divResultado.className = `resultado ${tipo}`; // Asigna clase para estilo (info, exito, error)
    }

    // --- Lógica para Calcular Nota Final ---
    btnCalcularFinal.addEventListener('click', () => {
        const n1 = nota1Input.value;
        const n2 = nota2Input.value;
        const n3 = nota3Input.value;

        if (!esNotaValida(n1) || !esNotaValida(n2) || !esNotaValida(n3)) {
            mostrarResultado(resultadoFinalDiv, `Error: Todas las notas deben ser números entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`, 'error');
            return;
        }

        const notaNum1 = parseFloat(n1);
        const notaNum2 = parseFloat(n2);
        const notaNum3 = parseFloat(n3);

        const notaFinal = (notaNum1 * PESO_CORTE_1) + (notaNum2 * PESO_CORTE_2) + (notaNum3 * PESO_CORTE_3);

        mostrarResultado(resultadoFinalDiv, `Tu nota final calculada es: ${notaFinal.toFixed(2)}`, 'exito');
    });

    // --- Lógica para Calcular Nota Necesaria ---
    btnCalcularNecesaria.addEventListener('click', () => {
        const notaDeseadaStr = notaDeseadaInput.value;
        const n1ConocidaStr = nota1ConocidaInput.value;
        const n2ConocidaStr = nota2ConocidaInput.value;
        const n3ConocidaStr = nota3ConocidaInput.value;

        // Validar nota deseada
        if (!esNotaValida(notaDeseadaStr)) {
            mostrarResultado(resultadoNecesariaDiv, `Error: La nota final deseada debe ser un número entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`, 'error');
            return;
        }
        const notaDeseada = parseFloat(notaDeseadaStr);

        let sumaPonderadaConocida = 0.0;
        let sumaPesosDesconocidos = 0.0;
        const cortesDesconocidos = [];

        // Procesar Corte 1
        const n1 = parseNota(n1ConocidaStr);
        if (n1 !== null) {
            if (n1 < NOTA_MINIMA || n1 > NOTA_MAXIMA) {
                 mostrarResultado(resultadoNecesariaDiv, `Error: La nota conocida del Corte 1 (${n1}) está fuera del rango [${NOTA_MINIMA}-${NOTA_MAXIMA}].`, 'error'); return;
            }
            sumaPonderadaConocida += n1 * PESO_CORTE_1;
        } else if (n1ConocidaStr.trim() !== '') { // Si no está vacío pero no es número válido
            mostrarResultado(resultadoNecesariaDiv, `Error: El valor '${n1ConocidaStr}' para Corte 1 no es una nota válida. Deja vacío si no la tienes.`, 'error'); return;
        }
        else {
            sumaPesosDesconocidos += PESO_CORTE_1;
            cortesDesconocidos.push("Corte 1");
        }

        // Procesar Corte 2
        const n2 = parseNota(n2ConocidaStr);
        if (n2 !== null) {
             if (n2 < NOTA_MINIMA || n2 > NOTA_MAXIMA) {
                 mostrarResultado(resultadoNecesariaDiv, `Error: La nota conocida del Corte 2 (${n2}) está fuera del rango [${NOTA_MINIMA}-${NOTA_MAXIMA}].`, 'error'); return;
            }
            sumaPonderadaConocida += n2 * PESO_CORTE_2;
        } else if (n2ConocidaStr.trim() !== '') {
             mostrarResultado(resultadoNecesariaDiv, `Error: El valor '${n2ConocidaStr}' para Corte 2 no es una nota válida. Deja vacío si no la tienes.`, 'error'); return;
        } else {
            sumaPesosDesconocidos += PESO_CORTE_2;
            cortesDesconocidos.push("Corte 2");
        }

        // Procesar Corte 3
        const n3 = parseNota(n3ConocidaStr);
        if (n3 !== null) {
             if (n3 < NOTA_MINIMA || n3 > NOTA_MAXIMA) {
                 mostrarResultado(resultadoNecesariaDiv, `Error: La nota conocida del Corte 3 (${n3}) está fuera del rango [${NOTA_MINIMA}-${NOTA_MAXIMA}].`, 'error'); return;
            }
            sumaPonderadaConocida += n3 * PESO_CORTE_3;
        } else if (n3ConocidaStr.trim() !== '') {
             mostrarResultado(resultadoNecesariaDiv, `Error: El valor '${n3ConocidaStr}' para Corte 3 no es una nota válida. Deja vacío si no la tienes.`, 'error'); return;
        }
        else {
            sumaPesosDesconocidos += PESO_CORTE_3;
            cortesDesconocidos.push("Corte 3");
        }

        // --- Calcular la nota necesaria ---

        // Evitar división por cero si todos los pesos son conocidos (aunque debería ser aprox 0)
         // El margen 0.001 es para evitar problemas de precisión con flotantes
        if (sumaPesosDesconocidos < 0.001) {
            const notaFinalReal = sumaPonderadaConocida; // Ya calculada
             if (notaFinalReal >= notaDeseada) {
                 mostrarResultado(resultadoNecesariaDiv, `Ya tienes todas las notas. Tu nota final es ${notaFinalReal.toFixed(2)}, ya cumples o superas tu meta de ${notaDeseada.toFixed(2)}.`, 'exito');
             } else {
                 mostrarResultado(resultadoNecesariaDiv, `Ya tienes todas las notas. Tu nota final es ${notaFinalReal.toFixed(2)}, no alcanzas tu meta de ${notaDeseada.toFixed(2)}.`, 'info');
             }
             return; // Termina aquí si todas las notas son conocidas
        }

        // Calcular puntos necesarios de los cortes restantes
        const puntosFaltantes = notaDeseada - sumaPonderadaConocida;

        // Calcular la nota promedio necesaria
        const notaNecesaria = puntosFaltantes / sumaPesosDesconocidos;

        const nombresCortes = cortesDesconocidos.join(', ');

        // Evaluar y mostrar resultado
        if (notaNecesaria < NOTA_MINIMA) {
             mostrarResultado(resultadoNecesariaDiv, `¡Buenas noticias! Con las notas que tienes, ya superaste o alcanzaste tu meta de ${notaDeseada.toFixed(2)}. Necesitarías ${NOTA_MINIMA.toFixed(2)} o más en ${nombresCortes}.`, 'exito');
        } else if (notaNecesaria > NOTA_MAXIMA) {
            mostrarResultado(resultadoNecesariaDiv, `Imposible alcanzar ${notaDeseada.toFixed(2)}. Necesitarías sacar ${notaNecesaria.toFixed(2)} en promedio en ${nombresCortes}, lo cual supera la nota máxima (${NOTA_MAXIMA.toFixed(2)}).`, 'error');
        } else {
            mostrarResultado(resultadoNecesariaDiv, `Para alcanzar ${notaDeseada.toFixed(2)}, necesitas sacar en promedio ${notaNecesaria.toFixed(2)} en los siguientes cortes: ${nombresCortes}.`, 'info');
        }
    });
});