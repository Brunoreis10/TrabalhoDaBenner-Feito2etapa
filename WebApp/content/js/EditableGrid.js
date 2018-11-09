Benner.EditableGrid = function() {

};

Benner.EditableGrid.rowChanged = function(idChangeRecord, gridClientId, handle) {
    var hiddenField = document.getElementById(gridClientId);
    if (hiddenField) {
        hiddenField.value = hiddenField.value + handle + '|';
    }
    //Atualiza o label que indica se o registro foi alterado
    if (idChangeRecord != null && idChangeRecord != "") {
        $("#" + idChangeRecord).addClass("bg-red");
    }
};

module.exports = Benner.EditableGrid;