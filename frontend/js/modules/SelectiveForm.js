var SelectiveForm = function(typeNames, parameterPanelIds, selectionId, submitFunctions) {

    var selection = $('#' + selectionId);
    var parameterPanels = {};
    var functions = {};

    for (var i = 0; i < parameterPanelIds.length; ++i) {
        parameterPanels[typeNames[i]] = $('#' + parameterPanelIds[i]);
        functions[typeNames[i]] = submitFunctions[i];
    }
    function showParamPanel(typeName) {
        for (var panel in parameterPanels) {
            $(parameterPanels[panel]).hide();
        }
        $(parameterPanels[typeName]).show();
    }
    return {
        init: function() {
            this.updatePanels();
            selection.change(this.updatePanels);
        },
        updatePanels: function() {
            var val = selection.val();
            showParamPanel(val);
        },
        submit: function () {
            var val = selection.val();
            functions[val]();
        }
    };
}