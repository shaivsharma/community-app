(function (module) {
    mifosX.directives = _.extend(module, {
        ActivitiesDisplayPanelDirective: function () {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template: "<div class='display-panel' style='margin-top:15px;'>" +
                    "<div class='summary-header'>" +
                    "<div class='display-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngDisplaypanel", [mifosX.directives.ActivitiesDisplayPanelDirective]).run(function ($log) {
    $log.info("ActivitiesDisplayPanelDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        ApiValidationDirective: function ($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {
                    var template = '<div class="error" ng-repeat="errorArray in errorDetails" ng-show="errorStatus || errorDetails">' +
                        '<label>' +
                        '{{' + "'label.error'" + ' | translate}}' +
                        '</label>' +
                        '<label ng-show="errorStatus">{{errorStatus}}</label>' +
                        '<label ng-hide="errorStatus" ng-repeat="error in errorArray">' +
                        '{{error.code | translate:error.args}}' +
                        '</label></div>';

                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("apiValidate", ['$compile', mifosX.directives.ApiValidationDirective]).run(function ($log) {
    $log.info("ApiValidationDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        AutofocusDirective: function ($timeout, $parse) {
            return {
                link: function (scope, element, attrs) {
                    var focus = $parse(attrs.ngAutofocus);
                    scope.$watch(focus, function (value) {
                        if (value === true) {
                            $timeout(function () {
                                element[0].focus();
                            });
                        }
                    });
                }
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngAutofocus", ['$timeout', '$parse', mifosX.directives.AutofocusDirective]).run(function ($log) {
    $log.info("AutofocusDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        BigPanelDirective: function () {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template: "<div class='panelbig'>" +
                    "<div class='panel-header'>" +
                    "<div class='alert-box panel-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("panelbig", [mifosX.directives.BigPanelDirective]).run(function ($log) {
    $log.info("BigPanelDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        ChosenComboboxDirective: function ($compile) {
            var linker = function (scope, element, attrs) {
                var list = attrs['chosen'];
                scope.$watch(list, function () {
                    element.trigger('liszt:updated');
                    element.trigger("chosen:updated");
                });

                element.chosen({search_contains:true});
            };

            return {
                restrict: 'A',
                link: linker
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("chosen", ['$compile', mifosX.directives.ChosenComboboxDirective]).run(function ($log) {
    $log.info("ChosenComboboxDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        CkEditorDirective: function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elm, attr, ngModel) {

                    var ck = CKEDITOR.replace(elm[0]);

                    ck.on('insertElement', function () {
                        //$scope.$apply(function () {
                        //    ngModel.$setViewValue(ck.getData());
                        //});
                        setTimeout(function () {
                            $scope.$apply(function () {
                                ngModel.$setViewValue(ck.getData());
                            });
                        }, 2000);
                    });

                    ngModel.$render = function (value) {
                        ck.setData(ngModel.$modelValue);
                    };
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ckEditor", [mifosX.directives.CkEditorDirective]).run(function ($log) {
    $log.info("CkEditorDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        dialogDirective: function () {
            return function (scope, element, attrs) {
                var options = scope.$eval(attrs.mfDialogOptions) || {};
                var eventsMap = scope.$eval(attrs.mfDialog);

                $(element).dialog(_.defaults(options, {
                    autoOpen: false,
                    draggable: false,
                    resizable: false
                }));

                var actionsMap = {
                    show: function (event, data) {
                        $(element).dialog("option", "title", data.title);
                        $(element).dialog('open');
                    },
                    hide: function (event, data) {
                        $(element).dialog('close');
                    }
                };

                _.each(_.keys(actionsMap), function (actionName) {
                    var events = eventsMap[actionName].split(',');
                    _.each(events, function (eventName) {
                        scope.$on(eventName, actionsMap[actionName]);
                    });
                });
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfDialog", [mifosX.directives.dialogDirective]).run(function ($log) {
    $log.info("dialogDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        FormSubmitValidateDirective: function ($parse, $event) {
            return {
                restrict: 'A',
                require: ['rcSubmit', '?form'],
                controller: ['$scope', function ($scope) {
                    this.attempted = false;

                    var formController = null;

                    this.setAttempted = function () {
                        this.attempted = true;
                    };

                    this.setFormController = function (controller) {
                        formController = controller;
                    };
                }],
                compile: function (cElement, cAttributes, transclude) {
                    return {
                        pre: function (scope, formElement, attributes, controllers) {

                            var submitController = controllers[0];
                            var formController = (controllers.length > 1) ? controllers[1] : null;

                            submitController.setFormController(formController);

                            scope.rc = scope.rc || {};
                            scope.rc[attributes.name] = submitController;
                        },
                        post: function (scope, formElement, attributes, controllers, event) {

                            var submitController = controllers[0];
                            var formController = (controllers.length > 1) ? controllers[1] : null;
                            var fn = $parse(attributes.rcSubmit);

                            formElement.bind('submit', function () {
                                submitController.setAttempted();
                                if (!scope.$$phase) scope.$apply();
                                if (!formController.$valid) {
                                    return false;
                                }
                                scope.$apply(function () {
                                    fn(scope, {$event: event});
                                });
                            });
                        }
                    };
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("rcSubmit", ['$parse', mifosX.directives.FormSubmitValidateDirective]).run(function ($log) {
    $log.info("FormSubmitValidateDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        FormValidateDirective: function ($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {
                    scope.formNameAttribute = attr.valattributeform;
                    scope.inputAttributeName = attr.valattribute;
                    var template = '<span  ng-show="' + scope.formNameAttribute + '.' + scope.inputAttributeName + '.$invalid">' +
                        '<small class="error" ng-show="' + scope.formNameAttribute + '.' + scope.inputAttributeName + '.$error.req || rc.' + scope.formNameAttribute + '.attempted">' +
                        '{{' + "'label.requirefield'" + ' | translate}}' +
                        '</small>' +
                        '</span>';
                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("formValidate", ['$compile', mifosX.directives.FormValidateDirective]).run(function ($log) {
    $log.info("FormValidateDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        HasPermissionDirective: function ($rootScope) {
            return {
                link: function (scope, element, attrs) {
                    if (!_.isString(attrs.hasPermission))
                        throw "hasPermission value must be a string";

                    var value = attrs.hasPermission.trim();
                    var notPermissionFlag = value[0] === '!';
                    if (notPermissionFlag) {
                        value = value.slice(1).trim();
                    }

                    function toggleVisibilityBasedOnPermission() {
                        var hasPermission = $rootScope.hasPermission(value);

                        if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                            $(element).show();
                        else
                            $(element).hide();
                    }

                    toggleVisibilityBasedOnPermission();
                    scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("hasPermission", ['$rootScope', mifosX.directives.HasPermissionDirective]).run(function ($log) {
    $log.info("HasPermissionDirective initialized");
});
;(function (module) {
    mifosX.directives = _.extend(module, {
        LateValidateDirective: function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elm, attr, ctrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox') return;
                    elm.bind('blur', function () {
                        scope.$apply(function () {
                            if (elm.val() == "") {
                                ctrl.$setValidity('req', false);
                            } else {
                                ctrl.$setValidity('req', true);
                            }
                        });
                    });
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("lateValidate", [mifosX.directives.LateValidateDirective]).run(function ($log) {
    $log.info("LateValidateDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        NumberFormatDirective: function ($filter, $locale) {
            return {
                replace: false,
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                	var filter = $filter('number');
                    
                    function number(value, fractionLength) {
                    	return filter(value, fractionLength);
                    }
                    
                    function initialNumber(value) {
                    	var stringValue = modelCtrl.$modelValue + '';
                        var num = stringValue.toString();
                        var fractionLength = (num.split($locale.NUMBER_FORMATS.DECIMAL_SEP)[1] || []).length;
                        var initialnumber = $filter('number')(modelCtrl.$modelValue,fractionLength);
                        return initialnumber;
	                }
                    
                    modelCtrl.$formatters.push(initialNumber);
                    
                    modelCtrl.$parsers.push(function (stringValue) {
	                	if(stringValue){
	                	    var index = stringValue.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP),
	                	        decimal,
	                	        fraction,
	                	        fractionLength;
	                	    if (index >= 0) {
	                	        decimal = stringValue.substring(0, index);
	                	        fraction = stringValue.substring(index + 1);
	                	        if(index!=stringValue.length-1)
	                	            fractionLength = fraction.length;
	                	        else
	                	            fractionLength = 0;
	                	    } else {
	                	        decimal = stringValue;
	                	        fraction = '';
	                	    }
	                	    decimal = decimal.replace(/[^0-9]/g, '');
	                	    fraction = fraction.replace(/[^0-9]/g, '');
	                	    var result = +(decimal + '.' + fraction);
	                	    if (result !== modelCtrl.$modelValue) {
	                	        scope.$evalAsync(function () {
	                	            modelCtrl.$viewValue = number(modelCtrl.$modelValue, fractionLength);
	                	            modelCtrl.$render();
	                	        });
	                	    }
	                	    return result;
	                	}
                    });
                    
                    scope.$on('$localeChangeSuccess', function (event, localeId) {
                      modelCtrl.$viewValue = $filter('number')(modelCtrl.$modelValue);
                      modelCtrl.$render();
                    });
            
                }
            };
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("numberFormat", ['$filter', '$locale', mifosX.directives.NumberFormatDirective]).run(function ($log) {
    $log.info("NumberFormatDirective initialized");
});

;(function (module) {
    mifosX.directives = _.extend(module, {
        OnBlurDirective: function ($parse) {
            return function (scope, elm, attrs) {
                var onBlurFunction = $parse(attrs['ngOnBlur']);
                elm.bind("blur", function (event) {
                    scope.$apply(function () {
                        onBlurFunction(scope, { $event: event });
                    })
                });
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngOnBlur", ['$parse', mifosX.directives.OnBlurDirective]).run(function ($log) {
    $log.info("OnBlurDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        overlayDirective: function () {
            return function (scope, element, attrs) {
                var options = scope.$eval(attrs.mfOverlayOptions) || {};
                var eventsMap = scope.$eval(attrs.mfOverlay);
                var target = attrs.mfOverlayTarget;

                $.blockUI.defaults.css = {};
                var settings = {
                    message: $(element),
                    overlayCSS: { opacity: (options.opacity || '0.5') },
                    fadeIn: options.fadeIn || 100,
                    fadeOut: options.fadeOut || 200
                };

                var actionsMap = (function () {
                    var selector = target ? $(target) : $;
                    var showFn = target ? 'block' : 'blockUI';
                    var hideFn = target ? 'unblock' : 'unblockUI';
                    return {
                        show: function () {
                            selector[showFn](settings);
                        },
                        hide: function () {
                            selector[hideFn]();
                        }
                    };
                }());

                _.each(_.keys(eventsMap), function (actionName) {
                    var events = eventsMap[actionName].split(',');
                    _.each(events, function (eventName) {
                        scope.$on(eventName, actionsMap[actionName]);
                    });
                });
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfOverlay", [mifosX.directives.overlayDirective]).run(function ($log) {
    $log.info("overlayDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        PanelDirective: function () {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template: "<div class='panel'>" +
                    "<div class='panel-header'>" +
                    "<div class='alert-box panel-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("panel", [mifosX.directives.PanelDirective]).run(function ($log) {
    $log.info("PanelDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        ScrollbarTopDirective: function () {
            return {
                link: function (scope, element, attrs) {
                    // ng-repeat delays the actual width of the element.
                    // this listens for the change and updates the scroll bar
                    function widthListener() {
                        if (anchor.width() != lastWidth)
                            updateScroll();
                    }

                    function updateScroll() {
                        // for whatever reason this gradually takes away 1 pixel when it sets the width.
                        $div2.width(anchor.width() + 1);

                        // make the scroll bars the same width
                        $div1.width($div2.width());

                        // sync the real scrollbar with the virtual one.
                        $wrapper1.scroll(function () {
                            $wrapper2.scrollLeft($wrapper1.scrollLeft());
                        });

                        // sync the virtual scrollbar with the real one.
                        $wrapper2.scroll(function () {
                            $wrapper1.scrollLeft($wrapper2.scrollLeft());
                        });
                    }

                    var anchor = element.find('[data-anchor]'),
                        lastWidth = anchor.width(),
                        listener;

                    // so that when you go to a new link it stops listening
                    element.on('remove', function () {
                        clearInterval(listener);
                    });

                    // creates the top virtual scrollbar
                    element.wrapInner("<div class='div2' />");
                    element.wrapInner("<div class='wrapper2' />");

                    // contains the element with a real scrollbar
                    element.prepend("<br/><div class='wrapper1'><div class='div1'></div></div>");

                    var $wrapper1 = element.find('.wrapper1'),
                        $div1 = element.find('.div1'),
                        $wrapper2 = element.find('.wrapper2'),
                        $div2 = element.find('.div2')

                    // force our virtual scrollbar to work the way we want.
                    $wrapper1.css({
                        float: "left",
                        width: "100%",
                        border: "none 0px rgba(0, 0, 0, 0)",
                        overflowX: "scroll",
                        overflowY: "hidden",
                        height: "20px"
                    });

                    $div1.css({
                        height: "20px"
                    });

                    $wrapper2.css({
                        width: "100%",
                        overflowX: "scroll"
                    });

                    listener = setInterval(function () {
                        widthListener();
                    }, 650);

                    updateScroll();
                }
            }

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("scroll", [mifosX.directives.ScrollbarTopDirective]).run(function ($log) {
    $log.info("ScrollbarTopDirective initialized");
});;/**
 This directive is highly coupled with the controller it is used in.
 So THERE MUST BE a "scope.batchRequests" and "scope.requestIdentifier"
 within the wrapper controller of this directive.
*/
(function (module) {
    mifosX.directives = _.extend(module, {
        SuccessfulResponsesDirective: function ($compile, $rootScope) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {

                    scope.responses = [];

                    // watch the rootScope variable "successfulResponses"
                    scope.$watch(function() {
                        return $rootScope.successfulResponses;
                    }, function(successfulResponses) {
                        scope.responses = successfulResponses;

                        if(scope.responses.length > 0) {

                            scope.uniqueId = [];
                                              
                            //fills up the uniqueId array with unique identifiers      
                            for (var i = 0; i < scope.responses.length; i++) {
                                for(var j = 0; j < scope.br.length; j++) {
                                    if(scope.responses[i].requestId == scope.br[j].requestId) {
                                        scope.uniqueId.push(JSON.parse(scope.br[j].body)[scope.identifier]);
                                    }
                                }
                            }

                            var template = '<div class="success" ng-show="successfulResponses.length < batchRequests.length">' +
                                '<h4>Responses with listed <strong>'+scope.identifier+'s</strong> were successful</h4>' +
                                '<span ng-repeat="id in uniqueId">{{id+" "}}</span>' +
                                '</div>';

                            elm.html('').append($compile(template)(scope));   
                        }                 
                    });

                    /* watch the batchRequests array for changes within the scope
                    of the controller this directive is inserted in.
                    Most importantly there must always be a "scope.batchRequests" 
                    variable within the controller this directive is inserted in.*/                    
                    scope.$watch(function() {
                        return scope.batchRequests;
                    }, function(batchRequests){
                        scope.br = batchRequests;
                    });

                    /* watch the requestIdentifier for changes within the scope
                    of the controller this directive is inserted in.
                    Most importantly there must always be a "scope.requestIdentifier" 
                    variable within the controller this directive is inserted in.*/                    
                    scope.$watch(function() {
                        return scope.requestIdentifier;
                    }, function(identifier){
                        scope.identifier = identifier;
                    });

                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("successfulResponses", ['$compile', '$rootScope', mifosX.directives.SuccessfulResponsesDirective]).run(function ($log) {
    $log.info("SuccessfulResponsesDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        SummaryDirective: function () {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template: "<div class='summary'>" +
                    "<div class='summary-header'>" +
                    "<div class='summary-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngSummary", [mifosX.directives.SummaryDirective]).run(function ($log) {
    $log.info("SummaryDirective initialized");
});;(function (module) {
    mifosX.directives = _.extend(module, {
        TreeviewDirective: function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var treeId = attrs.treeId;
                    var treeModel = attrs.treeModel;
                    var nodeId = attrs.nodeId || 'id';
                    var nodeLabel = attrs.nodeLabel || 'label';
                    var nodeChildren = attrs.nodeChildren || 'children';
                    var parentId = attrs.parentId || 'parentId';
                    var template = "";
                    if (treeId === "holidaytreeview") {
                        template =
                            '<ul>' +
                                '<div data-ng-show="' + treeId + '.showChangeStateAll(' + treeModel + ')">' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', false)">{{\'label.button.expand.all\' | translate}}</a>' +
                                ' / ' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', true)">{{\'label.button.collapse.all\' | translate}}</a>' +
                                '</div>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<input ng-model="node.selectedCheckBox" ng-true-value="true" ng-false-value="false" type="checkbox" data-ng-change="holidayApplyToOffice(node)"></input>' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                                '<div data-ng-hide="node.collapsed"  data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id="' + nodeId + '" data-node-label="' + nodeLabel + '" data-node-children="' + nodeChildren + '"></div>' +
                                '</li>' +
                                '</ul>';
                    } else {
                        template =
                            '<ul>' +
                                '<div data-ng-show="' + treeId + '.showChangeStateAll(' + treeModel + ')">' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', false)">{{\'label.button.expand.all\' | translate}}</a>' +
                                ' / ' +
                                '<a data-ng-click="' + treeId + '.setCollapsedRoot(' + treeModel + ', true)">{{\'label.button.collapse.all\' | translate}}</a>' +
                                '</div>' +
                                '<li data-ng-repeat="node in ' + treeModel + '">' +
                                '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                                '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                                '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                                '<div data-ng-hide="node.collapsed"  data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id="' + nodeId + '" data-node-label="' + nodeLabel + '" data-node-children="' + nodeChildren + '"></div>' +
                                '</li>' +
                                '</ul>';
                    }

                    if (treeId && treeModel) {

                        if (attrs.angularTreeview) {

                            scope[treeId] = scope[treeId] || {};

                            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

                                selectedNode.collapsed = !selectedNode.collapsed;
                            };
                            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
                                selectedNode.collapsed = !selectedNode.collapsed;
                                if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                                    scope[treeId].currentNode.selected = undefined;
                                }
                                selectedNode.selected = 'selected';
                                scope[treeId].currentNode = selectedNode;
                            };
                            scope[treeId].setCollapsedAll = scope[treeId].setCollapsedAll || function (selectedNode, state) {
                                selectedNode.collapsed = state;
                                for(var i = 0; i < selectedNode[nodeChildren].length; i++) {
                                    if(selectedNode[nodeChildren][i][nodeChildren].length > 0) {
                                        scope[treeId].setCollapsedAll(selectedNode[nodeChildren][i], state);
                                    }
                                }
                            };
                            scope[treeId].setCollapsedRoot = scope[treeId].setCollapsedRoot || function (treeModel, state) {
                                for(var i = 0; i < treeModel.length; i++) {
                                    if(treeModel[i][nodeChildren].length > 0) {
                                        scope[treeId].setCollapsedAll(treeModel[i], state);
                                    }
                                }
                            };
                            scope[treeId].showChangeStateAll = scope[treeId].showChangeStateAll || function (treeModel) {
                                if(!treeModel) {
                                    return false;
                                }
                                for(var i = 0; i < treeModel.length; i++) {
                                    if(treeModel[i][nodeChildren].length > 0 &&
                                        typeof treeModel[i][parentId] === "undefined") {
                                        return true;
                                    }
                                }
                                return false;
                            };
                        }
                        element.html('').append($compile(template)(scope));
                    }
                }
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("treeModel", ['$compile', mifosX.directives.TreeviewDirective]).run(function ($log) {
    $log.info("TreeviewDirective initialized");
});