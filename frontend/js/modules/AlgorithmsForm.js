var AlgorithmsForm = function(algorithmDefentions, algorithmSelectDivId, parametersPanelId, runAlgorithmById, multipleSelection) {

    var algorithmSelectorId = algorithmSelectDivId + '_selector';
    var multipleSelection = multipleSelection;
    var algorithms = algorithmDefentions;
    var algorithmSelectDiv = $('#' + algorithmSelectDivId);
    var parameterPanel = $('#' + parametersPanelId);
    var parameterPanels = null;
    var algorithmSelector = null;

    return {
        init: function() {
            if (!parameterPanels) {
                parameterPanels = {};
                var first = true;

                var algorithmSelectionHTML = '';

                if (!multipleSelection) {
                    algorithmSelectionHTML +=
                        '<select id="'+algorithmSelectorId+'" name="'+algorithmSelectorId+'" class="form-control">';
                }

                for (var algoId in algorithms) {
                    var algorithm = algorithms[algoId];
                    if (multipleSelection) {
                        algorithmSelectionHTML +=
                            '<div class="checkbox">' +
                                '<label for="'+algorithmSelectorId+'_'+algoId+'">' +
                                    '<input type="checkbox" name="'+algoId+'" id="'+algorithmSelectorId+'_'+algoId+'" value="'+algoId+'">' +
                                    algorithm.name +
                                '</label>' +
                            '</div>'
                    }
                    else {
                        algorithmSelectionHTML += '<option value="' + algoId + '" ' + (first ? 'selected' : '') + '>' + algorithm.name + '<\/option>';
                    }

                    var paramInputGroupsHTML = '';

                    for (var paramId in algorithm.params) {
                        var param = algorithm.params[paramId];
                        paramInputGroupsHTML +=
                            '<div class="form-group">' +
                                '<label class="col-md-1 col-md-offset-5 control-label" for="' + algoId+'_'+ paramId + '">'+(param.name || '')+'</label>' +
                                '<div class="col-md-1">' +
                                    '<input id="' + algoId+'_'+paramId + '" name="' + algoId+'_'+paramId + '" type="text" value="'+(param.defaultValue || '')+'" class="form-control input-md">' +
                                    '<span class="help-block">'+(param.info || '')+'</span>' +
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
                if (!multipleSelection) {
                    algorithmSelectionHTML += '</select>';
                }
                algorithmSelectDiv.append(algorithmSelectionHTML);

                var self = this;
                algorithmSelectDiv.find(':checkbox').map(function() {
                        $(this).change(self.updatePanels);
                    }
                );

                if (!multipleSelection) {
                    algorithmSelector = $('#'+algorithmSelectorId);
                    algorithmSelector && algorithmSelector.change(this.updatePanels);
                }
            }
            this.updatePanels();

        },
        updatePanels: function() {
            for (var algoId in parameterPanels) {
                $(parameterPanels[algoId]).hide();
            }
            if (multipleSelection) {
                algorithmSelectDiv.find(':checkbox:checked').map(function() {
                    var algoId = this.value;
                    $(parameterPanels[algoId]).show();
                });
            }
            else {
                var algoId = algorithmSelector.val()
                $(parameterPanels[algoId]).show();
            }
        },
        submit: function () {
            if (multipleSelection) {
                var algoIds = algorithmSelectDiv.find(':checkbox:checked').map(function(checkbox) {
                    return this.value;
                });
                runAlgorithmById(algoIds);
                
            }
            else {
                var algoId = algorithmSelector.val();
                runAlgorithmById(algoId);
            }
        }
    };
}