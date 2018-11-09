Benner.Services = function() {
    
}

Benner.Services.getPathFieldResultValues = function (entityViewName, associationFieldName, associationFieldValue, pathFields, onSucess) {
    var applicationPath = Benner.Page.getApplicationPath();
    servicePath = "PathField.asmx";
    if (applicationPath != null) {
        servicePath = applicationPath + servicePath;
    }

    Sys.Net.WebServiceProxy.invoke(servicePath,
        "GetResultValues",
        false,
        {
            entityViewName: entityViewName,
            associationFieldName: associationFieldName,
            associationFieldValue: associationFieldValue,
            pathFields: pathFields
        },
        onSucess,
        Benner.Services.onFail,
        null);
}

Benner.Services.onFail = function (err, response, context) {
    alert(err._message);
}

module.exports = Benner.Services;