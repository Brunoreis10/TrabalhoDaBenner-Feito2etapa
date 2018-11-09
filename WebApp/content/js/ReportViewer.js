Benner.ReportViewer = function () {
};

Benner.ReportViewer.resizeWidget = function (frameId) {
    var frame = $('#' + frameId);

    if (!frame)
        return;

    if ($(frame).hasClass("widget-block")) {
        $(frame).toggleClass('widget-block widget-unblock');
        App.unblockUI('#' + $(frame).attr('data-block-id'));
    }

    var realHeight = $(frame).contents().height();
    $(frame).height(realHeight + 20);
};

module.exports = Benner.ReportViewer;