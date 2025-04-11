document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('excelFile');
    const uploadMessage = document.getElementById('upload-message');
    const studentListContainer = document.getElementById('studentListContainer');
    const studentListUl = document.getElementById('studentList');
    const listSection = document.getElementById('list-section');
    const groupSection = document.getElementById('group-section');
    const numGroupsInput = document.getElementById('numGroups');
    const generateGroupsBtn = document.getElementById('generateGroupsBtn');
    const groupResultsDiv = document.getElementById('groupResults');
    const groupWarning = document.getElementById('group-warning');
    const fileNameDisplay = document.getElementById('file-name-display'); // Nuevo elemento

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    let students = []; // Array para almacenar { name: '...', gender: 'F'/'M' }

    fileInput.addEventListener('change', handleFile);

    function handleFile(event) {
        const file = event.target.files[0];
        resetUI(); // Limpia la UI antes de procesar nuevo archivo

        if (!file) {
            setMessage('No se seleccionó ningún archivo.', 'error');
            fileNameDisplay.textContent = ''; // Limpiar nombre archivo
            return;
        }

        // Mostrar nombre del archivo seleccionado
        fileNameDisplay.textContent = `Archivo seleccionado: ${file.name}`;

        // Validación de tipo de archivo
        const allowedExtensions = /(\.xlsx|\.xls)$/i;
        if (!allowedExtensions.exec(file.name)) {
            setMessage('Archivo no compatible. Por favor, sube un archivo .xlsx o .xls.', 'error');
            fileInput.value = ''; // Resetear el input
            fileNameDisplay.textContent = ''; // Limpiar nombre archivo
            return;
        }

        // Validación de tamaño
        if (file.size > MAX_FILE_SIZE) {
            setMessage(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El máximo permitido es 50 MB.`, 'error');
            fileInput.value = ''; // Resetear el input
             fileNameDisplay.textContent = ''; // Limpiar nombre archivo
            return;
        }

        setMessage('Procesando archivo...', 'info'); // Mensaje temporal

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

                students = [];
                let rowCount = 0;
                for (const row of jsonData) {
                    rowCount++;
                    if (row && row.length >= 2) {
                        const name = String(row[0]).trim();
                        const genderRaw = String(row[1]).trim().toUpperCase();
                        if (name && (genderRaw === 'F' || genderRaw === 'M')) {
                            students.push({ name: name, gender: genderRaw });
                        } else if (name || genderRaw) {
                           console.warn(`Fila ${rowCount} ignorada: Datos incompletos o género inválido ('${row[1]}'). Nombre: '${name}'`);
                        }
                    }
                }

                if (students.length === 0) {
                   setMessage('No se encontraron estudiantes válidos en el archivo. Asegúrate que la Columna A tenga nombres y la B tenga "F" o "M".', 'error');
                   fileNameDisplay.textContent = ''; // Limpiar nombre si no hay estudiantes
                   return;
                }

                students.sort((a, b) => a.name.localeCompare(b.name));
                setMessage(`Carga exitosa. ${students.length} estudiantes cargados.`, 'success');
                displayStudentList();
                showSections();

            } catch (error) {
                console.error("Error procesando el archivo Excel:", error);
                setMessage('Error al procesar el archivo Excel. Asegúrate que el formato sea correcto.', 'error');
                resetUI();
                 fileNameDisplay.textContent = ''; // Limpiar nombre archivo en error
            }
        };

        reader.onerror = function(e) {
            console.error("Error leyendo el archivo:", e);
            setMessage('Ocurrió un error al leer el archivo.', 'error');
            resetUI();
             fileNameDisplay.textContent = ''; // Limpiar nombre archivo en error
        };

        reader.readAsArrayBuffer(file);
    }

    function displayStudentList() {
        studentListUl.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            // Creamos un span para el nombre para poder usar flexbox mejor
            const nameSpan = document.createElement('span');
            nameSpan.textContent = student.name;
            li.appendChild(nameSpan);
             // La clase .gender-f o .gender-m en el li activará el ::after del CSS
            li.classList.add(student.gender === 'F' ? 'gender-f' : 'gender-m');
            studentListUl.appendChild(li);
        });
    }

    function showSections() {
        listSection.style.display = 'block';
        groupSection.style.display = 'block';
        generateGroupsBtn.disabled = false;
        numGroupsInput.max = students.length;
        if (parseInt(numGroupsInput.value) > students.length) {
            numGroupsInput.value = Math.max(1, students.length);
        }
        // Scroll suave a la sección de lista (opcional)
        listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function resetUI() {
        setMessage('', 'info');
        listSection.style.display = 'none';
        groupSection.style.display = 'none';
        studentListUl.innerHTML = '';
        groupResultsDiv.innerHTML = '';
        groupWarning.textContent = '';
        groupWarning.style.display = 'none';
        groupWarning.className = 'message warning';
        generateGroupsBtn.disabled = true;
        students = [];
        // No reseteamos fileInput.value aquí para no forzar nueva selección si solo fue error de procesamiento
        // Pero sí limpiamos el nombre de archivo mostrado si ya no es relevante
        if (!fileInput.files || fileInput.files.length === 0) {
             fileNameDisplay.textContent = '';
        }
    }

    function setMessage(msg, type) {
        uploadMessage.textContent = msg;
        uploadMessage.className = `message ${type}`;
        // Asegurarse que el mensaje sea visible
        uploadMessage.style.display = msg ? 'block' : 'none';
    }

     // --- Lógica de Generación de Grupos (SIN CAMBIOS) ---

    generateGroupsBtn.addEventListener('click', () => {
        const numGroups = parseInt(numGroupsInput.value);
        groupResultsDiv.innerHTML = '';
        groupWarning.textContent = '';
        groupWarning.style.display = 'none';

        if (isNaN(numGroups) || numGroups <= 0) {
            setMessageInGroupSection("Por favor, introduce un número válido de grupos (mayor que 0).", "error"); // Usar mensaje en sección
            return;
        }

        if (numGroups > students.length) {
            setMessageInGroupSection(`No puedes crear ${numGroups} grupos con solo ${students.length} estudiantes.`, "error");
            return;
        }

        // Limpiar mensaje de error si la validación pasa
        setMessageInGroupSection('', 'info');

        const generatedGroups = createRandomGroups(numGroups);
        displayGroups(generatedGroups.groups, generatedGroups.warningMessages);
         // Scroll suave a los resultados (opcional)
        groupResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Función auxiliar para mostrar mensajes dentro de la sección de grupos (p.ej., errores de validación del número)
    function setMessageInGroupSection(msg, type) {
         groupWarning.textContent = msg;
         groupWarning.className = `message ${type}`; // Usa las mismas clases que los otros mensajes
         groupWarning.style.display = msg ? 'block' : 'none';
    }


    function createRandomGroups(numGroups) {
        let currentStudents = [...students];
        let women = currentStudents.filter(s => s.gender === 'F');
        let men = currentStudents.filter(s => s.gender === 'M');
        const warningMessages = [];

        shuffleArray(women);
        shuffleArray(men);

        const groups = Array.from({ length: numGroups }, () => []);
        let womenAvailable = women.length;
        let menAvailable = men.length;
        const originalWomenCount = students.filter(s => s.gender === 'F').length; // Contar mujeres originales

        // 1. Asignar una mujer a cada grupo (si es posible)
        for (let i = 0; i < numGroups; i++) {
            if (womenAvailable > 0) {
                groups[i].push(women.pop());
                womenAvailable--;
            } else if (menAvailable > 0) {
                const assignedMan = men.pop();
                groups[i].push(assignedMan);
                menAvailable--;
                 // Advertir SOLO si REALMENTE se necesitaban mujeres y se acabaron
                 if (originalWomenCount > 0 && i < originalWomenCount) { // Si había mujeres y este grupo "debería" haber tenido una
                    const msg = `Advertencia: Grupo ${i + 1} iniciado con un hombre (${assignedMan.name}) por falta de mujeres disponibles.`;
                     if(!warningMessages.some(w => w.startsWith(`Advertencia: Grupo ${i + 1}`))) warningMessages.push(msg); // Evitar duplicados exactos para el mismo grupo
                 } else if (originalWomenCount === 0 && i===0) { // Si NUNCA hubo mujeres, advertir una vez
                     const msg = "Advertencia: No hay mujeres en la lista, los grupos se iniciaron con hombres.";
                     if(!warningMessages.includes(msg)) warningMessages.push(msg);
                 }

            } else {
                 console.error("Error: No hay suficientes estudiantes para asignar al menos uno por grupo.");
                 warningMessages.push("Error interno: No hay suficientes estudiantes para la asignación inicial.");
                return { groups: [], warningMessages };
            }
        }

        // 2. Juntar los hombres y mujeres restantes
        let remainingStudents = [...women, ...men];
        shuffleArray(remainingStudents);

        // 3. Distribuir los restantes equitativamente (round-robin)
        let groupIndex = 0;
        remainingStudents.forEach(student => {
            // Asegurarse de que groupIndex no exceda numGroups (puede pasar si hay error previo)
            if (groupIndex % numGroups < groups.length) {
                groups[groupIndex % numGroups].push(student);
                groupIndex++;
            }
        });

        groups.forEach(group => group.sort((a, b) => a.name.localeCompare(b.name)));
        return { groups, warningMessages };
    }

    function displayGroups(groups, warnings) {
         groupResultsDiv.innerHTML = '';

         if (warnings && warnings.length > 0) {
             // Mostramos las advertencias usando el mismo estilo de mensaje
             groupWarning.innerHTML = warnings.join('<br>');
             groupWarning.className = 'message warning'; // Aseguramos la clase correcta
             groupWarning.style.display = 'block';
         } else {
             groupWarning.style.display = 'none'; // Ocultar si no hay advertencias
         }

        if (!groups || groups.length === 0 && !(warnings && warnings.some(w => w.includes("Error interno")))) {
            // Si no hay grupos Y no fue por error interno, mostrar mensaje genérico
             setMessageInGroupSection("No se pudieron generar grupos con los datos actuales.", "info");
             return;
        } else if (!groups || groups.length === 0) {
            // Si no hay grupos Y FUE por error interno, el mensaje de error ya está en 'warnings'
            return;
        }


        groups.forEach((group, index) => {
            const groupBox = document.createElement('div');
            groupBox.classList.add('group-box');

            const title = document.createElement('h3');
            title.textContent = `Grupo ${index + 1}`;
            groupBox.appendChild(title);

            const memberList = document.createElement('ul');
            group.forEach(student => {
                const li = document.createElement('li');
                // Span para el nombre para mejor control con flexbox
                 const nameSpan = document.createElement('span');
                 nameSpan.textContent = student.name;
                 li.appendChild(nameSpan);
                 // Añadimos clase para el ::after CSS que indica género
                li.classList.add(student.gender === 'F' ? 'gender-f' : 'gender-m');
                memberList.appendChild(li);
            });

            groupBox.appendChild(memberList);
            groupResultsDiv.appendChild(groupBox);
        });
    }

    // Función para mezclar un array (Algoritmo Fisher-Yates) - SIN CAMBIOS
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

});