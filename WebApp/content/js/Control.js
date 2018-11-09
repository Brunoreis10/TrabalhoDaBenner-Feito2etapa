Benner.Control = function () {
    var focusRestored = false;
};

Benner.Control.callFieldEventScript = function (formViewClientId, fieldName, focusNextField) {
    var button = $get(formViewClientId + '_FireFieldEventButton');
    if (button && !Benner.Page.processing) {
        Benner.Form.ongoingPostback = true;
        var linkUniqueID = button.attributes["uniqueid"].value;
        //Corrigi o erro "TypeError: access to strict mode caller function is censored"
        Benner.Search.fixFirefox();
        // armazenar o focus atual para restaurar após o postback
        if (focusNextField === true)
            Benner.Control.storeCurrentFocus(null, "next");
        else
            Benner.Control.storeCurrentFocus(null, "same");
        //Correção para IE9 para o erro de acesso ao 'caller' no modo strict
        setTimeout(function () {
            __doPostBack(linkUniqueID, fieldName);
            Benner.Search.close();
            $('.datepicker').datepicker('hide');
        }, 1);
    }
};

Benner.Control.callControlEventScript = function (formViewClientId, fieldName, controlClientId) {
    var control = document.getElementById(controlClientId);

    // armazenar o focus atual para restaurar após o postback
    Benner.Control.storeCurrentFocus(control, "next");

    //força blur por esse método é executado depois do change, como change dá um postback o blur não era executado
    if (control && control.onblur != null)
        control.onblur();

    if (control && $(control).data("events") !== undefined &&
        $(control).data("events")["blur"] !== undefined &&
        !$(control).hasClass("input-mask"))
    {
        $(control).blur();
    }
    Benner.Control.callFieldEventScript(formViewClientId, fieldName, true);
};

Benner.Control.callDateTimeControlEventScript = function (formViewClientId, fieldName, controlClientId, dateControlClientId, timeControlClientId) {
    var dateVal = $.trim($(document.getElementById(dateControlClientId)).val());
    var timeVal = $.trim($(document.getElementById(timeControlClientId)).val());

    if ((dateVal === "" && timeVal === "") || (dateVal !== "" && timeVal !== ""))
    {
        this.callControlEventScript(formViewClientId, fieldName, controlClientId);
    }
};

Benner.Control.storeCurrentFocus = function (currentControl, focusAt) {

    var assigned = $('body').data('last-focus');

    // caso já tenha sido armazenado, não sobrescreva! (BennerSearch.js agradece)
    if (assigned && assigned.length)
        return;

    if (currentControl == null)
        currentControl = document.activeElement;

    // pega o primeiro 'container' que tenha um id
    if ($(currentControl).attr('id') === undefined) {
        if ($(currentControl).context === undefined)
            currentControl = $(currentControl).closest("[id][id!='']");
        else
            currentControl = $(currentControl).context.children;
    }

    // caso não encontre nenhum, não tem o que fazer..
    if (currentControl == null)
        return;
    
    $('body').data('last-focus', $(currentControl).attr('id'));
    $('body').data('focus-at', focusAt);

    Benner.Control.focusRestored = false;
};

Benner.Control.restoreFocus = function () {

    var lastFocusId = $('body').data('last-focus');
    $('body').data('last-focus', '');

    var focusAt = $('body').data('focus-at');
    $('body').data('focus-at', '');

    if (Benner.Control.focusRestored &&
        lastFocusId === '')
        return;

    Benner.Control.focusRestored = true;

    if (focusAt === "ignore" || Benner.Page.isMobile.any)
        return;

    // se não tem informação, foca no primeiro e vaza!
    if (!lastFocusId || !lastFocusId.length) {
        //console.log('first widget - focusOnFirstField');
        $(".widget").first().focusOnFirstField();
        return;
    }

    // senão, verifica onde é para focar
    switch (focusAt) {
        case "next":
            //console.log('focusOnNextField ' + lastFocusId);
            $('#' + lastFocusId).focusOnNextField();
            return;
        case "same":
            //console.log('focusOnSameField ' + lastFocusId);
            $('#' + lastFocusId).focus();
            $('#' + lastFocusId).select();
            if ($('#' + lastFocusId).length === 0 && lastFocusId.endsWith("_select")) {
                lastFocusId = lastFocusId.substr(0, lastFocusId.length - 7) + "_text";
                $('#' + lastFocusId).focus();
                $('#' + lastFocusId).select();
            }
            return;
        case "first-child":
            //console.log('focusOnFirstChild ' + lastFocusId);
            $('#' + lastFocusId).focusOnFirstField();
            return;
    }
};

module.exports = Benner.Control;