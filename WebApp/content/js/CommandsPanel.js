Benner.CommandsPanel = function () {

}

Benner.CommandsPanel.displayChild = function (element) {
    // SMS 732512 - Uma das soluções dos problemas de zIndex com os calendários é ao mostrar os subites dos painéis de comandos.
    BennerCalendar.hideCalendarPopup();

    Benner.CommandsPanel.internalToggleCommandsVisibility(element, true);
}

Benner.CommandsPanel.hideChild = function (element) {
    Benner.CommandsPanel.internalToggleCommandsVisibility(element, false);
}

Benner.CommandsPanel.internalToggleCommandsVisibility = function (element, visible) {
    var display = visible ? 'block' : 'none';

    //Este offset é necessário pois o div .menuItemContentContainer possui 12px de padding em cada lado
    var paddingOffset = 24;

    var child = element.children[1];
    if (child.nodeName.toLowerCase() == "ul") {
        var $child = $(child);
        //if ($child.width() < $(element).width()) {
        //    $child.css("width", "100%");
        //}

        //$(".menuItemContentContainer").each(function () {
        //    menuItem = $(this);
        //    if (menuItem.parent().width() != 0)
        //        menuItem.css("width", menuItem.parent().width() - paddingOffset);
        //});


        $child.css("display", display);
    }
}

module.exports = Benner.CommandsPanel;