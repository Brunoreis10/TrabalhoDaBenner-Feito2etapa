import Utils from '~/content/js/DataSourceEditorUtils.js';
import Repository from '~/content/js/DataSourceEditorRepository.js';

var Lookup = 6;
var textoPadraoSelecao = 'Selecione...';
var temporarySelectedFields = [];
var lookupFieldLevel = 0;
var aceEditor;

var success = 'success';
var error = 'danger';

var dataSource = {
	Handle: 0,
	Identifier: '',
	Name: '',
	Descritpion: '',
	FromSql: {
		Alias: 'A',
		SelectCommand: ''
	},
	Fields: [

	],
	Filter: ''
};

var repository = new Repository();

Benner.DataSourceEditor = function () {};

Benner.DataSourceEditor.getDataSource = function (dataSourceIdentifier) {
	dataSource = repository.getDataSource(dataSourceIdentifier);

	$('#Identificacao').val(dataSource.Identifier);
	$('#Nome').val(dataSource.Name);

	if (dataSource.FromSql != null) {
		$('#lblDataSourceType_table').remove();

		Benner.DataSourceEditor.initAceEditor();

		$('#alias').attr('readonly', true);

		for (var i = 0; i < dataSource.Fields.length; i++) {
			var field = dataSource.Fields[i];
			field.Handle = new Date().getTime() + i;
			Benner.DataSourceEditor.addSelectedField(field, false);
		}
	}
	
	if (dataSource.Handle != 0) {
		$('input[type=radio][name=dataSourceType]').attr('disabled', 'disabled');
	}
	
	Benner.DataSourceEditor.initFields();
};

Benner.DataSourceEditor.getFieldPathFromTemporaryFields = function () {
	var path = '';

	for (var i = 0; i < temporarySelectedFields.length; i++) {
		var temporaryField = temporarySelectedFields[i];

		if (temporaryField.table == Utils.getTextFromSelect($('#tabelas')))
			path += temporaryField.name;
		else
			path += temporaryField.table + '.' + temporaryField.name;

		if (i != temporarySelectedFields.length - 1)
			path += '>';
	}

	return path;
};

Benner.DataSourceEditor.getFieldAliasFromTemporaryFields = function () {
	if (temporarySelectedFields.length == 1)
		return temporarySelectedFields[0].name;

	return temporarySelectedFields[temporarySelectedFields.length - 1].name + temporarySelectedFields[temporarySelectedFields.length - 2].name;
};

Benner.DataSourceEditor.getFieldClassFromTemporaryFields = function () {
	if (temporarySelectedFields.length == 1)
		return temporarySelectedFields[0].fieldClass;

	return temporarySelectedFields[temporarySelectedFields.length - 1].fieldClass;
};

Benner.DataSourceEditor.getFieldFromTemporaryFields = function () {
	var field = {
		Handle: new Date().getTime(),
		Alias: Benner.DataSourceEditor.getFieldAliasFromTemporaryFields(),
		Path: Benner.DataSourceEditor.getFieldPathFromTemporaryFields(),
		Description: '',
		FieldClass: getFieldClassFromTemporaryFields(),
		IsTableField: true
	};

	return field;
};

Benner.DataSourceEditor.addSelectedField = function (field, canHandleNDelete) {
    var fieldId = new Date().getTime();
    if (field.Handle == 0) {
        field.Handle = fieldId;
	}

	var fieldHtml = '<li class="dd-item dd3-item" data-id="' + field.Handle + '">';
	if (canHandleNDelete) {
		fieldHtml += '<div class="dd-handle dd3-handle"></div>';
	}
	fieldHtml += '<div class="dd3-content">';
	if (canHandleNDelete) {
		fieldHtml += '<a class="delete-field btn btn-xs btn-circle red pull-right"><i class="fa fa-minus" style="width: 10px;"></i></a>';
	}
	//fieldHtml += '<div class="fieldPath">' + field.Path + '</div><div class="fieldAlias">' + field.Alias + '</div>';
	fieldHtml += '<div class="fieldPath">' + field.Path + '</div>';
	fieldHtml += '</li>';

	$('#lista-campos-selecionados').append(fieldHtml);
	temporarySelectedFields = [];
};

Benner.DataSourceEditor.setNewDataSourcePageBehavior = function () {
	$('#lblDataSourceType_table').remove();
	Benner.DataSourceEditor.initAceEditor();
};

Benner.DataSourceEditor.initAceEditor = function () {
	aceEditor = ace.edit("selectCommand");
	aceEditor.setTheme("ace/theme/chrome");
	aceEditor.getSession().setMode("ace/mode/sql");
	aceEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});

	if (dataSource.FromSql != null && dataSource.FromSql.SelectCommand != undefined && dataSource.FromSql.SelectCommand != '') {
		aceEditor.setValue(dataSource.FromSql.SelectCommand);
	}

	$('#selectCommand').keyup(function (e) {
		if (e.keyCode == 27) // esc
			e.stopPropagation();
	});
};

Benner.DataSourceEditor.updateDataSourceDefinition = function (data) {
	dataSource.Handle = data.Handle;
	dataSource.Identifier = data.Identifier;
	$('#Identificacao').val(dataSource.Identifier);
	dataSource.Name = data.Name;
	$('#Nome').val(dataSource.Name);
	//Benner.DataSourceEditor.updateBreadCrumb();
	dataSource.Fields = data.Fields;
	$('#lista-campos-selecionados').html('');
	$.each(data.Fields, function (i) {
		Benner.DataSourceEditor.addSelectedField(this, data.FromTable != null && data.FromTable.Name != null);
	});
};

Benner.DataSourceEditor.updateBreadCrumb = function () {
	$('li:last', $('.page-breadcrumb'))[0].childNodes[0].text = dataSource.Name;
};

Benner.DataSourceEditor.showMessage = function (type, message) {
	App.alert({
		type: type,
		message: message,
		container: $('#datasources-content'),
		place: 'prepend'
	});
	Benner.Control.restoreFocus();
};

Benner.DataSourceEditor.clearFields = function(all) {
    $('#datasources-content .custom-alerts').remove();
    $('#lista-campos-selecionados').html('');
    dataSource.Fields = [];
    if (all) {
        // O select2 estava atribuindo 100px de largura para o container ao voltar de estar escondido
        $('.select2-container').css('width', '100%');
        
        if (aceEditor != undefined) {
            aceEditor.setValue('');
        }
    }
}


Benner.DataSourceEditor.init = function () {

    var dataSourceIdentifier = $('#DatasourceID').val();
    if (dataSourceIdentifier == "") {
        Benner.DataSourceEditor.setNewDataSourcePageBehavior();
    } else {
        Benner.DataSourceEditor.getDataSource(dataSourceIdentifier);
    }

    $('input[type=radio][name=dataSourceType]').on('change', function () {
        if (dataSource.Handle == 0) {
            Benner.DataSourceEditor.clearFields('all');
        }
    });

    $('#obter-colunas').on('click', function () {
        Benner.DataSourceEditor.clearFields();
        dataSource.FromSql.SelectCommand = aceEditor.getValue();
        var result = repository.getFieldsFromQuery(dataSource.FromSql.SelectCommand);
        if (result.status != null && result.status >= 400 && result.responseJSON.ExceptionMessage) {
            Benner.DataSourceEditor.showMessage('warning', result.responseJSON.ExceptionMessage);
            return;
        }
        $.each(result, function (i) {
            dataSource.Fields.push(this);
            Benner.DataSourceEditor.addSelectedField(this, false);
        });
        Benner.DataSourceEditor.initFields();
    });

    $('#Identificacao').on('focusout', function () {
        dataSource.Identifier = $('#Identificacao').val();
    });

    $('#Nome').on('focusout', function () {
        dataSource.Name = $('#Nome').val();
    });

    $('#salvar').on('click', function () {
        dataSource.Identifier = $('#Identificacao').val();
        dataSource.Name = $('#Nome').val();
        dataSource.Filter = $('#filter').val();
        if (dataSource.FromSql != null) {
            dataSource.FromSql.SelectCommand = aceEditor.getValue();
        }

        let dataSourceRequest = {
            DataSource: dataSource,
            PageWidget: $('#PageWidget').val()
        };

        if (dataSource.Handle == 0) {
            let data = repository.create(dataSourceRequest);
            if (data.status != null && data.status >= 400 && data.responseJSON) {
                Benner.DataSourceEditor.showMessage('danger', data.responseJSON);
            } else if (data != null && data.DataSource != null) {
                Benner.DataSourceEditor.updateDataSourceDefinition(data.DataSource);
                Benner.DataSourceEditor.showMessage('success', "Cria&ccedil;&atilde;o da consulta realizada com sucesso!");
                $('#Identificacao').disabled = true;
            } else {
                Benner.DataSourceEditor.showMessage('danger', "Erro na cria&ccedil;&atilde;o da consulta.");
            }
        } else {
            let data = repository.save(dataSourceRequest);
            if (data != null && data.DataSource != null) {
                Benner.DataSourceEditor.updateDataSourceDefinition(data.DataSource);
                Benner.DataSourceEditor.showMessage("success", "Atualiza&ccedil;&atilde;o da consulta realizada com sucesso!");
            } else {
				var message = "Erro na atualiza&ccedil;&atilde;o da consulta:";
				if (data && data.Error)
					message += "<br>" + data.Error;
                Benner.DataSourceEditor.showMessage("danger", message);
            }
        }
    });

    $('#alias').on('change', function () {
        let id = this.dataset.fieldid;
        let field = _.find(dataSource.Fields, function (i) {
            return i.Handle == id;
        });
        field.Alias = this.value;
    });

    $("#alias").on({
        keydown: function (e) {
            if (e.which === 32)
                return false;
        },
        change: function () {
            this.value = this.value.replace(/\s/g, "");
        }
    });

    Benner.DataSourceEditor.initFields();
}

Benner.DataSourceEditor.initFields = function () {
    $('.dd-item').on('click', function () {
        let id = this.dataset.id;
        let field = _.find(dataSource.Fields, function (i) {
            return i.Handle == id;
        });
        $('#path').val(field.Path);
        $('#alias').val(field.Alias);
        $('#alias')[0].dataset.fieldid = id;
    });
    
    $('.delete-field').on('click', function(){
    	
    	var fieldHandle = parseInt($(this).closest('li.dd-item').attr('data-id'));
        var fieldIndex = _.findIndex(dataSource.Fields, {
            Handle: fieldHandle
        });

		$(this).closest('li.dd-item').remove();
		dataSource.Fields.splice(fieldIndex, 1);

		return false;
	});
}

export default Benner.DataSourceEditor