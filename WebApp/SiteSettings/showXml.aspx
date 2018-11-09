<%@ Page Title="Conteúdo serializado em formato XML" Language="C#" Inherits="Benner.Tecnologia.Wes.Components.WebApp.ShowXmlPage" %>

<%@ Register Src="~/uc/SourceEditor.ascx" TagName="SourceEditor" TagPrefix="wesUserControl" %>
<%@ Register Src="~/uc/EntityViewHeader.ascx" TagName="EntityViewHeader" TagPrefix="wesUserControl" %>

<asp:Content ID="Content1" ContentPlaceHolderID="Main" runat="Server">
    <script src="../Content/assets/plugins/ace/ace.js"></script>
    <wesUserControl:SourceEditor runat="server" ID="sourceEditor" />
    <style media="all">
        div#ContentPanel {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0 !important;
        }
        .source-editor.ace_editor {
            position: absolute;
            top: 42px;
            bottom: 0;
            height: auto;
        }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            var breadcrumb = $('#breadcrumbUpdatePanel');
            var breadcrumbHeight = 42;
            if (breadcrumb.size() > 0) {
                breadcrumbHeight = breadcrumb.height();
            } else {
                breadcrumbHeight = 0;
            }
            $('.source-editor.ace_editor').css({ top: breadcrumbHeight + 'px' });
        });
    </script>
</asp:Content>