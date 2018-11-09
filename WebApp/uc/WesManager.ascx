<%@ Control Language="C#" ViewStateMode="Disabled" EnableViewState="false" AutoEventWireup="true" Inherits="Benner.Tecnologia.Wes.Components.WebApp.WesManagerUserControl" %>
<%@ Register Assembly="Benner.Tecnologia.Wes.Components" Namespace="Benner.Tecnologia.Wes.Components.UI" TagPrefix="wes" %>

<asp:ScriptManager ID="mainScriptManager" runat="server" OnAsyncPostBackError="OnAsyncPostBackError" EnablePartialRendering="true" ScriptMode="Release" EnablePageMethods="true">
    <Scripts>
    </Scripts>
</asp:ScriptManager>

<div runat="server" id="environment" class="environment navbar-fixed-bottom">
	<div runat="server" id="descriptionEnvironmentSlider" class="environment-slider"></div>
    <asp:Panel runat="server" ID="descriptionEnvironment" ClientIDMode="Static"></asp:Panel>
</div>

<script>
    Benner.Page.initApplication();

    $(function () {
        Benner.Page.init();
    });
</script>