Benner.ArtifactsDiff = function () {
    return {
        init: function () {
            var aceDiffer;
            var sessionLeft;
            var sessionRight;

            var sincronizarRolagem = true;
            var sincronizarRolagemIcone;

            sincronizarRolagemIcone = $('#sincronizarRolagemIcone');

            $('#sincronizarRolagem').on('click', function () {
                if (sincronizarRolagem) {
                    $(sincronizarRolagemIcone).removeClass('fa fa-lock').addClass('fa fa-unlock');
                    sincronizarRolagem = false;
                }
                else {
                    $(sincronizarRolagemIcone).removeClass('fa fa-unlock').addClass('fa fa-lock');
                    sincronizarRolagem = true;
                }
            });

            setTimeout(function () {

                aceDiffer = new AceDiff({
                    mode: "ace/mode/xml",
                    left: {
                        editable: false,
                        copyLinkEnabled: false,
                    },
                    right: {
                        editable: false,
                        copyLinkEnabled: false,
                    },
                });

                var sessionLeft = aceDiffer.editors.left.ace.getSession();
                var sessionRight = aceDiffer.editors.right.ace.getSession();

                sessionLeft.on('changeScrollTop',
                    function (scroll) {
                        if (sincronizarRolagem) {
                            if (scroll >= 0 && scroll < (aceDiffer.editors.right.ace.renderer.layerConfig.maxHeight - aceDiffer.editors.right.ace.renderer.layerConfig.height) + 20)
                                sessionRight.setScrollTop(parseInt(scroll))
                        }
                    });

                sessionRight.on('changeScrollTop',
                    function (scroll) {
                        if (sincronizarRolagem)
                            if (scroll >= 0 && scroll < (aceDiffer.editors.left.ace.renderer.layerConfig.maxHeight - aceDiffer.editors.left.ace.renderer.layerConfig.height) + 20)
                                sessionLeft.setScrollTop(parseInt(scroll))
                    });
            }, 1);
        }
    }
}();

export default Benner.ArtifactsDiff