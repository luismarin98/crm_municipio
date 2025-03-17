public with sharing class BC_MensajesDeError {
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