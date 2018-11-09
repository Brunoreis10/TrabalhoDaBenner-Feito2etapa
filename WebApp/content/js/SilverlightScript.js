Benner.Silverlight = function(){ };

Benner.Silverlight.OnPluginErrorHandler = function(sender, errorArgs) {
    var errorMsg = "Silverlight Plugin Error: \n\n";
    Benner.Silverlight.GeneralErrorHandler(sender, errorArgs, errorMsg);
}

Benner.Silverlight.GeneralErrorHandler = function(sender, errorArgs, errorMsg) {
    errorMsg += "Error Type:    " + errorArgs.get_error().errorType + "\n";
    errorMsg += "Error Message: " + errorArgs.get_error().errorMessage + "\n";
    errorMsg += "Error Code:    " + errorArgs.get_error().errorCode + "\n";
    alert(errorMsg);
}

Benner.Silverlight.OnPluginSourceDownloadProgressChangedHandler = function(sender, args) {
    var root = sender.get_element().content;
    var progress = Math.round((args.get_progress() * 100))
    root.findName("ProgressText").Text = progress + "%";
}

Benner.Silverlight.ForceSubmit = function(controlId, args) {
    __doPostBack(controlId, args);
}

export default Benner.Silverlight