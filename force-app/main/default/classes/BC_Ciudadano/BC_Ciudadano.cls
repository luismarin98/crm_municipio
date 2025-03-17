@RestResource(urlMapping='/Ciudadano/')
global with sharing class BC_Ciudadano {
    @HttpPost
    global static String insertCiudadano(
        String tipoPersona, 
        String tipoIdentificacion, 
        String numeroIdentificacion, 
        String nombre,
        String apellido,
        String telefono,
        String celular,
        String email,
        String genero,
        String estadoCivil,
        String fechaNacimiento,
        String fechaDefuncion,
        String tipoSangre,
        String profesion,
        String ciudad,
        String parroquia,
        String provincia,
        String razonSocial,
        String representanteIdentificacion, 
        String representanteNombre, 
        String representanteApellido,
        String representanteEmail,
        String representanteTelefono,
        String representanteCelular,
        String fechaInicioActividad        
        ) {
        if(tipoPersona == 'PN'){
            List<Account> natural = [SELECT Id FROM Account WHERE BCNumeroIdentificacion__c = :numeroIdentificacion LIMIT 1];
            Account persona;

            RecordType RecordTypeN = [SELECT Id FROM RecordType where sObjectType = 'Account' and DeveloperName = 'BCNatural' limit 1];

            if (!natural.isEmpty()) {
                //Actualizar datos para Persona Natural
                persona = natural[0];
                persona.PersonEmail = email;
                persona.BCEmail__c = email;
                persona.Phone = telefono;
                persona.BCMobile__c = celular;
                persona.BCSexo__c = genero;
                persona.BCEstadoCivil__c = estadoCivil;
                persona.BCFechaDefuncion__pc = Date.valueOf(fechaDefuncion);
                persona.BCTipoSangre__c = tipoSangre;
                persona.BCProfesion__c = profesion;
                persona.BCCiudad__c = ciudad;
                persona.BCParroquia__c = parroquia;
                persona.BCProvincia__c = provincia;
                update persona;

            }else {
                // Crear nuevo Cuenta para Persona Natural
                persona = new Account(
                    Name = nombre + ' ' + apellido,
                    BCTipoIdentificacion__c = tipoIdentificacion,
                    BCNumeroIdentificacion__c = numeroIdentificacion,        
                    PersonEmail = email,
                    BCEmail__c = email,
                    RecordTypeId = RecordTypeN.Id,
                    Phone = telefono,
                    BCMobile__c = celular,
                    BCSexo__c = genero,
                    BCEstadoCivil__c = estadoCivil,
                    PersonBirthdate = Date.valueOf(fechaNacimiento),
                    BCTipoSangre__c = tipoSangre,
                    BCProfesion__c = profesion,
                    BCCiudad__c = ciudad,
                    BCParroquia__c = parroquia,
                    BCProvincia__c = provincia                    
                );
                insert persona;
            }

            return 'Persona Natural procesada correctamente.'; 

        }else if(tipoPersona == 'PJ'){
            List<Account> empresas = [SELECT Id FROM Account WHERE BCNumeroIdentificacion__c = :numeroIdentificacion LIMIT 1];
            Account empresa;

            RecordType RecordTypeJ = [SELECT Id FROM RecordType where sObjectType = 'Account' and DeveloperName = 'BCJuridica' limit 1];

            if (!empresas.isEmpty()) {
                empresa = empresas[0];
                //empresa. = actividadNegocio;
                empresa.BCFechaInicioActividad__c = Date.valueOf(fechaInicioActividad);

                update empresa;
            }else {
                empresa = new Account(
                    Name = razonSocial,
                    BCTipoIdentificacion__c = tipoIdentificacion,
                    BCNumeroIdentificacion__c = numeroIdentificacion,  
                    PersonEmail = email,
                    BCEmail__c = email,
                    RecordTypeId = RecordTypeJ.Id,    
                    BCFechaInicioActividad__c = Date.valueOf(fechaInicioActividad )           
                );
                insert empresa;
            }

            if (representanteIdentificacion != null) {
                List<Account> representantes = [SELECT Id FROM Account WHERE BCNumeroIdentificacion__c = :representanteIdentificacion LIMIT 1];
                
                if (!representantes.isEmpty()) {
                    empresa.BCRepresentanteLegal__c = representantes[0].Id;
                }else{
                    RecordType RecordTypeN = [SELECT Id FROM RecordType where sObjectType = 'Account' and DeveloperName = 'BCNatural' limit 1];

                    // Crear Representante Legal como un Account
                    Account representante = new Account(
                        Name = representanteNombre + ' ' + representanteApellido,
                        BCTipoIdentificacion__c = tipoIdentificacion,
                        BCNumeroIdentificacion__c = representanteIdentificacion,        
                        PersonEmail = representanteEmail,
                        BCEmail__c = representanteEmail,
                        RecordTypeId = RecordTypeN.Id,
                        Phone = telefono,
                        BCMobile__c = celular,
                        BCSexo__c = genero,
                        BCEstadoCivil__c = estadoCivil,
                        PersonBirthdate = Date.valueOf(fechaNacimiento),
                        BCTipoSangre__c = tipoSangre,
                        BCProfesion__c = profesion,
                        BCCiudad__c = ciudad,
                        BCParroquia__c = parroquia,
                        BCProvincia__c = provincia                    
                    );
                    insert representante;
                    empresa.BCRepresentanteLegal__c = representante.Id;
                }

                update empresa;
            }

            return 'Persona Jurídica y su Representante procesados correctamente.';    
            
        }else{
            System.debug('Se envia otro tipo de persona');
            return 'Error: Tipo de persona no válido.';
        }
    } 
}