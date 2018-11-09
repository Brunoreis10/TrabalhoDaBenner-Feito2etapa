import '~/content/assets/plugins/jquery.minicolors/jquery.minicolors.js';

Benner.FormWidget = function () {

    var handleForm = function () {

        //Inicializa o componete autonumeric, para campos do tipo integer, valor e numero
        $('form .auto-numeric:not([readonly])').autoNumeric('init');

        //Cria novos caracteres para o iputmask
        //Inicializa o inputmask
        Inputmask.extendDefinitions({
            'c': {
                "validator": "n*",
                "cardinality": 1,
            },
            '#': {
                "validator": "[0-9+-_ ]",
                "cardinality": 1,
            },
            'a': {
               
                "validator": "[A-Za-z0-9_ ]",
                "cardinality": 1,
            },
            'l': {
                "validator": "[A-Za-z_ ]",
                "cardinality": 1,
            },
            '9': {
                "validator": "[0-9_ ]",
                "cardinality": 1,
            }
        });
        Inputmask.extendDefaults({
            clearMaskOnLostFocus: false,
            groupmarker: { start: "((", end: "))" }
        });
        
        $(".input-mask").inputmask('remove');
        $(".input-mask").inputmask();

        $('.input-mask').each(function () {
            $(this).val(Benner.FormWidget.replaceEmptyCharactersByMaskPlaceholder($(this)));
        });

        $.minicolors.defaults = $.extend($.minicolors.defaults, {
            theme: 'bootstrap'
        });
        $(".minicolors-input").minicolors();
    }

    return {
        init: function () {
            handleForm();
            Benner.FormWidget.initializeTooltips();
        }
    };
}();

Benner.FormWidget.confirmDeletePostBack = function (controlId, command) {

    bootbox.dialog({
        title: 'Excluir',
        message: 'Confirma a exclusão?',
        onEscape: function () { bootbox.hideAll() },
        buttons: {
            success: {
                label: 'Sim',
                className: 'red btn-primary',
                callback: function () {
                    window.location.href = 'javascript:__doPostBack("' + controlId + '", "' + command + '");';
                }
            },
            main: {
                label: 'Não',
                className: 'default'
            }
        }
    });
}

Benner.FormWidget.confirmDelete = function (control) {

    var postbackUrl = $(control).attr('href');

    $(control).removeAttr('href');

    bootbox.dialog({
        title: 'Excluir',
        message: 'Confirma a exclusão?',
        onEscape: function () { bootbox.hideAll() },
        buttons: {
            success: {
                label: 'Sim',
                className: 'red  btn-primary',
                callback: function () {
                    window.location.href = postbackUrl;
                }
            },
            main: {
                label: 'Não',
                className: 'default',
                callback: function () {
                    $(control).attr('href', postbackUrl);
                }
            }
        }
    });
}

Benner.FormWidget.confirmationRequired = function (control, message) {
    var postbackUrl = $(control).attr('href');
    $(control).removeAttr('href');

    bootbox.dialog({
        title: $(control).text(),
        message: message,
        onEscape: function () {
            $(control).attr('href', postbackUrl);
            bootbox.hideAll();
        },
        buttons: {
            success: {
                label: 'Sim',
                className: 'btn-primary',
                callback: function () {
                    window.location.href = postbackUrl;
                }
            },
            main: {
                label: 'Não',
                className: 'btn-default',
                callback: function () {
                    $(control).attr('href', postbackUrl);
                }
            },
        },
    });
};

Benner.FormWidget.closeUpload = function (fileName, controlId) {
    $("#" + controlId).val(fileName);
    Benner.ModalPage.hide();
    $("#" + controlId).focusOnNextField();
}

Benner.FormWidget.closeImage = function (fileName) {
    var image = $("#" + fileName);
    if (image != null) {
        var src = $(image).children().attr("src");
        $(image).children().attr("src", src + "#");
    }

    Benner.ModalPage.hide();
    $(image).siblings().find("button").focus();
}

Benner.FormWidget.UpdateHiddenActiveTabPageIndex = function (hiddenFieldId, tabId) {
    if (hiddenFieldId) {
        var hidden = $("#" + hiddenFieldId);
        hidden.val(tabId);

        Benner.Control.storeCurrentFocus(hidden.get(), "next");
        setTimeout(function () {
            Benner.Control.restoreFocus();
        }, 0);
    }
}

Benner.FormWidget.removeMask = function () {
    $('.input-mask').each(function () {
        if ($(this).inputmask('isComplete') && $(this).hasClass('remove-incomplete-mask'))
            return true;

        var fieldPlaceholder = $(this).data('inputmaskplaceholder');
        var unmaskedValue = $(this).val().split('');

        if (unmaskedValue === undefined)
            return;

        var charsInMask = _.uniq($(this).inputmask('getemptymask'));

        var mask = $(this).inputmask('getemptymask');

        for (var i = 0; i <= unmaskedValue.length; i++) {

            if (unmaskedValue[i] == fieldPlaceholder) {
                unmaskedValue[i] = " ";
                continue;
            }

            if ($.inArray(unmaskedValue[i], charsInMask) >= 0 && mask[i] != " ")
                unmaskedValue[i] = "";
        }

        unmaskedValue = unmaskedValue.join('');

        $(this).inputmask('remove');
        $(this).val(unmaskedValue);
    })

}

Benner.FormWidget.replaceEmptyCharactersByMaskPlaceholder = function (field) {
    var mask = $(field).inputmask('getemptymask');   
    var value = $(field).val().split('');
    var mask = $(field).inputmask('getemptymask');
    var placeholder = $(field).data("inputmaskplaceholder");
    var idic = 0;
    for (var i = 0;i <= value.length; i++) {
        if (value[i] != " " && value[i] == placeholder && mask[i] != " ") //só substitui os espaços quando for um caractere que o usr digitou, não os que fazem parte da máscara
            value[i] = "";
        if (value[i] == " " && value[i] != placeholder && mask[i] != " ")
            value[i] = placeholder;
    }

    return value.join("").trim();
}

Benner.FormWidget.validFieldPassword = function (event, idPassword, idConfirPassword) {
    if ($("#" + idConfirPassword).val() != "" && $("#" + idPassword).val() != $("#" + idConfirPassword).val())
        alert("Senhas informadas não conferem.");
}

Benner.FormWidget.initializeTooltips = function () {
    //Tooltip informado campo dica
    $('.help-tooltip').tooltip(
        {
            template: '<div class="tooltip" role="tooltip"><div class="error-tooltip-arrow tooltip-arrow"></div><div class="error-tooltip-inner tooltip-inner"></div></div>'
        }
    );
    //Tooltip informando campo obrigatório
    $('.has-error').tooltip(
        {
            template: '<div class="tooltip error-tooltip" role="tooltip"><div class="error-tooltip-arrow tooltip-arrow"></div><div class="error-tooltip-inner tooltip-inner"></div></div>',
            placement: 'bottom'
        }
    );
}

Benner.FormWidget.changeStateGroup = function (section) {

    var groupSection = section.parentNode;
    if (groupSection.tagName !== "H4")
        groupSection = groupSection.parentNode;

    var fontIcon = groupSection.lastElementChild.firstChild;

    var cookie = "";
    var idSection = groupSection.getAttribute("data-id");

    if (fontIcon.classList.contains("fa-angle-down")) {
        fontIcon.classList.remove("fa-angle-down");
        fontIcon.classList.add("fa-angle-up");

        groupSection.classList.add("minimized");

        cookie = idSection + "=closed; path=/";
    } else {
        fontIcon.classList.remove("fa-angle-up");
        fontIcon.classList.add("fa-angle-down");

        groupSection.classList.remove("minimized");

        cookie = idSection + "=open; path=/";
    }
    document.cookie = cookie;
}

export default Benner.FormWidget