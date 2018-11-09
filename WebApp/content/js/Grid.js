Benner.Grid = function () {

}

$(document).keyup(function (e) {
    if (e.keyCode == 13) { // enter
        var $currentFocus = $('input[type=text]:focus,input[type=checkbox]:focus,span:focus,input[type=search]:focus');
        if ($currentFocus.length) {
            var $filterForm = $currentFocus.closest('.filter-search-form, .filter-search-simple');
            if ($filterForm.length) {
                var $comboDropDown = $('.comboDropDown');
                if ($comboDropDown.length == 0 || ($comboDropDown.length && !$comboDropDown.is(':visible'))) {
                    var $button = $filterForm.find($('.filter-button'));
                    if ($button.length) {
                        Benner.Control.storeCurrentFocus($currentFocus, 'same');

                        // o onclick do botão filtrar é responsável por armazenar o foco no próximo campo
                        var click = $button.attr('onclick');
                        if(click && click.length)
                            eval(click);
                        // enquanto o href é responsável pelo postback
                        window.location.href = $button.attr('href');
                        return false;
                    }
                }
            }
        }
    }
});

Benner.Grid.showRecordCommands = function (listItem) {
    var dropMenu = listItem.getElementsByTagName("div");

    if (dropMenu == null || dropMenu.length == 0)
        return;


    dropMenu[0].style.left = "0px"; // Define posicionamento dos comandos logo abaixo do botão 
    dropMenu[0].style.visibility = "visible";

}

Benner.Grid.selectAllRows = function (gridClientId) {

    var value = false;
    if ($("#" + gridClientId).find("th.multi-select-column input:checked").length > 0)
        value = true;

    var checkboxlist = $("#" + gridClientId).find("td.multi-select-column label > input");
    for (var i = 0; i < checkboxlist.length; i++) {
        if ($(checkboxlist[i]).prop("checked") !== value)
            $(checkboxlist[i]).click();
    }   
}

Benner.Grid.stopPropagation = function (evt) {
    var event = evt || window.event;

    if (event.stopPropagation)
        event.stopPropagation();
    else
        event.cancelBubble = true;
}

var AggregateOperationOption = { Count: "Count", Sum: "Sum", Average: "Average", Max: "Max", Min: "Min" };

Benner.Grid.initializeTotalizers = function (idWidget, isSimpleGrid) {
    let $selectedRows = $("#" + idWidget + " tbody .multi-select-column input:checked");
    for (let i = 0; i < $selectedRows.length; i++) {
        Benner.Grid.updateTotalizers($selectedRows[i].id, isSimpleGrid, idWidget);
    }
}

Benner.Grid.updateTotalizers = function (id, isSimpleGrid, idWidget) {
    
    Benner.Grid.updateItemSelected(id);
    
    if (idWidget !== "")
        idWidget = isSimpleGrid ? $("#" + id).parents(".simple-grid").attr("id") : $("#" + id).parents(".editable-grid").attr("id");

    let itensSelected = $("#" + idWidget + " tr.active:not(.totalizer-row)").length !== 0;
    let $rowTotalizers = $("#" + idWidget + " .totalizer-row > td[data-field]");
    if (itensSelected) {
        for (let i = 0; i < $rowTotalizers.length; i++) {
            let columnTotalizer = $rowTotalizers[i];
            let fieldTotalizer = Benner.Grid.getTotalizer(idWidget, columnTotalizer, isSimpleGrid);
            
            if (columnTotalizer.dataset.oldValue === undefined || columnTotalizer.dataset.oldValue === "")
                columnTotalizer.dataset.oldValue = columnTotalizer.textContent;

            let valueFormat = "";
            if (fieldTotalizer.initialized)
                valueFormat = Benner.Grid.getFormatValue(fieldTotalizer.value, fieldTotalizer.type, fieldTotalizer.decimal);
            columnTotalizer.textContent = valueFormat;
        }
    }
    
    let $rowTotalizer = $("#" + idWidget + " .totalizer-row");
    if (itensSelected) {
        $rowTotalizer.addClass("active");
    } else {
        for (let i = 0; i < $rowTotalizers.length; i++) {
            let columnTotalizer = $rowTotalizers[i];
            if (columnTotalizer.dataset.oldValue !== "") {
                columnTotalizer.textContent = columnTotalizer.dataset.oldValue;
                columnTotalizer.dataset.oldValue = "";
            }
        }

        $rowTotalizer.removeClass("active");
    }
}

Benner.Grid.updateItemSelected = function (id) {
    let $rowActive = $("#" + id).parents("tr");
    if ($rowActive.hasClass("active")) {
        $rowActive.removeClass("active");
        $rowActive.removeClass("active-totalizer");
    } else {
        $rowActive.addClass("active");
        $rowActive.addClass("active-totalizer");
    }
        
}

Benner.Grid.getTotalizer = function (idWidget, columnTotalizer, isSimpleGrid) {
    let fieldTotalizer = {
        initialized: false,
        value : 0,
        type: "",
        decimal: null
    };

    if (columnTotalizer.dataset.totalizer === AggregateOperationOption.Max) {
        fieldTotalizer.value = Number.MIN_SAFE_INTEGER;
    } else if (columnTotalizer.dataset.totalizer === AggregateOperationOption.Min) {
        fieldTotalizer.value = Number.MAX_SAFE_INTEGER;
    }

    let $fields = $("#" + idWidget + " tr.active-totalizer > td." + columnTotalizer.dataset.field);
    for (let i = 0; i < $fields.length; i++) {

        let $field = Benner.Grid.getField($fields[i]);
        if (fieldTotalizer.type === "") {
            fieldTotalizer.type = $field.data("type");
            fieldTotalizer.decimal = parseInt($field.data("m-dec"));
        }
        Benner.Grid.applyTotalizer(fieldTotalizer, isSimpleGrid ? $field.text() : $field.val(), columnTotalizer.dataset.totalizer);
    }

    if (columnTotalizer.dataset.totalizer === AggregateOperationOption.Average) {
        fieldTotalizer.value = fieldTotalizer.value / $fields.length;
    }

    return fieldTotalizer;
}

Benner.Grid.applyTotalizer = function (fieldTotalizer, newItem, typeTotalizer) {
    if (newItem === null || newItem.trim() === "")
        return fieldTotalizer.value;
    
    newItem = parseFloat(newItem.replace("R$", "").replaceAll(".", "").replace(",", "."));
    switch (typeTotalizer) {
        case AggregateOperationOption.Count:
            fieldTotalizer.value++;
            break;
        case AggregateOperationOption.Average:
        case AggregateOperationOption.Sum:
            fieldTotalizer.value = fieldTotalizer.value + newItem;
            break;
        case AggregateOperationOption.Max:
            if (fieldTotalizer.value < newItem)
                fieldTotalizer.value = newItem;
            break;
        case AggregateOperationOption.Min:
            if (fieldTotalizer.value > newItem)
                fieldTotalizer.value = newItem;
            break;
    }

    fieldTotalizer.initialized = true;
}

Benner.Grid.getField = function(field) {

    let $selectField = $(field).find("select");
    if ($selectField.length > 0) {
        return $selectField;
    }

    let $inputField = $(field).find("input");
    if ($inputField.length > 0) {
        return $inputField;
    }

    return $(field);
}

Benner.Grid.getFormatValue = function(value, typeField, decimalValue) {

    if (typeField === "currency") {
        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
    } else if (typeField === "number") {
        value = value.toLocaleString('pt-BR', { minimumFractionDigits: decimalValue, maximumFractionDigits: decimalValue});
    } else if (typeField === "integer" && value.toString().indexOf(".") !== -1) {
        value = value.toString().substr(0, value.toString().indexOf("."));
    }

    return value;
}

module.exports = Benner.Grid;