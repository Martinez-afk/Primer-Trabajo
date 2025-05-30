document.addEventListener('DOMContentLoaded', () => {
    const nombreParticipanteInput = document.getElementById('nombreParticipante');
    const agregarParticipanteBtn = document.getElementById('agregarParticipanteBtn');
    const listaParticipantesUI = document.getElementById('listaParticipantes');
    const numeroEquiposInput = document.getElementById('numeroEquipos');
    const generarEquiposBtn = document.getElementById('generarEquiposBtn');
    const resultadoEquiposUI = document.getElementById('resultadoEquipos');

    let participantes = []; // Array para almacenar los nombres de los participantes

    // --- FUNCIONES ---

    /**
     * Función para renderizar la lista de participantes en el UI.
     */
    function renderizarParticipantes() {
        listaParticipantesUI.innerHTML = ''; // Limpiar la lista actual
        participantes.forEach((participante, index) => {
            const li = document.createElement('li');
            li.textContent = participante;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Eliminar';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => eliminarParticipante(index); // Asignar función de eliminar

            li.appendChild(removeBtn);
            listaParticipantesUI.appendChild(li);
        });
    }

    /**
     * Función para agregar un participante al array y actualizar el UI.
     */
    function agregarParticipante() {
        const nombre = nombreParticipanteInput.value.trim();
        if (nombre === "") {
            alert("Por favor, ingresa un nombre.");
            return;
        }
        if (participantes.includes(nombre)) {
            alert("Este participante ya ha sido añadido.");
            return;
        }
        participantes.push(nombre);
        renderizarParticipantes();
        nombreParticipanteInput.value = ''; // Limpiar input
        nombreParticipanteInput.focus();
    }
    
    /**
     * Función para eliminar un participante del array y actualizar el UI.
     * @param {number} index - El índice del participante a eliminar.
     */
    function eliminarParticipante(index) {
        participantes.splice(index, 1); // Elimina 1 elemento en el índice 'index'
        renderizarParticipantes();
    }

    /**
     * Función para barajar (desordenar) un array.
     * Utiliza el algoritmo Fisher-Yates.
     * @param {Array} array - El array a barajar.
     * @returns {Array} El array barajado.
     */
    function barajarArray(array) {
        let arrayCopia = [...array]; // Copiar para no modificar el original directamente
        for (let i = arrayCopia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopia[i], arrayCopia[j]] = [arrayCopia[j], arrayCopia[i]]; // Intercambio
        }
        return arrayCopia;
    }

    /**
     * Función para generar y mostrar los equipos.
     */
    function generarEquipos() {
        if (participantes.length === 0) {
            alert("Añade participantes primero.");
            return;
        }

        const numEquipos = parseInt(numeroEquiposInput.value);
        if (isNaN(numEquipos) || numEquipos <= 0) {
            alert("Número de equipos inválido.");
            return;
        }
        if (numEquipos > participantes.length) {
            alert("No puedes tener más equipos que participantes.");
            return;
        }

        const participantesBarajados = barajarArray(participantes);
        const equipos = []; // Array de arrays (cada subarray es un equipo)

        // Inicializar los equipos (array de arrays vacíos)
        for (let i = 0; i < numEquipos; i++) {
            equipos.push([]);
        }

        // Distribuir participantes en los equipos
        let equipoActual = 0;
        participantesBarajados.forEach(participante => {
            equipos[equipoActual].push(participante);
            equipoActual = (equipoActual + 1) % numEquipos; // Avanza al siguiente equipo de forma circular
        });

        // Mostrar los equipos en el UI
        resultadoEquiposUI.innerHTML = ''; // Limpiar resultados anteriores
        equipos.forEach((equipo, index) => {
            const divEquipo = document.createElement('div');
            divEquipo.classList.add('equipo');

            const h3 = document.createElement('h3');
            h3.textContent = `Equipo ${index + 1}`;
            divEquipo.appendChild(h3);

            const ul = document.createElement('ul');
            equipo.forEach(miembro => {
                const li = document.createElement('li');
                li.textContent = miembro;
                ul.appendChild(li);
            });
            divEquipo.appendChild(ul);
            resultadoEquiposUI.appendChild(divEquipo);
        });
    }

    // --- EVENT LISTENERS ---
    agregarParticipanteBtn.addEventListener('click', agregarParticipante);
    nombreParticipanteInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            agregarParticipante();
        }
    });
    generarEquiposBtn.addEventListener('click', generarEquipos);

    // Inicializar la lista de participantes (vacía al principio)
    renderizarParticipantes();
});