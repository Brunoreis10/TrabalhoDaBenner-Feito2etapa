<%@ Control Language="C#" AutoEventWireup="true" Inherits="Benner.Tecnologia.Wes.Components.WebApp.ScriptsLogin" %>

<script src="<%=ResolveVersionUrl("~/content/js/benner.min.js")%>" type="text/javascript"></script>
<script src="<%=ResolveVersionUrl("~/content/assets/global/plugins/jquery-validation/js/jquery.validate.min.js")%>" type="text/javascript"></script>
<script src="<%=ResolveVersionUrl("~/content/js/ServiceWorkerRegistration.js")%>" type="text/javascript"></script>


<script type="text/javascript">
    (function () {
        Layout.init();// Inicializa o layout
        Login.init();// Inicializa validações da tela de login
    })();
</script>
