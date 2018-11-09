Benner.ModalPage = function () {

    function getModalHeight(option) {
        if (option.height)
            return option.height;

        return 350;
    };

    function getModalSize(option) {
        if (option.size) {
            if (option.size === 'default')
                return '';
            if (option.size === 'fullpage')
                return '';
            if (option.size === 'large')
                return 'bs-modal-lg';
            if (option.size === 'small')
                return 'bs-modal-sm';
        }

        return '';
    };

    function getModalDialogSize(option) {
        if (option.size) {
            if (option.size === 'default')
                return '';
            if (option.size === 'fullpage')
                return 'modal-full';
            if (option.size === 'large')
                return 'modal-lg';
            if (option.size === 'small')
                return 'modal-sm';
        }

        return '';
    };

    function getModalTitle(options) {
        if (options.title != null)
            return options.title;

        return 'Título não definido';
    }

    function getModalId(option) {
        if (option.id)
            return option.id + '_modal';

        return new Date().getTime() + '_modal';
    };

    function getButtonLabel(options) {
        if (options.buttonLabel != null)
            return options.buttonLabel;

        return 'Ok';
    }

    function displayFooter(options) {
        if (options.displayFooter != null)
            return options.displayFooter;

        return true;
    }

    function displayTitle(options) {
        if (options.displayTitle != null)
            return options.displayTitle;

        return true;
    }

    function generateDefaultContent(options) {
        if (options.generateDefaultContent != null)
            return options.generateDefaultContent;

        return true;
    }

    function initializeEvent(id, openAction, closeAction) {

        var idCloseButton = '#' + id + 'CloseButton';

        $('#' + id).on('shown.bs.modal', function () {
            $('#' + id + ' iframe').contents().focusOnFirstField();
            
            if (openAction != null && typeof (openAction) == "function")
                openAction.call();

            Benner.WidgetCommandsBar.displayFooterCommandsBar($('#' + id + ' iframe').contents());

            $(this).off('shown.bs.modal');
            
        });

        $('#' + id).on('hidden.bs.modal', function () {
            
            $(idCloseButton).trigger("click");
        });

        $(idCloseButton).click(function () {

            if (closeAction != null && typeof (closeAction) == "function") {
                closeAction.call();
            }

            $('#' + id).off('hidden.bs.modal');
            $(this).unbind("click");
        });
    }

    return {

        show: function (options, openAction, closeAction) {

            if (options == null) {
                console.log('Nenhuma propriedade foi informada para o modal.');
                return;
            }

            var id = getModalId(options);
            var currentModal = document.getElementById(id);

            //Se encontrar a modal na página exlui e cria novamente, evitar o cache pois dá problema nos eventos do html como esc para fechar
            if (currentModal) {
                $("#"+id).parent().remove();
            }

            var modalHtml = '';

            modalHtml += '<div class="modal fade ' + getModalSize(options) + '" id="' + id + '" role="basic" aria-hidden="true" tabindex="-1">';
            modalHtml += '<div class="modal-dialog ' + getModalDialogSize(options) + '">';
            modalHtml += '<div class="modal-content">';

            if (generateDefaultContent(options) === false) {
                modalHtml += '<iframe src="' + options.url + '" width="100%" height="' + getModalHeight(options) + 'px" style="border: 0px;" onload="Benner.Page.validSessionExpired(this)"></iframe>';
            } else {

                    modalHtml += '<div class="modal-header"><button type="button" id="' + id + 'CloseButton" class="close" data-dismiss="modal" aria-hidden="true"></button>';
                    if (displayTitle(options) === true) {
                        modalHtml += '<h4 class="modal-title">' + getModalTitle(options) + '</h4>';
                    }
                    modalHtml += '</div>';

                if (options.customBody) {
                    modalHtml += '<div class="modal-body">' + options.customBody + '</div>';
                } else {
                    modalHtml += '<div class="modal-body">' + '<iframe src="' + options.url + '" onload="Benner.Page.validSessionExpired(this)" width="100%" height="' + getModalHeight(options) + 'px" scrolling="yes" style="border: 0px;"></iframe>' + '</div>';
                }

                if (displayFooter(options)) {
                    modalHtml += '<div class="modal-footer">';
                    modalHtml += '<button type="button" class="btn blue" data-dismiss="modal">' + getButtonLabel(options) + '</button>';
                    modalHtml += '</div>';
                }
            }

            modalHtml += '</div>';
            modalHtml += '</div>';
            modalHtml += '</div>';

            var modal = document.createElement('div');
            modal.innerHTML = modalHtml;

            $('body').append(modal);

            initializeEvent(id, openAction, closeAction);

            $('#' + id).modal('show');

            //Ao abrir uma modal que faz parte do processo dos tres pontinhos o ModalMessage é disparado
            //Assim garantimos que o mesmo seja fechado
            Benner.ModalMessage.hide();
        },

        hide: function () {
            $('.modal').modal('hide');
        },
        
        init: function () {
            var modal = this;
            $("iframe").contents().keyup(function (e) {
                if (e.keyCode == 27) // esc
                    modal.hide();
            });
        },

        isOpen: function () {
            var openModal = $('.modal.in');
            if (openModal.size() > 0)
                return true;

            var modalBack = $('.modal-backdrop');
            if (modalBack.size() > 0)
                return true;

            return false;
        },

        insideModal: function () {
            var imp = Benner.Page.getQueryParameter('imp');
            if (imp == null || parseInt(imp) == 0)
                return false;

            return true;
        }
    }
}();

module.exports = Benner.ModalPage;