Benner.PivotTable = function () {
    // Evento de clique de tela cheia
    var resizePivotGrid = function (portlet, height) {
        var newHeight;
        if(height !== undefined) {
            newHeight = height - 50;
            if (portlet.parent("div[widget-type='PivotTable']").hasClass('minimized'))
                portlet.find('.caption.collapsible').click();
            portlet.find('.collapse').hide();
            $($('.dx-pivotgrid', portlet)[0]).dxPivotGrid("instance").getDataSource().reload();
        } else {
            portlet.find('.collapse').show();
            // O portlet enviado pelo evento possui o padrão 'portlet_' + título do widget
            var widgetID = portlet.attr('ID').replace('portlet_', '');
            // Hidden field com a altura do cubo
            var originalWidgetHeigth = $('#' + widgetID + '_heigth').val();
            newHeight = originalWidgetHeigth - 40;
            $($('.dx-pivotgrid', portlet)[0]).dxPivotGrid({ height: newHeight });
        }

        $(portlet).find('.dx-pivotgrid-container').height(newHeight);
        $(portlet).find('.dx-pivotgrid').resize();

        $.initialize('.dx-overlay-wrapper.dx-fieldchooser-popup.dx-popup-wrapper', function () {
            $(this).css('z-index', 10070);
        });  
    }

    var beforeDataLoad = function (div) {
        var pivotContent = $('#' + div);

        pivotContent.parents("div[widget-type='PivotTable'] .portlet-body").height(pivotContent.height());
        pivotContent.parent().hide();
        App.blockUI({ target: pivotContent.parents("div[widget-type='PivotTable']"), animate: true });
    }

    var afterDataLoad = function (div) {
        var pivotContent = $('#' + div);

        App.unblockUI(pivotContent.parents("div[widget-type='PivotTable']"));
        pivotContent.parent().show();
        pivotContent.parents("div[widget-type='PivotTable'] .portlet-body").removeAttr('style');
    }

    var handleError = function (div, message, messageLog) {
        afterDataLoad(div);

        console.log(message);
		if(messageLog !== undefined) {
			console.log(messageLog);
        }

        var userMessage = messageLog;
        if (userMessage === undefined)
            userMessage = message;

        $('#' + div + '').html($.trim(userMessage).replace(/"/g , ""));
		$('#' + div + '').css('height', '50px');
    }

    var formatDecimal = function (value) {
        return Globalize.formatNumber(value);
    }

    var formatPercentual = function (value) {
        var options = {
            style: "percent",
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }
        return Globalize.formatNumber(value, options);
    }

    var prepareFields = function (fields) {
        $.each(fields, function (i, field) {
            if (field.summaryDisplayMode !== undefined && field.summaryDisplayMode.indexOf('percent') !== -1) {
                field.format.formatter = formatPercentual
            }
            field.headerFilter = {
                width: 280,
                height: 400
            };
        });
    }

    var getFunctionArgs = function (func) {
        // First match everything inside the function argument parens.
        var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

        // Split the arguments string into an array comma delimited.
        return args.split(',').map(function (arg) {
            // Ensure no inline comments are parsed and trim the whitespace.
            return arg.replace(/\/\*.*\*\//, '').trim();
        }).filter(function (arg) {
            // Ensure no undefined values are added.
            return arg;
        });
    }

    var setSelectorFunctions = function (fields) {
        var selectors = $.grep(fields, function (n) {
            return n.selector !== undefined;
        });
        for (var i = 0; i < selectors.length; i++) {
            var expression = selectors[i].selector;
            selectors[i].selector = function (data) {
                var argName = getFunctionArgs(this.selector);
                expression.replace(new RegExp('data.', 'g'), argName + '.')

                try {
                    var funcWithCorrectArgName = new Function('data', 'return eval(' + expression + ')');
                    return funcWithCorrectArgName(data);
                }
                catch (err) {
                    return null;
                }
            }
        }
    }

    var setNumberFormatter = function (fields) {
        var decimals = $.grep(fields, function (n) {
            return n.dataType === 'number';
        });
        for (var i = 0; i < decimals.length; i++) {
            if (decimals[i].format !== undefined) {
                if (decimals[i].format.precision !== undefined) {
                    let options = {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: Number(decimals[i].format.precision),
                        maximumFractionDigits: Number(decimals[i].format.precision)
                    }
                    decimals[i].format.formatter = function (value) {
                        return Globalize.formatNumber(value, options);
                    }
                }
                else {
                    decimals[i].format.formatter = formatDecimal;
                }

                if (decimals[i].format.type === 'undefined' || (decimals[i].format.type !== 'undefined' && decimals[i].format.type !== 'currency'))
                    decimals[i].format.type = 'fixedPoint';
            }
            else {
                decimals[i].format = {
                    formatter: formatDecimal
                }
            }
        }
    }

    var handleSpecialFields = function (fields) {
        setSelectorFunctions(fields);
        setNumberFormatter(fields);
    }

    var contextMenuPreparing = function (e) {
        var dataSource = e.component.getDataSource(),
            sourceField = e.field;

        if (sourceField) {
            if (sourceField.dataType === 'number') {
                var setSummaryType = function (args) {
                    var field = {};
                    if (args.itemData.context === 'percent') {
                        field = {
                            summaryType: 'sum',
                            summaryDisplayMode: args.itemData.value,
                            format: {
                                formatter: formatPercentual
                            }
                        };
                    } else if (args.itemData.context === 'regular') {
                        field = {
                            summaryType: args.itemData.value,
                            summaryDisplayMode: undefined,
                            format: {
                                formatter: formatDecimal
                            }
                        };
                    }
                    dataSource.field(sourceField.index, field);
                    dataSource.load();
                }

                summaryItems = [];

                e.items.push({ text: 'Tipo agregação', items: summaryItems });

                $.each([
                    { text: 'Soma', context: 'regular', type: 'sum' },
                    { text: 'Média', context: 'regular', type: 'avg' },
                    { text: 'Mínimo', context: 'regular', type: 'min' },
                    { text: 'Máximo', context: 'regular', type: 'max' },
                    { text: 'Quantidade', context: 'regular', type: 'count' },
                    { text: 'Percentual da linha (total geral)', context: 'percent', type: 'percentOfRowTotal' },
                    { text: 'Percentual da coluna (total geral)', context: 'percent', type: 'percentOfColumnTotal' }
                ], function (_, summaryType) {
                    var summaryTypeValue = summaryType.type;

                    var selected = false;
                    if (summaryType.context === 'regular') {
                        selected = sourceField.summaryType === summaryTypeValue && sourceField.summaryDisplayMode === undefined;
                    } else {
                        selected = sourceField.summaryDisplayMode === summaryTypeValue && sourceField.summaryType === 'sum';
                    }

                    summaryItems.push({
                        text: summaryType.text,
                        context: summaryType.context,
                        value: summaryType.type,
                        onItemClick: setSummaryType,
                        selected: selected
                    });
                });
            }
        }
    }
    
    var initPivotGrid = function (data, pivotTable, div, height, stateStorageKey, showFields, exportFileName) {
    	if(data.error != undefined) {
    	    handleError(div, data.error);
    		return;
    	}
    	handleSpecialFields(data.fields);

        data.onFieldsPrepared = prepareFields;

        $('#' + div + '').dxPivotGrid({
            allowSortingBySummary: true,
            allowSorting: true,
            allowFiltering: true,
            allowExpandAll: true,
            rowHeaderLayout: 'tree',
            height: height,
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: stateStorageKey
            },
            showBorders: true,
            scrolling: {
                mode: 'virtual'
            },
            fieldPanel: {
                showColumnFields: showFields,
                showDataFields: showFields,
                showRowFields: showFields,
                showFilterFields: true,
                allowFieldDragging: true,
                visible: true
            },
            fieldChooser: {
                enabled: true,
                height: Math.round(document.documentElement.clientHeight * 0.7),
                width: Math.round(document.documentElement.clientWidth * 0.7)
            },
            export: {
                enabled: true,
                fileName: exportFileName
            },
            onContextMenuPreparing: contextMenuPreparing,
            dataSource: data
        });

        

        if((navigator.language || navigator.browserLanguage) === "pt-BR") {
        	DevExpress.config({defaultCurrency: 'BRL'})
        }
    }

    var init = function (pivotTable, div, height, stateStorageKey, showFields, exportFileName) {
        head.js(
            Benner.Page.versionedResource('content/assets/plugins/jquery.initialize/jquery.initialize.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/libs/jszip/3.1.2/jszip.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/event.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/globalize.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/globalize/message.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/globalize/number.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/globalize/currency.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/globalize/date.min.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/dx.all.js'),
            Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/localization/dx.all.br.js'),
            function () {
                $.when(
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/ca-gregorian.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/numbers.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/currencies.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/en/ca-gregorian.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/en/currencies.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/main/en/numbers.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental/likelySubtags.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental/timeData.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental/weekData.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental/currencyData.json')),
                    $.get(Benner.Page.versionedResource('content/assets/plugins/dx-pivotgrid/js/cldr/supplemental/numberingSystems.json'))
                ).then(function () {
                    // Normalize $.get results, we only need the JSON, not the request statuses.
                    return [].slice.apply(arguments, [0]).map(function (result) {
                        return result[0];
                    });
                }).then(
                    Globalize.load
                    ).then(function () {

                        Globalize.locale(navigator.language || navigator.browserLanguage);

                        var pivotTableWidget = $('#' + div).parents("div[widget-type='PivotTable']");
                        if (pivotTableWidget.hasClass('minimized')) {
                            $('#' + div).removeAttr('style');
                            return;
                        }

                        beforeDataLoad(div);

                        $.when(
                            $.getJSON(Benner.Page.getApplicationPath() + 'api/pivottables/' + pivotTable + '/')
                        ).then(
                            function (data) {
                                initPivotGrid(data, pivotTable, div, height, stateStorageKey, showFields == "True", exportFileName);
                                afterDataLoad(div);
                            },
                            function (data) {
                                var message, messageLog;
                                if (data.status == 500 || data.status == 400) {
                                    message = data.statusText;
                                    messageLog = data.responseText;
                                } else {
                                    message = messageLog = data.responseText;
                                }
                                handleError(div, message, messageLog);
                            }
                            );
                    });
            });
        App.handleThirdPartyFullscreen = resizePivotGrid;
    }

    return {
        init: init
    }
};

module.exports = Benner.PivotTable()