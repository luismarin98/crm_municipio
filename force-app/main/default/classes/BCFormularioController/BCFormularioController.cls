public class BCFormularioController {
    
    // Usamos el objeto estándar Case
    public Case caso { get; set; }
    
    // Lista para almacenar los registros de direcciones (¡OBJETO PERSONALIZADO!)
    public List<BCDireccionElemento__c> direcciones { get; set; }
    
    // Variables auxiliares para el formulario de direcciones (Prefijo 'aux')
    public String auxTipoElemento { get; set; }
    public String auxDireccionElemento { get; set; }
    public String auxCoordenadasElemento { get; set; }
    public String auxTipoSolicitud { get; set; }
    
    // Record Type IDs (¡Se obtienen los valores de la org!)
    public Id recordTypeIdJuridica { get; set; }
    public Id recordTypeIdNatural { get; set; }
    
    // Listas para los picklists (tipo de elemento, tipo de solicitud)
    //(El tipo de formulario ahora se maneja con Record Types)
    public List<SelectOption> opcionesTipoElemento { get; set; }
    public List<SelectOption> opcionesTipoSolicitud { get; set; }
    
    // --- Variables para la Cuenta (Persona Jurídica) ---
    public String cuentaNombreEmpresa { get; set; }       // Nombre de la empresa
    public String cuentaRuc { get; set; }                // RUC de la empresa
    public String cuentaDireccion { get; set; }          // Dirección de la empresa
    public String cuentaCorreoElectronico { get; set; }  // Correo electrónico de la empresa
    public String cuentaTelefono { get; set; }           // Teléfono de la empresa
    public String cuentaRepresentanteLegal { get; set; } // Representante legal
    public String cuentaIdentificacionRL { get; set; }  // Identificación del representante legal
    
    
    // --- Variables para el Contacto (Persona Natural o Representante de Jurídica) ---
    public String contactoNombres { get; set; }
    public String contactoApellidos { get; set; }
    public String contactoIdentificacion { get; set; } // CC o RUC (según sea el caso)
    public String contactoDireccion { get; set; }
    public String contactoCorreoElectronico { get; set; }
    public String contactoTelefono { get; set; }
    
    
    // --- Variables para la gestion de archivos (Prefijo 'archivo') ---
    public Blob archivoActa { get; set; }
    public String archivoActaFileName { get; set; }
    
    public Blob archivoPlanos { get; set; }
    public String archivoPlanosFileName { get; set; }
    
    public Blob archivoFotos { get; set; }
    public String archivoFotosFileName { get; set; }
    
    public Blob archivoComprobante { get; set; }
    public String archivoComprobanteFileName { get; set; }
    
    public Blob archivoRegistro { get; set; }
    public String archivoRegistroFileName { get; set; }
    
    
    // Constructor
    public BCFormularioController() {
        caso = new Case();
        direcciones = new List<BCDireccionElemento__c>();
        // Inicializar variables auxiliares (ya no son necesarias con el binding directo)
        
        // --- OBTENER LOS RECORD TYPE IDs ---
        // Se obtienen de forma dinamica para evitar problemas al cambiar de entornos.
        recordTypeIdJuridica = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('BCPersonaJuridica').getRecordTypeId();
        recordTypeIdNatural = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('BCPersonaNatural').getRecordTypeId();
        
        // --- Poblar los picklists ---
        // (El tipo de formulario ahora lo manejamos con el Record Type)
        opcionesTipoElemento = new List<SelectOption>();
        opcionesTipoElemento.add(new SelectOption('', 'Seleccione...'));
        opcionesTipoElemento.add(new SelectOption('TIPO 1', 'PORTONES METÁLICOS EN VÍAS PEATONALES'));
        opcionesTipoElemento.add(new SelectOption('TIPO 2', 'PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS MENORES A 1,50 METROS'));
        opcionesTipoElemento.add(new SelectOption('TIPO 3', 'PORTONES METÁLICOS EN CALLES VEHICULARES CON ACERAS IGUALES O MAYORES A 1,50 METROS'));
        opcionesTipoElemento.add(new SelectOption('OTROS', 'OTROS ELEMENTOS DE SEGURIDAD'));
        
        opcionesTipoSolicitud = new List<SelectOption>();
        opcionesTipoSolicitud.add(new SelectOption('', 'Seleccione...'));
        opcionesTipoSolicitud.add(new SelectOption('REGULARIZACIÓN', 'REGULARIZACIÓN'));
        opcionesTipoSolicitud.add(new SelectOption('PRIMERA VEZ', 'PRIMERA VEZ'));
    }
    // --- Método para agregar una dirección a la lista ---
    public void agregarDireccion() {
        // Crear un nuevo objeto BCDireccionElemento__c
        BCDireccionElemento__c nuevaDireccion = new BCDireccionElemento__c();
        nuevaDireccion.BCTipoElemento__c = auxTipoElemento;
        nuevaDireccion.BCDireccion__c = auxDireccionElemento;
        nuevaDireccion.BCCoordenadas__c = auxCoordenadasElemento;
        nuevaDireccion.BCTipoSolicitud__c = auxTipoSolicitud;
        // No asignamos Solicitud__c (el campo de relación) aquí, se hará al guardar
        
        // Agregar a la lista
        direcciones.add(nuevaDireccion);
        
        // Limpiar las variables auxiliares
        auxTipoElemento = '';
        auxDireccionElemento = '';
        auxCoordenadasElemento = '';
        auxTipoSolicitud = '';
    }
    
    
    // --- Método para eliminar una dirección ---
    public void eliminarDireccion() {
        // Obtener el índice de la dirección a eliminar (desde un parámetro de la página)
        Integer index = Integer.valueOf(ApexPages.currentPage().getParameters().get('index'));
        
        // Eliminar de la lista (validar que el índice sea válido)
        if (index >= 0 && index < direcciones.size()) {
            direcciones.remove(index);
        }
    }
    
    
    
    // --- Método principal para guardar el caso ---
    public PageReference guardar() {
        try {
            // --- 1.  Gestionar la Cuenta (si es persona jurídica) ---
            Account cuenta;
            if (caso.RecordTypeId == recordTypeIdJuridica) {
                // Buscar por Nombre y RUC *simultáneamente*
                List<Account> cuentas = [
                    SELECT Id
                    FROM Account
                    WHERE Name = :cuentaNombreEmpresa AND BCNumeroIdentificacion__c = :cuentaRuc
                ];
                
                if (cuentas.isEmpty()) {
                    // Crear una nueva cuenta
                    cuenta = new Account(
                        Name = cuentaNombreEmpresa,
                    BCRepresentanteLegal__c = cuentaRepresentanteLegal,
                    BCNumeroIdentificacion__c = cuentaRuc,
                    BCDireccion__c = cuentaDireccion,
                    Phone = cuentaTelefono,
                    BCEmail__c = cuentaCorreoElectronico
                        );
                    insert cuenta;
                } else {
                    cuenta = cuentas[0]; // Usar la cuenta existente
                }
                caso.AccountId = cuenta.Id; // Asociar el caso a la cuenta
            }
            
            // --- 2. Gestionar el Contacto ---
            Contact contacto;
            List<Contact> contactos;
            
            if (caso.RecordTypeId == recordTypeIdJuridica) {
                // Buscar por correo en la cuenta
                contactos = [
                    SELECT Id
                    FROM Contact
                    WHERE Email = :contactoCorreoElectronico AND AccountId = :caso.AccountId
                ];
            } else {
                // Buscar por correo en todos los contactos
                contactos = [SELECT Id FROM Contact WHERE Email = :contactoCorreoElectronico];
            }
            if (contactos.isEmpty()) {
                // Crear nuevo contacto
                contacto = new Contact(
                    FirstName = contactoNombres,
                LastName = contactoApellidos,
                Email = contactoCorreoElectronico,
                Phone = contactoTelefono,  // Usar el telefono del contacto
                BCDireccion__c = contactoDireccion //Se guarda en la direccion del contacto.
                    );
                
                // Si es persona jurídica, asociar el contacto a la cuenta.
                if (caso.RecordTypeId == recordTypeIdJuridica) {
                    contacto.AccountId = caso.AccountId;
                }
                //Si es persona natural, asociar la identificacion
                if(caso.RecordTypeId == recordTypeIdNatural){
                    contacto.BCNumeroDeIdentificacion__c = contactoIdentificacion;
                }
                insert contacto;
            } else {
                contacto = contactos[0];
            }
            
            caso.ContactId = contacto.Id; // Asociar el caso al contacto
            
            // --- 3.  Establecer campos del Caso ---
            caso.SuppliedEmail = contactoCorreoElectronico; // Correo del contacto
            caso.SuppliedName = contactoNombres + ' ' + contactoApellidos; // Nombre completo del contacto
            caso.SuppliedPhone = contactoTelefono;
            caso.RecordTypeId = caso.RecordTypeId; //Asignar record type
            if(caso.RecordTypeId == recordTypeIdNatural){ //Solo si es persona natural
                caso.Description = contactoDireccion; //Guarda la direccion en la descripcion
                caso.BCNumeroIdentificacion__c = contactoIdentificacion; //Guardar la cedula
            } else { //Si no es persona natural es persona juridica
                caso.Description = cuentaDireccion; // El campo direccion de empresa.
                caso.BCCorreoElectronicoEmpresa__c = cuentaCorreoElectronico; // El campo de correo de la empresa
                caso.BCRepresentanteLegal__c = cuentaRepresentanteLegal; // Nombre del representante
                caso.BCIdentificacionRL__c = cuentaIdentificacionRL; // Identificacion
                caso.BCTelefono__c = cuentaTelefono; // Telefono
            }
            
            // --- 4. Insertar el Caso ---
            insert caso;
            
            
            // --- 5. Asignar el caso a las direcciones e insertarlas ---
            for (BCDireccionElemento__c dir : direcciones) {
                dir.BCSolicitud__c = caso.Id;
            }
            insert direcciones;
            
            // --- 6. Gestionar los archivos adjuntos ---
            gestionarAdjuntos();
            
            
            // --- 7. Redirigir a la página de detalle del caso ---
            PageReference paginaExito = new PageReference('/' + caso.Id);
            paginaExito.setRedirect(true);
            return paginaExito;
            
        } catch (Exception e) {
            ApexPages.addMessages(e);
            return null; // Mostrar errores en la página
        }
    }
    public PageReference cancelar() {
        // Redirigir a donde quieras (ej. página de inicio)
        PageReference paginaInicio = new PageReference('/'); // Cambia '/' por la URL que desees.  O usa un named page.
        paginaInicio.setRedirect(true);
        return paginaInicio;
    }
    
    // --- Métodos para gestionar la carga de archivos (USANDO CONTENTVERSION) ---
    private void gestionarAdjuntos() {
        List<ContentVersion> versiones = new List<ContentVersion>();
        // Lista para almacenar los IDs de los ContentDocument
        List<Id> contentDocumentIds = new List<Id>();
        
        // Función auxiliar para crear ContentVersion,  NO crea ContentDocumentLink aquí
        addArchivo(versiones, archivoActa, archivoActaFileName);
        addArchivo(versiones, archivoPlanos, archivoPlanosFileName);
        addArchivo(versiones, archivoFotos, archivoFotosFileName);
        addArchivo(versiones, archivoComprobante, archivoComprobanteFileName);
        addArchivo(versiones, archivoRegistro, archivoRegistroFileName);
        
        // Insertar ContentVersions y obtener los ContentDocumentIds
        if (!versiones.isEmpty()) {
            Database.insert(versiones, false); // Inserción con 'false' para mejor manejo de errores
            
            for(ContentVersion cv : versiones){
                contentDocumentIds.add(cv.ContentDocumentId);
            }
            // Llamar al método @future con la lista de ContentDocumentIds
            crearEnlaces(contentDocumentIds, caso.Id);
        }
    }
    
    
    // Modificación de addArchivo:  Ahora solo crea ContentVersion
    private void addArchivo(List<ContentVersion> versiones, Blob fileData, String fileName) {
        if (fileData != null && fileName != null) {
            ContentVersion cv = new ContentVersion(
                Title = fileName,
            PathOnClient = fileName,
            VersionData = fileData,
            IsMajorVersion = true
                );
            versiones.add(cv);
        }
    }
    
    //Modificacion del metodo para crear enlaces, ahora recibe lista de IDs
    @future
    public static void crearEnlaces(List<Id> contentDocumentIds, Id casoId) {
        List<ContentDocumentLink> linksToInsert = new List<ContentDocumentLink>();
        
        for (Id docId : contentDocumentIds) {
            linksToInsert.add(new ContentDocumentLink(
                ContentDocumentId = docId,
            LinkedEntityId = casoId,
            ShareType = 'V'
                ));
        }
        
        if (!linksToInsert.isEmpty()) {
            Database.insert(linksToInsert);
        }
    }
    
    //Metodo remoto para ser llamado desde JS
    @RemoteAction
    public static void mostrarMensajeError(String mensaje) {
        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, mensaje));
    }
    
    //Metodo remoto para ser llamado desde JS
    @RemoteAction
    public static void mostrarMensajeConfirmacion() {
        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.CONFIRM, 'Formulario enviado.  (En una implementación real, aquí se enviarían los datos)'));
    }
}