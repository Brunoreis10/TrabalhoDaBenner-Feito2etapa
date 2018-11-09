Benner.CollapsiblePanel = function () {

}

Benner.CollapsiblePanel.changeServerChromeState = function (widgetId) {
    if (!Benner.CollapsiblePanel.isOpeningTheWebpart(widgetId)) {
        $('#' + widgetId + " .widget").addClass("minimized");
    } else {
        $('#' + widgetId + " .widget").removeClass("minimized");
    }

    var chromeStateButton = document.getElementById(widgetId + '_ChromeStateChangeButton');
    if (chromeStateButton)
        chromeStateButton.click();
}

Benner.CollapsiblePanel.isOpeningTheWebpart = function (widgetId) {
    return $('#' + widgetId + " .widget").hasClass("minimized");
}

module.exports = Benner.CollapsiblePanel;