function agregarRegistroVF() {
    // Llama a la función de Apex a través de la actionFunction
    jsAgregarDireccion(
        document.getElementById('{!$Component.myForm.tipoElemento}').value,
        document.getElementById('{!$Component.myForm.direccionElemento}').value,
        document.getElementById('{!$Component.myForm.coordenadasElemento}').value,
        document.getElementById('{!$Component.myForm.tipoSolicitud}').value
    );
}

function eliminarRegistroVF(index) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        jsEliminarDireccion(index);
    }
}

// Funciones para actualizar checkbox de archivos
function actualizarCheckbox(fileInputId, checkboxId) {
    const fileInput = document.getElementById(fileInputId);
    const checkbox = document.getElementById(checkboxId);

    if (fileInput.files.length > 0) {
        checkbox.checked = true;

        // Llama a las funciones de Apex para subir archivos *solo si hay un archivo*
        if (fileInputId === 'actaFile') {
            subirActaVF();
        }
        if (fileInputId === 'planosFile') {
            subirPlanosVF();
        }
        if (fileInputId === 'fotosFile') {
            subirFotosVF();
        }
        if (fileInputId === 'comprobanteFile') {
            subirComprobanteVF();
        }
        if (fileInputId === 'registroFile') {
            subirRegistroVF();
        }
    } else {
        checkbox.checked = false;
    }
}

function subirActaVF() {
    const fileInput = document.getElementById('{!$Component.myForm.actaFile}');
    if (fileInput.files.length > 0) {
        readFileData(fileInput.files[0], function (base64Data) {
            jsSubirActa(base64Data, fileInput.files[0].name);
        });
    }
}

function subirPlanosVF() {
    const fileInput = document.getElementById('{!$Component.myForm.planosFile}');
    if (fileInput.files.length > 0) {
        readFileData(fileInput.files[0], function (base64Data) {
            jsSubirPlanos(base64Data, fileInput.files[0].name);
        });
    }
}

function subirFotosVF() {
    const fileInput = document.getElementById('{!$Component.myForm.fotosFile}');
    if (fileInput.files.length > 0) {
        readFileData(fileInput.files[0], function (base64Data) {
            jsSubirFotos(base64Data, fileInput.files[0].name);
        });
    }
}

function subirComprobanteVF() {
    const fileInput = document.getElementById('{!$Component.myForm.comprobanteFile}');
    if (fileInput.files.length > 0) {
        readFileData(fileInput.files[0], function (base64Data) {
            jsSubirComprobante(base64Data, fileInput.files[0].name);
        });
    }
}

function subirRegistroVF() {
    const fileInput = document.getElementById('{!$Component.myForm.registroFile}');
    if (fileInput.files.length > 0) {
        readFileData(fileInput.files[0], function (base64Data) {
            jsSubirRegistro(base64Data, fileInput.files[0].name);
        });
    }
}

function readFileData(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
        const base64Data = reader.result.split(',')[1]; // Obtiene solo la parte de datos Base64
        callback(base64Data);
    };
    reader.readAsDataURL(file);
}