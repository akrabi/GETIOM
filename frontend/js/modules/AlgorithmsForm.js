var AlgorithmsForm = function(algorithmDefentions, algorithmSelectorId, parametersPanelId, runAlgorithmById) {

    var algorithms = algorithmDefentions;
    var algorithmSelector = $('#' + algorithmSelectorId);
    var parameterPanel = $('#' + parametersPanelId);
    var parameterPanels = null;

    function showParamPanel(algorithmId) {
        for (var algoId in parameterPanels) {
            $(parameterPanels[algoId]).hide();
        }
        $(parameterPanels[algorithmId]).show();
    }
    return {
        init: function() {
            if (!parameterPanels) {
                parameterPanels = {};
                var first = true;
                for (var algoId in algorithms) {
                    var algorithm = algorithms[algoId];
                    algorithmSelector.append('<option value="'+algoId+'" ' + (first ? 'selected' : '') + '>'+algorithm.name+'<\/option>'); //TODO bootstrap style!

                    var paramInputGroupsHTML = '';

                    for (var paramId in algorithm.params) {
                        var param = algorithm.params[paramId];
                        paramInputGroupsHTML +=                     //TODO handle missing param values & STYLE!!!
                            '<div class="form-group">' +
                                '<label class="col-md-1 col-md-offset-5 control-label" for="' + algoId+'_'+ paramId + '">'+param.name+'</label>' +
                                '<div class="col-md-1">' +
                                    '<input id="' + algoId+'_'+paramId + '" name="' + algoId+'_'+paramId + '" type="text" value="'+param.defaultValue+'" class="form-control input-md">' +
                                    '<span class="help-block">'+param.info+'</span>' +
                                '</div>' +
                            '</div>';

                        parameterPanel.append('' +
                            '<div id="'+algoId+'_panel">' +
                                '<fieldset id="'+algoId+'_params">' +
                                    '<legend>' +
                                        algorithm.name +
                                        '<h4><small>' + algorithm.description + '</small></h4>' +
                                    '</legend>' +
                                    paramInputGroupsHTML +
                                '</fieldset>' +
                            '</div>');
                        parameterPanels[algoId] = $('#' + algoId + '_panel');
                        first = false;
                    }
                }
            }
            this.updatePanels();
            algorithmSelector.change(this.updatePanels);
        },
        updatePanels: function() {
            var val = algorithmSelector.val();
            showParamPanel(val);
        },
        submit: function () {
            var algoId = algorithmSelector.val();
            runAlgorithmById(algoId);
        }
    };
}