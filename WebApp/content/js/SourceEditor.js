Benner.SourceEditor = function () {
    this.config;
    this.code;
    this.sourceEditor;
    this.editor;
}

Benner.SourceEditor.items = Array();

Benner.SourceEditor.add = function (idConfig, idCode, idSourceEditor) {
    var aceEditor = new Benner.SourceEditor();
    aceEditor.config = idConfig;
    aceEditor.code = idCode;
    aceEditor.sourceEditor = idSourceEditor;
    aceEditor.editor = ace.edit(idSourceEditor);

    Benner.SourceEditor.items[Benner.SourceEditor.items.length] = aceEditor;

    return aceEditor;
}

Benner.SourceEditor.lastAceEditor = function () {
    return Benner.SourceEditor.items[Benner.SourceEditor.items.length - 1].editor;
}

Benner.SourceEditor.AceEditor = function (index) {
    return Benner.SourceEditor.items[index].editor;
}

Benner.SourceEditor.load = function (idConfig, idCode, idSourceEditor) {
    ace.require("ace/ext/language_tools");
    var aceEditor = Benner.SourceEditor.add(idConfig, idCode, idSourceEditor);
    aceEditor.editor.setTheme("ace/theme/chrome");
    aceEditor.editor.setPrintMarginColumn(-1);
    aceEditor.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
    });
    var config = JSON.parse($("#" + idConfig).val());

    aceEditor.editor.setReadOnly(config.ReadOnly)

    var session = aceEditor.editor.getSession();
    session.setMode("ace/mode/" + config.Language);
    session.setUseWrapMode(true);
    session.setValue($("#" + idCode).val());

    $("#" + idSourceEditor).keyup(function (e) {
        if (e.keyCode == 27) // esc
            e.stopPropagation();
    });

    aceEditor.editor.focus();
}

Benner.SourceEditor.save = function () {
    for (var i = 0; i < Benner.SourceEditor.items.length; i++) {
        var objAceEditor = Benner.SourceEditor.items[i];
        var hidden = $("#" + objAceEditor.code);
        hidden.val(objAceEditor.editor.getSession().getValue());
    }
}

Benner.SourceEditor.init = function () {
    $('div.source-editor').each(function () {
        var div = $(this);
        var mode = div.data('mode');
        var loaded = div.data('loaded');
        
        if (!mode || loaded)
            return;

        var field = div.data('bind-field');
        var editor = ace.edit(div[0]);
        editor.setTheme("ace/theme/chrome");
        editor.setPrintMarginColumn(-1);
        editor.getSession().setMode("ace/mode/" + mode);
        editor.getSession().setUseWrapMode(true);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        div.data('loaded', true);
        editor.focus();

        if (!field)
            return;

        var inputField = $(".widget-body *[data-field=" + field + "]");
        if (inputField.length > 0) {
            inputField.hide();
            editor.getSession().on('change', function () {
                inputField.val(editor.getSession().getValue());
            });
            editor.getSession().setValue(inputField.val());
        }
    });
}

module.exports = Benner.SourceEditor;