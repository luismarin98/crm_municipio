// --- Data for Dropdowns ---
const tiposElementosSeguridad = [
    { descripcion: "PORTONES METÁLICOS EN VÍAS PEATONALES", tipo: "TIPO 1" },
    { descripcion: "PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS MENORES A 1,50 METROS", tipo: "TIPO 2" },
    { descripcion: "PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS IGUALES O MAYORES A 1,50 METROS", tipo: "TIPO 3" },
    { descripcion: "OTROS ELEMENTOS DE SEGURIDAD", tipo: "OTROS" }
];

const tipos_de_solicitus = [
    "Regularización",
    "Primera vez",
    "Renovación"
];

// --- Array to Store Added Rows ---
const registrosElementosSeguridad = [];

// --- Function to Add a New Row ---
function agregarRegistro(event) {
    if (event) {
        event.preventDefault(); // Prevent form submission
    }

    // Get references to the select elements
    const tipoElementoSelect = document.getElementById('tipoElemento');
    const tipoSolicitudSelect = document.getElementById('tipoSolicitud');

    // Get the input values
    const direccion = document.getElementById('direccionElemento').value;
    const latitud = document.getElementById('latitudElemento').value;
    const longitud = document.getElementById('longitudElemento').value;

    // Get selected *text* from dropdowns (for display)
    const tipoElementoText = tipoElementoSelect.options[tipoElementoSelect.selectedIndex].text;
    const tipoSolicitudText = tipoSolicitudSelect.options[tipoSolicitudSelect.selectedIndex].text;

    // Get selected *values* from dropdowns (for potential server-side use)
    const tipoElementoValue = tipoElementoSelect.value;
    const tipoSolicitudValue = tipoSolicitudSelect.value;
    // Validate: Ensure all fields are filled
    if (!tipoElementoValue || !direccion || !latitud || !longitud || !tipoSolicitudValue) {
        mostrarMensajeErrorJS('Por favor complete todos los campos del registro'); // Use your error function
        return;
    }

    // Combine latitude and longitude
    const coordenadas = `${latitud}, ${longitud}`;

    // Create the new record object
    registrosElementosSeguridad.push({
        tipoElemento: tipoElementoText, // Store the text
        direccion,
        coordenadas,
        tipoSolicitud: tipoSolicitudText // Store the text
    });

    // Update the table
    actualizarTabla();

    // Clear *only* the input fields, *NOT* the dropdowns
    document.getElementById('direccionElemento').value = '';
    document.getElementById('latitudElemento').value = '';
    document.getElementById('longitudElemento').value = '';
}

// --- Function to Delete a Row ---
function eliminarRegistro(index) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        registrosElementosSeguridad.splice(index, 1); // Remove the correct element
        actualizarTabla(); // Re-render the table
    }
}

// --- Function to Update Checkbox Based on File Input ---
function actualizarCheckbox(fileId, checkboxId) {
    const archivo = document.getElementById(fileId);
    const checkbox = document.getElementById(checkboxId);

    checkbox.checked = archivo.files.length > 0; // Concise way to set checked state
}

// --- Function to Show/Hide Forms Based on Type ---
function mostrarFormulario() {
    const tipoSeleccionado = document.getElementById('tipoFormulario').value;
    const formularioJuridica = document.querySelector('.formulario-juridica');
    const formularioNatural = document.querySelector('.formulario-natural');

    // Remove 'visible' class first
    formularioJuridica.classList.remove('visible');
    formularioNatural.classList.remove('visible');

    // Use setTimeout for CSS transitions (optional, but nice)
    setTimeout(() => {
        formularioJuridica.style.display = 'none';
        formularioNatural.style.display = 'none';

        if (tipoSeleccionado === 'juridica') {
            formularioJuridica.style.display = 'block';
            formularioJuridica.offsetHeight; // Trigger reflow (for transitions)
            formularioJuridica.classList.add('visible');
        } else if (tipoSeleccionado === 'natural') {
            formularioNatural.style.display = 'block';
            formularioNatural.offsetHeight; // Trigger reflow
            formularioNatural.classList.add('visible');
        }
    }, 300); // Match CSS transition time
}


// --- Function to Clear *ALL* Form Fields (for Reset/Submit) ---
function limpiarTodosLosCampos() {
    // Arrays of element IDs for easier clearing
    const camposJuridica = [
        'nombreEmpresaJuridica', 'rucJuridica', 'direccionJuridica',
        'correoJuridica', 'telefonoJuridica', 'representanteLegalJuridica',
        'identificacionRepresentanteJuridica'
    ];

    const camposNatural = [
        'nombresApellidosNatural', 'ccNatural', 'direccionNatural',
        'correoNatural', 'telefonoNatural'
    ];

    const archivos = [
        'registroFile', 'actaFile', 'planosFile', 'fotosFile', 'comprobanteFile'
    ];

    const checkboxes = [
        'registroCheckbox', 'actaCheckbox', 'planosCheckbox', 'fotosCheckbox', 'comprobanteCheckbox'
    ];

    // Clear fields, handling potential null elements
    camposJuridica.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = '';
    });
    camposNatural.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = '';
    });
    archivos.forEach(archivo => {
        const elemento = document.getElementById(archivo);
        if (elemento) elemento.value = '';
    });
    checkboxes.forEach(checkbox => {
        const elemento = document.getElementById(checkbox);
        if (elemento) elemento.checked = false;
    });

    // Clear the added rows table
    limpiarFormularioDirecciones(); // Clear input fields in the "add row" section
    registrosElementosSeguridad.length = 0; // Empty the array
    actualizarTabla();  // Re-render the table (now empty)

    // Clear terms and conditions checkbox
    const aceptaTerminos = document.getElementById('aceptaTerminos');
    if (aceptaTerminos) aceptaTerminos.checked = false;
}

// --- Function to Clear *ONLY* Address Input Fields ---
// **CORRECTED:** This now *only* clears the input fields, NOT the dropdowns
function limpiarFormularioDirecciones() {
    document.getElementById('direccionElemento').value = '';
    document.getElementById('latitudElemento').value = '';
    document.getElementById('longitudElemento').value = '';
    // *DO NOT* clear tipoElemento and tipoSolicitud here!
}

// --- Validation Functions ---
function validarFormulario() {
    const tipoPersona = document.getElementById('tipoFormulario').value;
    if (!tipoPersona) {
        mostrarMensajeErrorJS('Debe seleccionar un tipo de persona');
        return false;
    }

    if (!document.getElementById('aceptaTerminos').checked) {
        mostrarMensajeErrorJS('Debe aceptar los términos y condiciones');
        return false;
    }

    if (tipoPersona === 'juridica') {
        return validarFormularioJuridica();
    } else if (tipoPersona === 'natural') {
        return validarFormularioNatural();
    }

    return true; // Should not reach here, but allow for flexibility
}

function enviarFormulario() {
    if (!validarFormulario()) {
        return;
    }
    if (!validarArchivosRequeridos()) {
        return;
    }

    mostrarMensajeConfirmacionJS(); // Replace with your submission logic
    limpiarTodosLosCampos();
    mostrarFormulario();
}

function validarFormularioJuridica() {
    const campos = [
        'nombreEmpresaJuridica', 'rucJuridica', 'direccionJuridica',
        'correoJuridica', 'telefonoJuridica', 'representanteLegalJuridica',
        'identificacionRepresentanteJuridica'
    ];
    return validarCamposRequeridos(campos, 'jurídica');
}

function validarFormularioNatural() {
    const campos = [
        'nombresApellidosNatural', 'ccNatural', 'direccionNatural',
        'correoNatural', 'telefonoNatural'
    ];
    return validarCamposRequeridos(campos, 'natural');
}

function validarCamposRequeridos(campos, tipoPersona) {
    for (const campo of campos) {
        if (!document.getElementById(campo).value) {
            mostrarMensajeErrorJS(`Todos los campos son requeridos para persona ${tipoPersona}`);
            return false;
        }
    }
    return true;
}

function validarArchivosRequeridos() {
    const checkboxes = [
        'actaCheckbox', 'planosCheckbox', 'fotosCheckbox', 'comprobanteCheckbox'
    ];
    for (const checkbox of checkboxes) {
        if (!document.getElementById(checkbox).checked) {
            mostrarMensajeErrorJS('Debe cargar todos los archivos requeridos');
            return false;
        }
    }
    return true;
}

// --- Function to Update the Table ---
function actualizarTabla() {
    const contenedorRegistros = document.getElementById('registrosContainer');
    contenedorRegistros.innerHTML = ''; // Clear existing rows

    registrosElementosSeguridad.forEach((registro, index) => {
        const fila = document.createElement('div');
        fila.classList.add('tabla-fila-entrada');

        fila.innerHTML = `
            <div class="tabla-celda-entrada">${registro.tipoElemento}</div>
            <div class="tabla-celda-entrada">${registro.direccion}</div>
            <div class="tabla-celda-entrada">${registro.coordenadas}</div>
            <div class="tabla-celda-entrada">${registro.tipoSolicitud}</div>
            <div class="tabla-celda-entrada">
                <button onclick="eliminarRegistro(${index})" class="eliminar-registro">
                    Eliminar
                </button>
            </div>
        `;
        contenedorRegistros.appendChild(fila);
    });
}

// --- Placeholder Functions for Messages (Replace with your implementation) ---
function mostrarMensajeErrorJS(mensaje) {
    alert(mensaje); // Replace with, e.g., a modal or a message div
}

function mostrarMensajeConfirmacionJS() {
    alert('Formulario enviado correctamente.'); // Replace with your logic
}

// --- DOMContentLoaded Event: Populate Dropdowns and Initial Setup ---
document.addEventListener('DOMContentLoaded', function () {

    // Populate "Tipo de Elemento" dropdown
    const tipoElementoSelect = document.getElementById('tipoElemento');
    tipoElementoSelect.innerHTML = '<option value="">Seleccione...</option>'; // Add default option
    tiposElementosSeguridad.forEach(elemento => {
        const option = document.createElement('option');
        option.value = elemento.tipo; // Use 'tipo' as the value
        option.textContent = elemento.descripcion; // Use 'descripcion' as the text
        tipoElementoSelect.appendChild(option);
    });

    // Populate "Tipo de Solicitud" dropdown
    const tipoSolicitudSelect = document.getElementById('tipoSolicitud');
    tipoSolicitudSelect.innerHTML = '<option value="">Seleccione...</option>'; // Add default option
    tipos_de_solicitus.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo; // Use the type itself as the value
        option.textContent = tipo.toUpperCase();
        tipoSolicitudSelect.appendChild(option);
    });

    // Ensure forms are initially hidden
    const formularioJuridica = document.querySelector('.formulario-juridica');
    const formularioNatural = document.querySelector('.formulario-natural');
    if (formularioJuridica) formularioJuridica.style.display = 'none';
    if (formularioNatural) formularioNatural.style.display = 'none';

    // Call mostrarFormulario to handle initial visibility (if needed)
    mostrarFormulario();
});