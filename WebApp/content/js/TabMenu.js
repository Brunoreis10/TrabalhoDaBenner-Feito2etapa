Benner.TabMenu = function () {

}

Benner.TabMenu.scrollResolved = false;

Benner.TabMenu.togglePopupItemsVisibility = function (obj, visible, evt) {
    if (obj == null || obj.style == null)
        return;

    if (visible && obj.style.display == 'block')
        return;

    if (evt != null) {
        // pop event bubble
        if (!evt) var evt = window.event;
        if (evt) evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
    }

    if (evt != null || evt == null && !visible)
        obj.style.display = (visible) ? 'block' : 'none';

    if (Sys.Browser.agent == Sys.Browser.InternetExplorer && visible && !Benner.TabMenu.scrollResolved) {//só resolve scroll se o div foi alterado para visível
        if (obj.offsetHeight < 452)
            obj.style.overflowY = 'hidden';
        else
            obj.style.overflowY = 'scroll';

        Benner.TabMenu.scrollResolved = true;
    }
}

module.exports = Benner.TabMenu;