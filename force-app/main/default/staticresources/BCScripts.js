mostrarFormulario();

const tiposElementosSeguridad = [
    {
        descripcion: "PORTONES METÁLICOS EN VÍAS PEATONALES",
        tipo: "TIPO 1"
    },
    {
        descripcion: "PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS MENORES A 1,50 METROS",
        tipo: "TIPO 2"
    },
    {
        descripcion: "PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS IGUALES O MAYORES A 1,50 METROS",
        tipo: "TIPO 3"
    },
    {
        descripcion: "OTROS ELEMENTOS DE SEGURIDAD",
        tipo: "OTROS"
    }
];

const tipos_de_solicitus = [
    "Regularización",
    "Primera vez"
];

// Poblar select de tipo de elemento
const selectTipoElemento = document.getElementById('tipoElemento');
tiposElementosSeguridad.forEach(elemento => {
    const option = document.createElement('option');
    option.value = elemento.tipo;
    option.textContent = elemento.descripcion;
    selectTipoElemento.appendChild(option);
});

// Poblar select de tipo de solicitud
const selectTipoSolicitud = document.getElementById('tipoSolicitud');
tipos_de_solicitus.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo.toLowerCase();
    option.textContent = tipo.toUpperCase();
    selectTipoSolicitud.appendChild(option);
});

const registrosElementosSeguridad = [];

// Función para agregar un nuevo registro
function agregarRegistro() {
    const tipoElemento = document.getElementById('tipoElemento').value;
    const direccion = document.getElementById('direccionElemento').value;
    const coordenadas = document.getElementById('coordenadasElemento').value;
    const tipoSolicitud = document.getElementById('tipoSolicitud').value;

    if (!tipoElemento || !direccion || !coordenadas || !tipoSolicitud) {
        alert('Por favor complete todos los campos');
        return;
    }

    const nuevoRegistro = {
        tipoElemento,
        direccion,
        coordenadas,
        tipoSolicitud
    };

    registrosElementosSeguridad.push(nuevoRegistro);
    actualizarTabla();
    limpiarFormularioDirecciones(); // Usamos una función separada para limpiar solo la sección de direcciones.
}

// Función para actualizar la tabla
function actualizarTabla() {
    const contenedorRegistros = document.getElementById('registrosContainer');
    contenedorRegistros.innerHTML = '';

    registrosElementosSeguridad.forEach((registro, index) => {
        const fila = document.createElement('div');
        fila.style.cssText = "display: flex; border-bottom: 1px solid #000080;";

        fila.innerHTML = `
            <div style="flex: 1; padding: 12px; text-align: center; font-size: 0.9rem; border-right: 1px solid #000080;">
                ${registro.tipoElemento}
            </div>
            <div style="flex: 2; padding: 12px; text-align: center; font-size: 0.9rem; border-right: 1px solid #000080;">
                ${registro.direccion}
            </div>
            <div style="flex: 1; padding: 12px; text-align: center; font-size: 0.9rem; border-right: 1px solid #000080;">
                ${registro.coordenadas}
            </div>
            <div style="flex: 1; padding: 12px; text-align: center; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
                ${registro.tipoSolicitud}
                <button onclick="eliminarRegistro(${index})" style="background: none; border: none; color: #dc3545; cursor: pointer;">
                    ❌
                </button>
            </div>
        `;

        contenedorRegistros.appendChild(fila);
    });
}

// Función para eliminar un registro
function eliminarRegistro(index) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        registrosElementosSeguridad.splice(index, 1);
        actualizarTabla();
    }
}

// Función para limpiar el formulario de direcciones
function limpiarFormularioDirecciones() {
    document.getElementById('tipoElemento').value = '';
    document.getElementById('direccionElemento').value = '';
    document.getElementById('coordenadasElemento').value = '';
    document.getElementById('tipoSolicitud').value = '';
}

function actualizarCheckbox(fileInputId, checkboxId) {
    const fileInput = document.getElementById(fileInputId);
    const checkbox = document.getElementById(checkboxId);

    if (fileInput.files.length > 0) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
}

function mostrarFormulario() {
    const tipoFormulario = document.getElementById('tipoFormulario').value;
    const formularioJuridica = document.querySelector('.formulario-juridica');
    const formularioNatural = document.querySelector('.formulario-natural');

    formularioJuridica.style.display = 'none';
    formularioNatural.style.display = 'none';

    if (tipoFormulario === 'juridica') {
        formularioJuridica.style.display = 'block';
    } else if (tipoFormulario === 'natural') {
        formularioNatural.style.display = 'block';
    } else if (tipoFormulario === '') {
        formularioJuridica.style.display = 'none';
        formularioNatural.style.display = 'none';
    }
}

// Función para limpiar todos los campos del formulario (tanto jurídica como natural)
function limpiarTodosLosCampos() {
    // Limpiar campos de persona jurídica
    document.getElementById('nombreEmpresaJuridica').value = '';
    document.getElementById('rucJuridica').value = '';
    document.getElementById('direccionJuridica').value = '';
    document.getElementById('correoJuridica').value = '';
    document.getElementById('telefonoJuridica').value = '';
    document.getElementById('representanteLegalJuridica').value = '';
    document.getElementById('identificacionRepresentanteJuridica').value = '';
    document.getElementById('registroFile').value = ''; // Limpiar input file
    document.getElementById('registroCheckbox').checked = false;


    // Limpiar campos de persona natural
    document.getElementById('nombresApellidosNatural').value = '';
    document.getElementById('ccNatural').value = '';
    document.getElementById('direccionNatural').value = '';
    document.getElementById('correoNatural').value = '';
    document.getElementById('telefonoNatural').value = '';

    // Limpiar los requisitos (asumiendo que tienes IDs para esos inputs)
    document.getElementById('actaFile').value = '';
    document.getElementById('actaCheckbox').checked = false;
    document.getElementById('planosFile').value = '';
    document.getElementById('planosCheckbox').checked = false;
    document.getElementById('fotosFile').value = '';
    document.getElementById('fotosCheckbox').checked = false;
    document.getElementById('comprobanteFile').value = '';
    document.getElementById('comprobanteCheckbox').checked = false;


    // Limpiar la tabla de direcciones (ya la tienes en limpiarFormularioDirecciones)
    limpiarFormularioDirecciones();
    registrosElementosSeguridad.length = 0; // Vaciar el array
    actualizarTabla();  // Actualizar la tabla para que se muestre vacía

    // Limpiar checkbox de términos y condiciones
    document.getElementById('aceptaTerminos').checked = false;

}


function enviarFormulario() {
    if (!document.getElementById('aceptaTerminos').checked) {
        //NO USAR ALERT
        //alert('Por favor, acepta los términos y condiciones para continuar.');
        //return; // Detener la ejecución si no se aceptan los términos
        //Llamamos al metodo remoto
        mostrarMensajeErrorJS('Por favor, acepta los términos y condiciones para continuar.');
        return;
    }
    //Llamamos al metodo remoto
    mostrarMensajeConfirmacionJS();
    //alert('Formulario enviado.  (En una implementación real, aquí se enviarían los datos)');

    // Limpiar todos los campos después de enviar
    limpiarTodosLosCampos();
    //Ocultamos los formularios
    mostrarFormulario();
}

// Definir las funciones de JavaScript que llaman a los métodos remotos del controlador
function mostrarMensajeErrorJS(mensaje) {
    //Llamamos a la accion del controlador.
    MiControlador.mostrarMensajeError(mensaje, function (result, event) {
        if (event.status) {
            // Actualizar la sección de mensajes en la página (si es necesario)
            // Si usas <apex:pageMessages />, se actualizará automáticamente.
        } else if (event.type === 'exception') {
            console.log("Excepción: " + event.message); // Manejar la excepción
        }
    });
}

function mostrarMensajeConfirmacionJS() {
    //Llamamos a la accion del controlador.
    MiControlador.mostrarMensajeConfirmacion(function (result, event) {
        if (event.status) {

        } else if (event.type === 'exception') {
            console.log("Excepción: " + event.message); // Manejar la excepción
        }
    });
}