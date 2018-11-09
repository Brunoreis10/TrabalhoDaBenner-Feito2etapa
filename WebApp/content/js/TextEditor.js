Benner.TextEditor = function () {

}

Benner.TextEditor.editorId = null;

Benner.TextEditor.val = function (value) {
    var editor = $("#" + Benner.TextEditor.editorId);
    if (value != null) {
        editor.val(value);
    }

    return editor.val();
};

Benner.TextEditor.show = function (url, editorId) {
    Benner.TextEditor.editorId = editorId;
    Benner.ModalPage.show({id: editorId, url : url, height: 380, displayTitle: false, generateDefaultContent : false});
}

module.exports = Benner.TextEditor;