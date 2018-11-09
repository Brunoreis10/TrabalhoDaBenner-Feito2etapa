Benner.EditCustomField = function () {

}

Benner.EditCustomField.initModal = function () {
    parent.Benner.ModalPage.init();
    valueText = parent.Benner.EditCustomField.getTxtLabel().val();
    switch (parent.Benner.EditCustomField.getCmbLabelType().val()) {
        case "0":
        case "1": // Text
            $("#sourceText").val(valueText);
            $("#rbText").click();
            break;
        case "2": // HTML
            $("#rbHTML").click();
            aceEditor = Benner.SourceEditor.lastAceEditor();
            aceEditor.getSession().setValue(valueText);
            break;
        case "3": // MVC View
            $("#viewPath").val(valueText);
            $("#rbView").click();
            break;
        case "4": // MVC Controller 
            var obj = JSON.parse(valueText);
            $("#controllerMVC").val(obj.controller);
            $("#actionMVC").val(obj.action);
            $("#rbController").click();
            break;            
    }      
}

Benner.EditCustomField.OnOkClick = function () {    
    if ($("#tabText").hasClass("active")) {
        parent.Benner.EditCustomField.getTxtLabel().val($("#sourceText").val());
        parent.Benner.EditCustomField.getCmbLabelType().val("1");
    } else if ($("#tabHTML").hasClass("active")) {
        aceEditor = Benner.SourceEditor.lastAceEditor();
        var valorHTML = aceEditor.getSession().getValue();
        parent.Benner.EditCustomField.getTxtLabel().val(valorHTML);
        parent.Benner.EditCustomField.getCmbLabelType().val("2");
    } else if ($("#tabView").hasClass("active")) {
        parent.Benner.EditCustomField.getTxtLabel().val($("#viewPath").val());
        parent.Benner.EditCustomField.getCmbLabelType().val("3");
    } else if ($("#tabController").hasClass("active")) {
        var obj = {
            controller: $("#controllerMVC").val(),
            action: $("#actionMVC").val()
        };
        parent.Benner.EditCustomField.getTxtLabel().val(JSON.stringify(obj));
        parent.Benner.EditCustomField.getCmbLabelType().val("4");
    }
    parent.Benner.ModalPage.hide();
}

Benner.EditCustomField.setActiveTab = function(tabID) {
    $("#tab-field-option>div.tab-pane").removeClass("active");    
    $("#" + tabID).addClass("active");
    if ($("#tabText").hasClass("active")) {
        $("#sourceText").focus();
    } else if ($("#tabHTML").hasClass("active")) {
        Benner.SourceEditor.lastAceEditor().focus(); 
    } else if ($("#tabView").hasClass("active")) {
        $("#viewPath").focus();
    } else if ($("#tabController").hasClass("active")) {
        $("#controllerMVC").focus();
    }
}

Benner.EditCustomField.getTxtLabel = function () {
    return $("#" + Benner.EditCustomField.txtLabelId);
};

Benner.EditCustomField.getCmbLabelType = function () {
    return $("#" + Benner.EditCustomField.cmbLabelTypeId);
};

Benner.EditCustomField.txtLabelId = null;
Benner.EditCustomField.cmbLabelTypeId = null;
Benner.EditCustomField.show = function (url, labelValueId, cmbLabelTypeId) {
    Benner.EditCustomField.txtLabelId = labelValueId;
    Benner.EditCustomField.cmbLabelTypeId = cmbLabelTypeId;
    Benner.ModalPage.show({ id: labelValueId, url: url, height: 579, size: "large", displayTitle: false, generateDefaultContent: false });
}

module.exports = Benner.EditCustomField;