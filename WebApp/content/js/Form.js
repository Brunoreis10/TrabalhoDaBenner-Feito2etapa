Benner.Form = function() {
    this.name;
    this.formViewMode;
    this.providerWidget;
    this.forceSave;
    this.forceSaveType;
};

// Armazena os formulários que a página contem
Benner.Form.items = new Array();
Benner.Form.editingIndex = -1;
Benner.Form.ongoingPostback = false;

Benner.Form.add = function(controlId, formViewMode, providerWidgetId) {

    if (Benner.Form.existForm(controlId))
        return;

    var objForm = new Benner.Form();
    objForm.name = controlId;
    objForm.formViewMode = formViewMode;
    objForm.providerWidget = providerWidgetId;
    objForm.forceSave = false;
    objForm.forceSaveType = '';

    Benner.Form.items[Benner.Form.items.length] = objForm;
};

Benner.Form.updateViewMode = function(controlId, formViewMode) {
    for (var i = 0; i < Benner.Form.items.length; i++) {
        var objForm = Benner.Form.items[i];
        if (controlId == objForm.name)
            objForm.formViewMode = formViewMode;
    }
};

Benner.Form.getViewMode = function(controlId) {
    for (var i = 0; i < Benner.Form.items.length; i++) {
        var objForm = Benner.Form.items[i];
        if (objForm.name.indexOf(controlId) > -1)
            return objForm.formViewMode;
    }

    return 'Formulário não encontrado';
};

Benner.Form.existForm = function(name) {
    for (var i = 0; i < Benner.Form.items.length; i++) {
        var objForm = Benner.Form.items[i];
        if (objForm.name == name) {
            return true;
        }
    }
    return false;
};

Benner.Form.save = function (controlId, saveType) {
    if (!Benner.Form.ongoingPostback) {
        __doPostBack(controlId, saveType);
    } else {
        Benner.Form.items[Benner.Form.editingIndex].forceSaveType = saveType;
        Benner.Form.items[Benner.Form.editingIndex].forceSave = controlId;
    }
};

Benner.Form.init = function () {
    Benner.Form.ongoingPostback = false;
    for (var index in Benner.Form.items) {
        var form = Benner.Form.items[index];
        if (form.formViewMode == 'Edit') {
            Benner.Form.editingIndex = index;

            if (form.forceSave) {
                __doPostBack(form.forceSave, form.forceSaveType);
                Benner.Form.items[index].forceSave = null;
                Benner.Form.items[index].forceSaveType = '';
            }

            return;
        }
    }
};

module.exports = Benner.Form;