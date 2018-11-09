Benner.Search = function () {

    var PAGE_SIZE = 50;

    var handleSelect2 = function () {

        if ($().select2) {

            $('select.benner-search.select2-hidden-accessible').each(function () {

                //Ao abrir um select2 e selecionar o mesmo registro é perdido o foco do campo
                //O componente select2 somente dispara o evento do close, quando selecionado o mesmo registro
                //Esta variavel veio suprir está necessidade
                let recordSelectedNotModify = true;
                $(this).on('select2:opening', function () {
                    var $body = $('body');

                    $body.data('last-focus', this.id);
                    $body.data('focus-at', 'same');

                    if ($($(this)[0]).data('changeeventtype') !== "callpython") {
                        recordSelectedNotModify = false;
                    }
                });

                $(this).on('select2:select', function (details) {
                    Benner.Search.valueChanged(this, details, 0);

                    var lookup = $(this)[0];
                    var url = $(lookup).attr('postback-url');

                    if (url !== null) {
                        eval(url);
                    }

                    recordSelectedNotModify = true;
                    //Quando tiver python o campo não deve restaurar o foco agora, porque o evento não foi executado ainda
                    if ($(lookup).data('changeeventtype') !== "callpython")
                        Benner.Control.restoreFocus();
                });

                $(this).on('select2:unselect', function (details) {
                    Benner.Search.valueChanged(this, details, 1);

                    recordSelectedNotModify = true;

                    if ($($(this)[0]).data('changeeventtype') !== "callpython") {
                        // Precisa do setTimeout ou o foco não funciona. Isso é confusão do select2.
                        setTimeout(function () { Benner.Control.restoreFocus(); }, 1);
                    }
                });

                $(this).on('select2:close', function (event) {
                    if (event.params.originalSelect2Event === null) {
                        $(this).addClass("select2-event-close");
                    }

                    if (!recordSelectedNotModify) {
                        Benner.Control.restoreFocus();
                    }
                });

                // Hack que remove o comportamento padrão do Select2 de abrir a caixa de busca
                // quando um item é removido pelo x no componente.
                // Link para a discussão com o hack https://github.com/select2/select2/issues/3320
                $(this).on('select2:unselecting', function (e) {
                    $(this).data('unselecting', true);
                }).on('select2:open', function (e) {
                    if ($(this).data('unselecting')) {
                        $(this).removeData('unselecting');
                        $(this).select2('close');
                    }
                });

                // opções de inicialização do select2
                var options = {};
                var self = $(this);
                options.placeHolder = $(this).data('placeholder');
                options.closeOnSelect = $(this).data('closeonselect');

                //Ao recriar o select2 no firefox o display era atribuido "inline"
                //Assim tornando o layout do incorreto
                $(this).css("display", "inline-block");
                // both
                options.formatAjaxError = formatAjaxError;
                options.id = buildSelectionId(self.attr('id'));
                options.allowClear = !$(this).prop('multiple');
                options.width = "off";
                options.theme = "bootstrap";
                options.language = "pt-BR";
                options.ajax = {
                    url: Benner.Page.getApplicationPath() + "api/search",
                    idSelect2: self.attr('id'),
                    dataType: 'json',
                    quietMillis: 200,
                    data: function (params) {
                        try {
                            if (params.term === undefined)
                                params.term = "";
                            params.page = params.page || 1;
                            return {
                                query: params.term,
                                targetEntity: $(this).data('targetentity'),
                                targetView: $(this).data('lookupviewname') ? $(this).data('lookupviewname') : '',
                                resultFields: $(this).data('resultfields'),
                                serverStateKey: $(this).attr('id'),
                                dependValueList: Benner.Search.recoverDependValueList($(this)),
                                sourceEntity: $(this).data('sourceentity') ? $(this).data('sourceentity') : '',
                                selectAnyStructuredLevel: $(this).data('selectanylevel') === 'True',
                                maxRows: PAGE_SIZE,
                                startRow: (PAGE_SIZE * (params.page - 1)),
                            };
                        }
                        catch (err) {
                            $(this).select2("close");
                            throw err;
                        }
                    },
                    processResults: function (data, params) {
                        return {
                            results: data,
                            pagination: {
                                more: data.length == PAGE_SIZE
                            }
                        };
                    },
                    error: function (jqXHR, status, error) {
                        if (jqXHR.status === 401 || jqXHR.status === 302) {
                            $(self).select2({ data: [{ id: -1, text: 'A sua sessão expirou.' }] });
                            $(self).select2("open");
                        }
                    }
                };

                if (!$(this).prop('multiple'))
                    options.templateSelection = templateSelectionItem;

                $(this).select2(options);
            });
        }
    };

    var templateSelectionItem = function (item) {
        if (!item.id) {
            return item.text;
        }

        var $item = $('<span class="selected-item">' + item.text + '</span>');
        return $item;
    };

    // both
    var buildSelectionId = function (e) {
        return JSON.stringify(e);
    };

    // both
    var formatAjaxError = function (jqXHR, textStatus, errorThrown) {
        //Os browsers retornavam mensagens de erros diferentes quando a sessão expira
        if (jqXHR.status === 401)
            return jqXHR.statusText;

        if (jqXHR.responseJSON === undefined)
            return errorThrown;

        if (!jqXHR.responseJSON.ExceptionMessage || !jqXHR.responseJSON.ExceptionMessage.length) {
            if (!jqXHR.responseJSON.Message || !jqXHR.responseJSON.Message.length)
                return errorThrown;

            return jqXHR.responseJSON.Message;
        }
        return jqXHR.responseJSON.ExceptionMessage;
    };

    return {
        init: function () {
            handleSelect2();
        }
    };
}();

Benner.Search.dependValueList = "";

Benner.Search.addDependValueList = function (dataField, details) {
    //Adiciona na lista de campo dependentes o campo pai
    if (details.params !== undefined) {
        if (details.params === null) {
            //Adiciona na lista de campo dependentes os campos que depende
            Benner.Search.dependValueList = "|" + dataField + Benner.Search.dependValueList;
            return true;

        } else if (details.params.data.id !== -1) {
            //Adiciona na lista de campo dependentes o campo pai
            Benner.Search.dependValueList = dataField + Benner.Search.dependValueList;
        }
    } else {
        Benner.Search.dependValueList = dataField;
    }
    return false;
};

Benner.Search.callScriptPython = function (searchControl, changeEventParam) {
    Benner.Control.storeCurrentFocus(searchControl, "same");
    Benner.Control.callFieldEventScript(changeEventParam, Benner.Search.dependValueList);

    Benner.Search.dependValueList = "";
};

Benner.Search.getEventParam = function () {
    //Garante que não existe '|' no inicio da linha
    if (Benner.Search.dependValueList.charAt(0) == "|")
        Benner.Search.dependValueList = Benner.Search.dependValueList.substring(1, Benner.Search.dependValueList.length);
    //Recupera o primeiro item da lista
    var dataField = Benner.Search.dependValueList.substring(0, Benner.Search.dependValueList.indexOf("|"));
    return $("[data-field='" + dataField + "']").data('changeeventparam');
};

Benner.Search.updateValueSelected = function (idSearchControl, typeOperation) {
    var selectedVal;

    let control = $("#" + idSearchControl);
    if (control.attr("multiple") === "multiple") {
        var itemsSelected = [];
        var itemsSelectedData = $("#" + idSearchControl).select2("data");
        for (var i = 0; i < itemsSelectedData.length; i++) {
            itemsSelected.push({ id: itemsSelectedData[i].id, text: itemsSelectedData[i].text });
        }
        selectedVal = JSON.stringify({ Readonly: false, View: false, SelectedItems: itemsSelected });
    } else {
        if (typeOperation === 1) {
            selectedVal = "";
        } else {
            selectedVal = JSON.stringify({
                Readonly: false,
                View: false,
                SelectedItems: [{ id: control.val(), text: control.find(":selected").text() }]
            });
        }
    }

    let $inputHidden = Benner.Search.getInputHidden(control);
    $inputHidden.val(selectedVal);
};

Benner.Search.setValue = function (id, value) {
    var objValue = JSON.parse(value);

    parent.$("#" + id).append("<option value=" + objValue.ID + " selected=\"selected\">" + objValue.Value + "</option>");
    parent.$("#" + id).trigger("select2:select");

    parent.Benner.ModalPage.hide();

    parent.$("#" + id).trigger("focus");
};

//Verifica se o usuário possui permissão para visualizar o botão para realizar cadastro no lookup
Benner.Search.validationPermissionButtonRegister = function (searchControl, typeOperation) {
    if (typeOperation === 0 && $(searchControl).data("canupdate") === "False")
        return false;
    else if (typeOperation === 1 && $(searchControl).data("caninsert") === "False")
        return false;

    return true;
};

Benner.Search.createButtonToRegister = function (searchControl, typeOperation) {
    if ($(searchControl).data("url") !== "" && $(searchControl).data("canurl") === "True") {

        var btnKeepRecord = $(searchControl).parent().find(".input-group-btn.keep-record");
        if (!Benner.Search.validationPermissionButtonRegister(searchControl, typeOperation))
            btnKeepRecord.hide();
        else
            btnKeepRecord.show();

        if (typeOperation === 0) {
            btnKeepRecord.children().attr("class", "btn blue");
            btnKeepRecord.children().children().attr("class", "fa fa-pencil");
        } else {
            btnKeepRecord.children().attr("class", "btn green");
            btnKeepRecord.children().children().attr("class", "fa fa-plus");
        }
    }
};

Benner.Search.valueChanged = function (searchControl, details, typeOperation) {

    if (searchControl == null)
        return;

    var containerControl = Benner.Search.getContainerControl($(searchControl).attr("id"));

    var dataField = $(searchControl).data('field');

    Benner.Search.updateValueSelected($(searchControl).attr("id"), typeOperation);
    Benner.Search.createButtonToRegister(searchControl, typeOperation);

    // Deve limpar os dependidos caso seja um lookup normal ou caso seja um filtro, neste caso o 'removed' será um array e não um objeto. 
    // Ainda, caso seja um array ele deverá ter ao menos 1 elemento.
    Benner.Search.clearDepends(dataField, containerControl);

    var changeEventType = $(searchControl).data('changeeventtype');
    if ((!changeEventType || !changeEventType.length) && (details.added !== undefined && details.added.id === -1)) {
        return;
    }

    var changeEventParam = $(searchControl).data('changeeventparam');

    switch (changeEventType) {
        case "callpython":
            if (Benner.Search.addDependValueList(dataField, details))
                return;
            Benner.Search.callScriptPython(searchControl, changeEventParam);

            var prm = Sys.WebForms.PageRequestManager.getInstance();
            prm.add_endRequest(function endRequest(sender, args) {
                Benner.Search.updatePathFields(searchControl, containerControl);
                Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(endRequest);
            });
            break;
        case "rowchanged":
            Benner.EditableGrid.rowChanged(changeEventParam.lblchangerecord, changeEventParam.grid + "_DataChangedCollecion", changeEventParam.handle);
            Benner.Search.updatePathFields(searchControl, containerControl);
            Benner.Control.storeCurrentFocus(searchControl, "same");
            break;
        default:
            //Caso seja vazio recupera o primeiro eventparam da lista de camps dependente
            if (changeEventParam == undefined || changeEventParam === "")
                changeEventParam = Benner.Search.getEventParam();

            Benner.Search.updatePathFields(searchControl, containerControl);
            Benner.Search.callScriptPython(searchControl, changeEventParam);

            break;
    }
};

Benner.Search.getContainerControl = function (idSearchControl) {

    var identifierSearchControl = "#" + idSearchControl;
    // verifica se está em uma linha do grid editável
    var gridRow = $(identifierSearchControl).closest("tr[handle!=''][handle]");
    if (gridRow && gridRow.length)
        return gridRow;


    // verifica se está em um filtro de grid
    var filter = $(identifierSearchControl).closest("div.filter-form");
    if (filter && filter.length)
        return filter;


    // verifica se está em um formulário
    var form = $(identifierSearchControl).closest("div.portlet-body.form");
    if (form && form.length)
        return form;


    // verifica se está dentro de um widget qualquer, customizado por exemplo
    var portlet = $(identifierSearchControl).closest("div.portlet");
    if (portlet && portlet.length)
        return portlet;

    // senão encontrou nenhuma das opções, manda o form mesmo
    return $(identifierSearchControl).closest("form");
};

Benner.Search.clearDepends = function (sourceFieldName, containerControl) {
    if (!sourceFieldName || !sourceFieldName.length)
        return;

    $(containerControl)
        .find("select[data-dependlist*='$" + sourceFieldName + "$']")
        .each(function () {
            switch ($(this).data("type")) {
                case "association": {
                    if ($(this).val() !== null) {
                        var evt = $.Event('select2:unselect', {
                            params: null
                        });
                        $(this).val(null).change();
                        $(this).trigger(evt);
                    }
                    break;
                }
                case "aggregation": {
                    $(this).val(null).trigger("select2:unselect");
                    break;
                }
            }
        });
};

Benner.Search.updatePathFields = function (sourceControl, containerControl) {
    if (sourceControl == null)
        return;

    var sourceFieldName = $(sourceControl).data('field');
    if (!sourceFieldName || !sourceFieldName.length)
        return;

    var pathFields = [];
    var sourceViewName;

    $(containerControl).find("input[type='text'][data-type='path'][data-dependlist*='$" + sourceFieldName + "$']")
        .each(function () {
            $(this).val('');
            pathFields.push($(this).data('field'));
            if (!sourceViewName || !sourceViewName.length)
                sourceViewName = $(this).data('entityview');
        });
    
    if (!pathFields || !pathFields.length)
        return;

    var sourceFieldValue = Benner.Search.getAssociationFieldValue(sourceControl);
    if (!sourceFieldValue || !sourceFieldValue.length)
        return;

    Benner.Services.getPathFieldResultValues(
        sourceViewName,
        sourceFieldName,
        sourceFieldValue,
        pathFields,
        Benner.Search.changePathValuesOnSucess(pathFields, containerControl));
};

Benner.Search.changePathValuesOnSucess = function (pathFields, containerControl) {
    return function (data) {
        for (var i = 0; i < pathFields.length; i++) {
            var input = Benner.Search.getControlByDataField(pathFields[i], containerControl);
            if (input != null) {
                input.value = data[pathFields[i]];
            }
        }
    };
};

Benner.Search.TryRecoverDependValueList = function (searchControl) {
    try {
        Benner.Search.recoverDependValueList($("#" + searchControl));
        return true;
    }
    catch (err) {
        return false;
    }
};

Benner.Search.recoverDependValueList = function (searchControl) {

    var dependNames = $(searchControl).data('dependlist');
    var containerControl = Benner.Search.getContainerControl($(searchControl).attr("id"));

    var result = "";
    if (!dependNames || !dependNames.length)
        return result;

    var dependNameList = $.unique(dependNames.split(",")); //jquery >= 3.0 deve ser usado uniqueSort
    for (var i = 0; i < dependNameList.length; i++) {

        var fieldName = dependNameList[i].replace("~", "");
        fieldName = fieldName.replace(/\$/g, ''); //replaceAll do char '$'
        var fieldValue = "";

        var targetcontrol = Benner.Search.getControlByDataField(fieldName, containerControl);

        fieldValue = Benner.Search.getFieldValue(targetcontrol);
        fieldTitle = Benner.Search.getFieldLabel(targetcontrol);

        var message = "";
        if (!fieldValue || !fieldValue.length) {
            if (dependNameList[i].indexOf('~') === -1) {
                message = "Falta preencher campo '" + (typeof (fieldTitle) == "undefined" ? fieldName : fieldTitle) + "'.";
                alert(message);
                throw message;
            } else if (targetcontrol == null) {
                fieldValue = -1;
            } else {
                fieldValue = Benner.Search.getDefaultValue(targetcontrol);
            }
        }

        if ((!fieldValue || !fieldValue.length) && dependNameList[i].indexOf('~') === -1) {
            message = "Falta preencher campo '" + fieldTitle + "'.";
            alert(message);
            throw message;
        }


        if (result.length > 0)
            result += "|";

        result += fieldName + "=" + fieldValue;
    }

    return result;
};

Benner.Search.getControlByDataField = function (fieldName, containerControl) {
    return Benner.Search.getControlByAttribNameAndValue("data-field", fieldName, containerControl);
};

Benner.Search.getControlByAttribNameAndValue = function (name, value, containerControl) {

    var targetcontrol = $(containerControl).find("[" + name + "='" + value + "']");
    if (targetcontrol.length > 0)
        return targetcontrol[0];
    return null;
};

Benner.Search.getDefaultValue = function (control) {
    switch ($(control).data("type")) {

        case "date":
        case "time": return "@DATA(30/12/1899)";

        case "aggregation":
        case "association":
        case "currency":
        case "number":
        case "integer": return "-1";

        case "list":
        case "boolean":
        case "tab":
        case "radio":
        case "string":
        default: return "";
    }
};

Benner.Search.getFieldValue = function (control) {
    switch ($(control).data("type")) {
        case "association": return Benner.Search.getAssociationFieldValue(control);
        case "aggregation": return Benner.Search.getAggregationFieldValue(control);
        case "list": return Benner.Search.getListFieldValue(control);
        case "date": return Benner.Search.getDateTimeFieldValue(control);
        case "time": return Benner.Search.getTimeFieldValue(control);
        case "boolean": return Benner.Search.getBooleanFieldValue(control);
        case "tab": return Benner.Search.getTabFieldValue(control);
        case "radio": return Benner.Search.getRadioFieldValue(control);
        case "string": return Benner.Search.getStringFieldValue(control);
        case "currency": return Benner.Search.getCurrencyFieldValue(control);
        case "number": return Benner.Search.getNumberFieldValue(control);
        case "integer": return Benner.Search.getIntegerFieldValue(control);
        case "hidden": return Benner.Search.getHiddenFieldValue(control);
        default: return "";
    }
};

Benner.Search.getFieldLabel = function (control) {
    return $(control).data("label");
};

Benner.Search.getAssociationFieldValue = function (control) {
    let value = Benner.Search.getFieldBennerSearch(control);

    if (value === null || value === "")
        return "";

    let data = JSON.parse(value);
    if (data.SelectedItems == null || data.SelectedItems[0].id.toString() === "-1")
        return "";

    return data.SelectedItems[0].id.toString();
};

Benner.Search.getAggregationFieldValue = function (control) {
    let values = Benner.Search.getFieldBennerSearch(control);

    if (!values || !values.length)
        return "";

    let ids = [];
    let data = JSON.parse(values);
    //Resgata apenas os ids
    $(data.SelectedItems).each(function () {
        ids.push(this.id);
    });

    if (ids.length === 0)
        return "";

    //Retorna os handles separados por virgula
    return ids.join(", ");
};

Benner.Search.getInputHidden = function (control) {
    let $inputId = $(control).data("inputhiddenid");
    let $inputHidden = $("#" + $inputId);

    if ($inputHidden == null) {
        throw new Error('InputHidden não encontrado do lookup: ' + $(control).attr('id'));
    }

    return $inputHidden;
};

Benner.Search.getFieldBennerSearch = function (control) {
    //SELECT é preciso criar um objeto porque o input tem os dados no formato JSON
    if ($(control).is("select")) {
        return Benner.Search.getInputHidden(control).val();
    } else {
        return $(control).val();
    }
};

Benner.Search.getListFieldValue = function (control) {
    var value;
    if ($(control).is("[readonly]"))
        value = $(control).attr("key").toString();
    else
        value = $(control).val().toString();
    if (value === "-1")
        return "";

    return value;
};

Benner.Search.getDateTimeFieldValue = function (control) {

    var date = $(control).val().toString();

    var containerControl = Benner.Search.getContainerControl($(control).attr("id"));

    var timeControl = Benner.Search.getControlByAttribNameAndValue("data-field-time", $(control).data("field"), containerControl);
    var time = (timeControl != null)
        ? $(timeControl).val().toString()
        : undefined;

    if (time && time.length)
        return date + " " + time;

    return date;
};


Benner.Search.getTimeFieldValue = function (control) {
    var time = $(control).val().toString();
    return time;
};

Benner.Search.getBooleanFieldValue = function (control) {
    return $(control).attr("checked") === "checked" ? 'S' : 'N';
};

Benner.Search.getTabFieldValue = function (control) {

    var checkOption = $(control).find("input[type='radio'][checked='checked']");
    if (checkOption && checkOption.length) {
        var value = $(checkOption).val();
        return value;
    }
    return "";
};

Benner.Search.getRadioFieldValue = function (control) {
    var checkedOption = control.querySelector("input:checked");
    if (checkedOption !== null) {
        return checkedOption.value;
    }
    return "";
};

Benner.Search.getStringFieldValue = function (control) {
    return $(control).val().toString();
};

Benner.Search.getCurrencyFieldValue = function (control) {
    var value = $(control).val().toString();
    if (value && value.length)
        value = value.replace("R$ ", "").replace(".", "").replace(",", ".");

    return value;
};

Benner.Search.getNumberFieldValue = function (control) {
    var value = $(control).val().toString();
    if (value && value.length)
        value = value.replace(".", "").replace(",", ".");

    return value;
};

Benner.Search.getIntegerFieldValue = function (control) {
    var value = $(control).val().toString();
    if (value && value.length)
        value = value.replace(".", "");

    return value;
};

Benner.Search.getHiddenFieldValue = function (control) {
    return $(control).val().toString();
};

Benner.Search.close = function () {
    $('select.select2-hidden-accessible').each(function () {
        $(this).select2('close');
    });
};

Benner.Search.fixFirefox = function () {
    // fix para erro que ocorre no Firefox: "TypeError: access to strict mode caller function is censored"
    if (!window.event)
        window.event = new Object();
    // mais detalhes em: http://bugs.jquery.com/ticket/13335
    // para ver o código do __doPostBack, veja o método: 
    // function Sys$WebForms$PageRequestManager$_doPostBack(eventTarget, eventArgument) {
    // em: http://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjaxWebForms.debug.js
};

Benner.Search.getFocusedSelect2 = function () {
    var $select2 = $(".benner-search.select2-event-close");
    if ($select2.length > 0) {
        $select2.removeClass("select2-event-close");
        return true;
    }
    return false;
};

module.exports = Benner.Search;