<%@ Page Title="Resumo de Informação do ambiente" Language="C#" Inherits="Benner.Tecnologia.Wes.Components.WebApp.EnvironmentInfoSummaryPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Main" runat="Server">
    <div class="row">
        <div class="col-xs-12 widget">
            <div class="portlet light">
                <div class="portlet-body">
                    <span class="caption-subject font-blue-sharp"><span class="bold uppercase">Momento da verificação:</span> <asp:Label runat="server" ID="datetime"></asp:Label></span>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div id="ctl01_SystemInfo">
            <div class="col-sm-6 widget">
                <div class="portlet light">
                    <div class="portlet-title">
                        <div class="caption collapsible" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl01_SystemInfo');">
                            <span class="caption-subject font-green-sharp bold uppercase">Informações do Sistema</span>
                        </div>
                        <div class="tools">
                            <a href="javascript:;" class="collapse" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl01_SystemInfo');"></a>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-group">
                            Última alteração: <asp:Label runat="server" ID="lastChange"></asp:Label>
                        </div>
                        <div class="form-group">
                            Última correção: <asp:Label runat="server" ID="lastCorrection"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="bserverSystemName"></asp:Label>
                        </div>
                        <div class="form-group">
                            Versão DB: <asp:Label runat="server" ID="dbVersion"></asp:Label>
                        </div>
                        <div class="form-group">
                            Nome do sistema: <asp:Label runat="server" ID="systemName"></asp:Label>
                        </div>
                        <div class="form-group">
                            Versão do sistema: <asp:Label runat="server" ID="systemVersion"></asp:Label>
                        </div>
                        <div class="form-group">
                            Sistema é específico: <asp:Label runat="server" ID="isCustomSystem"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="lastSpecific"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="lastParallel"></asp:Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="ctl00_VersionInfo">
            <div class="col-sm-6 widget">
                <div class="portlet light">
                    <div class="portlet-title">
                        <div class="caption collapsible" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl00_VersionInfo');">
                            <span class="caption-subject font-green-sharp bold uppercase">Informações da versão</span>
                        </div>
                        <div class="tools">
                            <a href="javascript:;" class="collapse" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl00_VersionInfo');"></a>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-group">
                            <asp:Label runat="server" ID="wesVersion"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="providerVersion"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="superServerVersion"></asp:Label>
                        </div>
                        <div class="form-group">
                            <asp:Label runat="server" ID="wesLastUpdate"></asp:Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div id="ctl02_Artifacts">
            <div class="col-sm-6 widget">
                <div class="portlet light">
                    <div class="portlet-title">
                        <div class="caption collapsible" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl02_Artifacts');">
                            <span class="caption-subject font-green-sharp bold uppercase">Artefatos</span>
                        </div>
                        <div class="tools">
                            <a href="javascript:;" class="collapse" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl02_Artifacts');"></a>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-group">
                            Artefatos pendentes: <asp:Label runat="server" ID="pendingArtifacts" ClientIDMode="Static"><i class="fa fa-spinner fa-pulse fa-fw"></i> Carregando...</asp:Label>
                        </div>
                        <div class="form-group">
                            Artefatos desatualizados: <asp:Label runat="server" ID="outdatedArtifacts" ClientIDMode="Static"><i class="fa fa-spinner fa-pulse fa-fw"></i> Carregando...</asp:Label>
                        </div>
                        <div class="form-group">
                            Artefatos excedentes: <asp:Label runat="server" ID="exceedingArtifacts" ClientIDMode="Static"><i class="fa fa-spinner fa-pulse fa-fw"></i> Carregando...</asp:Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="ctl03_Other">
            <div class="col-sm-6 widget">
                <div class="portlet light">
                    <div class="portlet-title">
                        <div class="caption collapsible" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl03_Other');">
                            <span class="caption-subject font-green-sharp bold uppercase">Outras informações</span>
                        </div>
                        <div class="tools">
                            <a href="javascript:;" class="collapse" onclick="Benner.CollapsiblePanel.changeServerChromeState('ctl03_Other');"></a>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-group">
                            Empresa: <asp:Label runat="server" ID="company"></asp:Label>
                        </div>
                        <div class="form-group">
                            Filial: <asp:Label runat="server" ID="branch"></asp:Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        $(document).ready(loadArtifactsData);

        function loadArtifactsData() {
            $.get(Benner.Page.getApplicationPath() + 'api/wesartifacts/summary', function (result) {
                $('#pendingArtifacts').text(result.ToInstall);
                $('#outdatedArtifacts').text(result.ToUpdate);
                $('#exceedingArtifacts').text(result.ToRemove);
            });
        }
    </script>
</asp:Content>
