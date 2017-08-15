(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Debug = function () {
    function Debug() {
        classCallCheck(this, Debug);
    }

    createClass(Debug, null, [{
        key: "isEnabled",
        value: function isEnabled() {
            return this._enabled = this._enabled || decomGiftable.debug || false;
        }
    }, {
        key: "info",
        value: function info(debugObject) {
            if (this.isEnabled()) {
                console.info(debugObject);
            }
        }
    }, {
        key: "log",
        value: function log(debugObject) {
            if (this.isEnabled()) {
                console.log(debugObject);
            }
        }
    }, {
        key: "error",
        value: function error(debugObject) {
            if (this.isEnabled()) {
                console.error(debugObject);
            }
        }
    }]);
    return Debug;
}();

var BoundElement = function () {
    function BoundElement() {
        var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var selector = arguments[1];
        var event = arguments[2];
        var object = arguments[3];
        var method = arguments[4];
        var preventDefault = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
        classCallCheck(this, BoundElement);

        this._parent = parent;
        this._selector = selector;
        this._event = event;
        this._object = object;
        this._method = method;
        this._callback = function (e) {
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            object[method].apply(object, arguments);
        };

        jQuery(this._parent).on(this._event, this._selector, this._callback);

        Debug.info('Bound - parent: ' + this._parent + ', event: ' + this._event + ', selector: ' + this._selector + ', object: ' + object + ', method: ' + method);
        Debug.log('Parent:');
        Debug.log(this._parent);
        Debug.log('Object:');
        Debug.log(object);
    }

    createClass(BoundElement, [{
        key: 'unbind',
        value: function unbind() {
            jQuery(this._parent).off(this._event, this._selector, this._callback);

            Debug.info('Unbound - parent: ' + this._parent + ', event: ' + this._event + ', selector: ' + this._selector);
            Debug.log('Parent:');
            Debug.log(this._parent);
        }
    }, {
        key: 'selector',
        value: function selector() {
            return this._selector;
        }
    }]);
    return BoundElement;
}();

var Screen = function () {
    function Screen(screenData) {
        classCallCheck(this, Screen);

        this._data = screenData;
        this._bound = new Array();
        this._bindings = new Array();
        this.init();
    }

    createClass(Screen, [{
        key: 'init',
        value: function init() {
            this.bind();
        }
    }, {
        key: 'bind',
        value: function bind() {
            var _this = this;

            this._bindings.forEach(function (element, index, collection) {
                _this._bound.push(new BoundElement(_this._element, element.selector, element.event, element.object, element.method, element.preventDefault || true));
            });
        }
    }]);
    return Screen;
}();

var Translate = function () {
    function Translate() {
        classCallCheck(this, Translate);
    }

    createClass(Translate, null, [{
        key: "loadTranslations",
        value: function loadTranslations() {
            this._translations = this._translations || decomGiftable.screen.translations || new Object();
        }
    }, {
        key: "text",
        value: function text(original) {
            this.loadTranslations();
            return this._translations[original] || original;
        }
    }]);
    return Translate;
}();

var Criteria = function () {
    function Criteria(id) {
        var _this = this;

        var conditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var sourceCriteria = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        classCallCheck(this, Criteria);

        this._id = id;
        this._conditions = conditions;
        this._type = conditions.type || null;
        this._currentStep = 0;
        this._subcriteria = new Map();
        this._subcriteriaLastIndex = -1;
        if (this._conditions.subcriteria) {
            var lastSubcriteriaId = this._conditions.subcriteria[this._conditions.subcriteria.length - 1].id;
            this._subcriteriaLastIndex = parseInt(lastSubcriteriaId.substring(lastSubcriteriaId.lastIndexOf('-') + 1));
        }
        this._logic = conditions.logic || null;
        this._scrollTo = conditions.scrollTo || false;
        this._checks_out = false;
        this._$element = null;
        this._bound = new Array();
        this._steps = new Array();
        this._sourceCriteria = sourceCriteria;

        this._selectTypeElementId = 'dgfw_criteria_choose_type_' + this._id;
        this._$selectTypeElement = null;

        this._elementData = {
            tag: 'div',
            id: 'dgfw_criteria_' + this._id,
            classes: ['dgfw-criteria']
        };
        this._descriptionData = {
            tag: 'div',
            id: 'dgfw_criteria_description_' + this._id,
            classes: ['dgfw-criteria-description']
        };

        this._types = new Map([['amounts', Translate.text('Amounts')], ['items', Translate.text('Items')], ['products', Translate.text('Products')], ['product_categories', Translate.text('Product Categories')], ['periods', Translate.text('Time Period')], ['users', Translate.text('Users')], ['user_roles', Translate.text('User Roles')]]);

        this._chooseTypeData = {
            tag: 'div',
            id: 'dgfw_choose_type_wrap_' + this._id,
            classes: ['dgfw-choose-type-container'],
            children: [{
                tag: 'select',
                id: this._selectTypeElementId,
                classes: ['dgfw-select-type'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][type]'
                },
                children: []
            }]
        };

        this._types.forEach(function (value, key, collection) {
            var option = {
                tag: 'option',
                attributes: {
                    value: key
                },
                text: value
            };

            if (_this._type === key) {
                option.attributes.selected = 'selected';
            }

            _this._chooseTypeData.children[0].children.push(option);
        });

        this._stepListContainerData = {
            tag: 'div',
            id: 'dgfw_step_list_container_' + this._id,
            classes: ['dgfw-criteria-step-list-container'],
            children: []
        };

        this._stepListData = {
            tag: 'ul',
            id: 'dgfw_step_list_' + this._id,
            classes: ['dgfw-criteria-step-list', 'current-step-0'],
            children: []
        };
        this._navigationData = {
            tag: 'div',
            id: 'dgfw_criteria_nav_' + this._id,
            classes: ['dgfw-criteria-nav'],
            children: [{
                tag: 'button',
                id: 'dgfw_prev_step_' + this._id,
                classes: ['button', 'dgfw-button', 'dgfw-prev-step', 'dashicons-before', 'dashicons-arrow-left-alt'],
                text: Translate.text('Back'),
                attributes: {
                    disabled: 'disabled'
                }
            }, {
                tag: 'button',
                id: 'dgfw_next_step_' + this._id,
                classes: ['button', 'dgfw-button', 'dgfw-next-step', 'dashicons-after', 'dashicons-arrow-right-alt'],
                text: Translate.text('Next')

            }]
        };
        this._removeData = {
            tag: 'button',
            id: 'dgfw_criteria_remove_' + this._id,
            classes: ['dgfw-criteria-remove', 'dgfw-button', 'dashicons-before', 'dashicons-no'],
            text: Translate.text('Remove')
        };
        var andButtonData = {
            tag: 'button',
            id: 'dgfw_add_and_' + this._id,
            classes: ['button', 'dgfw-button', 'dgfw-add-and', 'dashicons-before', 'dashicons-warning'],
            text: Translate.text('AND')
        };
        var orButtonData = {
            tag: 'button',
            id: 'dgfw_add_or_' + this._id,
            classes: ['button', 'dgfw-button', 'dgfw-add-or', 'dashicons-before', 'dashicons-editor-help'],
            text: Translate.text('OR')
        };
        this._andOrData = {
            tag: 'div',
            id: 'dgfw_criteria_add_subcriteria_' + this._id,
            classes: ['dgfw-subcriteria-add'],
            children: []
        };
        if (this._logic) {
            if (this._logic === 'OR') {
                orButtonData.attributes = {
                    style: 'display: none;'
                };
            } else {
                andButtonData.attributes = {
                    style: 'display: none;'
                };
            }
        } else if (this._conditions.subcriteria && this._conditions.subcriteria.length) {
            if (this._conditions.subcriteria[0].logic === 'OR') {
                andButtonData.attributes = {
                    style: 'display: none;'
                };
            } else {
                orButtonData.attributes = {
                    style: 'display: none;'
                };
            }
        }

        this._andOrData.children = [andButtonData, orButtonData];

        this._chooseTypeData.children.push({
            method: 'chooseType',
            description: Translate.text('Choose condition type:'),
            elements: [{
                tag: 'select',
                id: this._selectTypeElementId,
                classes: ['dgfw-select-type'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][type]'
                },
                children: []
            }]
        });

        this._bindings = [{
            selector: '#dgfw_next_step_' + this._id,
            event: 'click',
            object: this,
            method: 'showNextStep'
        }, {
            selector: '#dgfw_prev_step_' + this._id,
            event: 'click',
            object: this,
            method: 'showPrevStep'
        }, {
            selector: '#dgfw_add_and_' + this._id,
            event: 'click',
            object: this,
            method: 'addSubcriteriaAnd'
        }, {
            selector: '#dgfw_add_or_' + this._id,
            event: 'click',
            object: this,
            method: 'addSubcriteriaOr'
        }, {
            selector: '#dgfw_criteria_remove_' + this._id,
            event: 'click',
            object: this,
            method: 'removeCriteria'
        }, {
            selector: '#dgfw_criteria_remove_' + this._id,
            event: 'mouseover',
            object: this,
            method: 'addHighlight'
        }, {
            selector: '#dgfw_criteria_remove_' + this._id,
            event: 'mouseout',
            object: this,
            method: 'removeHighlight'
        }, {
            selector: '.dgfw-step-description.has-help',
            event: 'click',
            object: this,
            method: 'toggleStepHelp'
        }];

        this.init();
    }

    createClass(Criteria, [{
        key: 'init',
        value: function init() {
            this.hideNavigation();
            this._lastStep = this._steps.length - 1;
            this._bindings.push({
                selector: '#' + this._selectTypeElementId,
                event: 'change',
                object: this,
                method: 'changeType'
            });
            this.bind();

            if (this._steps.length > 1) {
                this.showNavigation();
            }

            // this.currentStep();
        }
    }, {
        key: 'takeOverFromSource',
        value: function takeOverFromSource() {
            var _this2 = this;

            this._currentStep = this._sourceCriteria._currentStep;
            this._subcriteria = this._sourceCriteria._subcriteria;
            this._subcriteriaLastIndex = this._sourceCriteria._subcriteriaLastIndex;
            this._logic = this._sourceCriteria._logic;
            this._checksOut = this._sourceCriteria._checksOut;
            this._$element = this._sourceCriteria._$element;
            this._$description = this._sourceCriteria._$description;
            this._$stepListContainer = this._sourceCriteria._$stepListContainer;
            this._sourceCriteria._$stepList.attr('id', this._sourceCriteria._$stepList.attr('id') + '_old');
            this._$stepList = this.createAndAppendChild(this._$stepListContainer, this._stepListData);
            this._$navigation = this._sourceCriteria._$navigation;
            this._$andOr = this._sourceCriteria._$andOr;
            this._steps = this._sourceCriteria._steps;
            this._selectTypeElementId = this._sourceCriteria._selectTypeElementId;
            this._$selectTypeElement = this._sourceCriteria._$selectTypeElement;
            this._$removeButton = this._sourceCriteria._$removeButton;

            this._sourceCriteria._bound.forEach(function (boundElement, index, collection) {
                boundElement.unbind();
            });

            this._subcriteria.forEach(function (subcriteria, subcriteriaId, map) {
                _this2._bound.push(new BoundElement(_this2._$element, subcriteria.elementSelector(), subcriteria.changeTypeEvent(), _this2, 'changeCriteriaType'));
                _this2._bound.push(new BoundElement(_this2._$element, subcriteria.elementSelector(), subcriteria.removeEvent(), _this2, 'removeSubcriteria'));
            });

            this._currentStep = 0;
        }
    }, {
        key: 'createElement',
        value: function createElement() {
            var _this3 = this;

            this._$element = jQuery(document.createElement(this._elementData.tag));
            this._$element.attr('id', this._elementData.id);
            this._$element.addClass(this._elementData.classes.join(' '));
            if (this._scrollTo) {
                this._$element.addClass('invisible');
            }
            if (this._elementData.children) {
                this._elementData.children.forEach(function (elementData, index, collection) {
                    _this3.createAndAppendChild(_this3._$element, elementData);
                });
            }
            this._$description = this.createAndAppendChild(this._$element, this._descriptionData);
            this.createAndAppendChild(this._$element, this._chooseTypeData);
            this._$stepListContainer = this.createAndAppendChild(this._$element, this._stepListContainerData);
            this._$stepList = this.createAndAppendChild(this._$stepListContainer, this._stepListData);
            this._$navigation = this.createAndAppendChild(this._$element, this._navigationData);
            this._$removeButton = this.createAndAppendChild(this._$element, this._removeData);
            this._$andOr = this.createAndAppendChild(this._$element, this._andOrData);
            this.setElementDescription(Translate.text(this._logic || 'First condition'));
            this._$element.addClass(this._logic ? this._logic.toLowerCase() : 'first');

            if (this._logic) {
                this.createAndAppendChild(this._$element, this.logicElement());
            }

            this.createAndAppendChild(this._$element, this.idElement());

            if (this._scrollTo) {
                setTimeout(function () {
                    _this3._$element.removeClass('invisible');
                    var posi = _this3._$element.offset().top;
                    jQuery("html, body").animate({ scrollTop: posi - 100 }, 1000);
                }, 10);
            }
        }
    }, {
        key: 'logicElement',
        value: function logicElement() {
            return {
                tag: 'input',
                id: 'dgfw_criteria_logic_' + this._id,
                attributes: {
                    type: 'hidden',
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][logic]',
                    value: this._logic
                }
            };
        }
    }, {
        key: 'idElement',
        value: function idElement() {
            return {
                tag: 'input',
                id: 'dgfw_criteria_id_' + this._id,
                attributes: {
                    type: 'hidden',
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][id]',
                    value: this._id
                }
            };
        }
    }, {
        key: 'createAndAppendChild',
        value: function createAndAppendChild($parentElement, childData) {
            var _this4 = this;

            var $el = jQuery(document.createElement(childData.tag));
            $el.attr('id', childData.id);
            if (childData.classes) {
                $el.addClass(childData.classes.join(' '));
            }
            if (childData.attributes) {
                for (var attr in childData.attributes) {
                    $el.attr(attr, childData.attributes[attr]);
                }
            }
            if (childData.text) {
                $el.text(childData.text);
            }
            if (childData.html) {
                $el.html(childData.html);
            }
            $parentElement.append($el);
            if (childData.children) {
                childData.children.forEach(function (elementData, index, collection) {
                    _this4.createAndAppendChild($el, elementData);
                });
            }
            return $el;
        }
    }, {
        key: 'bind',
        value: function bind() {
            var _this5 = this;

            this._bindings.forEach(function (element, index, collection) {
                _this5._bound.push(new BoundElement(_this5._$element, element.selector, element.event, element.object, element.method));
            });
        }
    }, {
        key: 'incrementStep',
        value: function incrementStep() {
            var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this._currentStep += steps;
            if (this._currentStep > this._lastStep) {
                this._currentStep = this._lastStep;
            }

            this._$stepList.find('.step-' + (this._currentStep - 1)).removeClass('step-current').addClass('step-prev');
            this._$stepList.find('.step-' + this._currentStep).addClass('step-current');
        }
    }, {
        key: 'decrementStep',
        value: function decrementStep() {
            var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this._currentStep -= steps;
            if (this._currentStep < 0) {
                this._currentStep = 0;
            }

            this._$stepList.find('.step-' + (this._currentStep + 1)).removeClass('step-current');
            this._$stepList.find('.step-' + this._currentStep).removeClass('step-prev').addClass('step-current');
        }
    }, {
        key: 'showNextStep',
        value: function showNextStep() {
            this.incrementStep();
            Debug.info('next, to step:' + this._currentStep);
            this.currentStep();
        }
    }, {
        key: 'showPrevStep',
        value: function showPrevStep() {
            this.decrementStep();
            Debug.info('prev, to step:' + this._currentStep);
            this.currentStep();
        }
    }, {
        key: 'currentStep',
        value: function currentStep() {
            this.readjustSize();

            if (this._steps.length > 1) {
                var prevStepDisabled = this._currentStep === 0;
                this._$navigation.find('button.dgfw-prev-step').text(this.prevStepButtonText()).prop('disabled', prevStepDisabled);

                var nextStepDisabled = this._currentStep === this._lastStep;
                this._$navigation.find('button.dgfw-next-step').text(this.nextStepButtonText()).prop('disabled', nextStepDisabled);
            }

            if (this._steps[this._currentStep].method) {
                this[this._steps[this._currentStep].method]();
            }
        }
    }, {
        key: 'readjustSize',
        value: function readjustSize() {
            this._$stepListContainer.height(this._$stepList.find('li.step-' + this._currentStep + ' > .dgfw-criteria-step-wrapper').height() + 70);
        }
    }, {
        key: 'id',
        value: function id() {
            return this._id;
        }
    }, {
        key: 'element',
        value: function element() {
            return this._$element;
        }
    }, {
        key: 'conditions',
        value: function conditions() {
            return this._conditions;
        }
    }, {
        key: 'elementSelector',
        value: function elementSelector() {
            return '#' + this._elementData.id;
        }
    }, {
        key: 'changeTypeEvent',
        value: function changeTypeEvent() {
            return 'DGFW.CriteriaChangeType_' + this._id;
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            return 'DGFW.CriteriaRemove_' + this._id;
        }
    }, {
        key: 'setElementDescription',
        value: function setElementDescription(content) {
            this._$description.text(content);
        }
    }, {
        key: 'description',
        value: function description() {
            var description = this._logic ? Translate.text(this._logic) : '';
            description += ' ' + this.generateDescription();
            return description;
        }
    }, {
        key: 'generateDescription',
        value: function generateDescription() {
            return this._type;
        }
    }, {
        key: 'addSubcriteriaAnd',
        value: function addSubcriteriaAnd() {
            this.addSubcriteria('AND');
            this._$andOr.find('button.dgfw-add-or').hide();
        }
    }, {
        key: 'addSubcriteriaOr',
        value: function addSubcriteriaOr() {
            this.addSubcriteria('OR');
            this._$andOr.find('button.dgfw-add-and').hide();
        }
    }, {
        key: 'addSubcriteria',
        value: function addSubcriteria(logic) {
            var subcriteriaId = this._id + '-subcriteria-' + this.newSubcriteriaIndex();
            var criteria = CriteriaFactory.createAndScrollTo(subcriteriaId, 'amounts', { logic: logic });
            this._subcriteria.set(subcriteriaId, criteria);
            if (this._$element.hasClass('first')) {
                this._$element.addClass(logic.toLowerCase());
            }
            this.appendSubcriteriaElement(criteria.element());
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeSubcriteria'));
        }
    }, {
        key: 'newSubcriteriaIndex',
        value: function newSubcriteriaIndex() {
            return ++this._subcriteriaLastIndex;
        }
    }, {
        key: 'appendSubcriteriaElement',
        value: function appendSubcriteriaElement(element) {
            this._$andOr.before(element);
        }
    }, {
        key: 'chooseType',
        value: function chooseType() {
            Debug.info('choose type');
            Debug.log(this);
            this._$navigation.find('.dgfw-prev-step').attr('disabled', true);
        }
    }, {
        key: 'changeType',
        value: function changeType() {
            this._$selectTypeElement = this._$selectTypeElement || jQuery(document.getElementById(this._selectTypeElementId));
            if (this._type !== this._$selectTypeElement.val()) {
                this._$element.trigger(this.changeTypeEvent(), [this._id.toString(), this._$selectTypeElement.val()]);
                Debug.info('change type to: ' + this._$selectTypeElement.val());
                Debug.log(this);
            }
            // this.showType();
        }
    }, {
        key: 'changeCriteriaType',
        value: function changeCriteriaType(event, criteriaId, newType) {
            this._subcriteria.set(criteriaId, new CriteriaFactory.createFrom(this._subcriteria.get(criteriaId), newType));
        }
    }, {
        key: 'showType',
        value: function showType() {
            Debug.info('show type: ' + this._type);
            Debug.log(this);
        }
    }, {
        key: 'stepElementsExist',
        value: function stepElementsExist(index) {
            return this._sourceCriteria && this._sourceCriteria._steps[index] && this._sourceCriteria._steps[index].elements;
        }
    }, {
        key: 'removeStepElements',
        value: function removeStepElements(stepIndex) {
            var _this6 = this;

            this._sourceCriteria._steps[stepIndex].elements.forEach(function (element, index, collection) {
                Debug.info('Removed: ' + element.id);
                jQuery(document.getElementById('dgfw_criteria_' + _this6._sourceCriteria.id() + '_step_' + stepIndex)).fadeOut().remove();
            });
        }
    }, {
        key: 'showNavigation',
        value: function showNavigation() {
            this._$navigation.removeClass('invisible').find('button').prop('disabled', false);

            var prevStepDisabled = this._currentStep === 0;
            this._$navigation.find('button.dgfw-prev-step').text(this.prevStepButtonText()).prop('disabled', prevStepDisabled);

            var nextStepDisabled = this._currentStep === this._lastStep;
            this._$navigation.find('button.dgfw-next-step').text(this.nextStepButtonText()).prop('disabled', nextStepDisabled);
        }
    }, {
        key: 'hideNavigation',
        value: function hideNavigation() {
            this._$navigation.addClass('invisible').find('button').prop('disabled', true);
        }
    }, {
        key: 'showCriteria',
        value: function showCriteria() {
            var _this7 = this;

            if (!this._sourceCriteria) {
                this.createElement();
            }

            this._steps.forEach(function (step, index, collection) {
                if (index < _this7._currentStep) {
                    return;
                }

                if (step.help) {
                    step.elements.unshift({
                        tag: 'div',
                        id: 'dgfw_criteria_' + _this7._id + '_step' + index + '_help',
                        classes: ['dgfw-step-help'],
                        html: step.help
                    });
                }

                if (step.description) {
                    step.elements.unshift({
                        tag: 'h4',
                        id: 'dgfw_criteria_' + _this7._id + '_step_' + index + '_description',
                        classes: ['dgfw-step-description', step.help ? 'has-help' : ''],
                        text: step.description
                    });
                }

                _this7.createAndAppendChild(_this7._$stepList, {
                    tag: 'li',
                    id: 'dgfw_criteria_' + _this7._id + '_step_' + index,
                    classes: ['dgfw-criteria-step', 'step-' + index, index === 0 ? 'step-current' : ''],
                    children: [{
                        tag: 'div',
                        id: 'dgfw_criteria_' + _this7._id + '_step_wrapper' + index,
                        classes: ['dgfw-criteria-step-wrapper'],
                        children: step.elements
                    }]
                });
            });

            if (this._sourceCriteria) {
                var sourceCriteria = this._sourceCriteria;
                var newCriteria = this;
                setTimeout(function () {
                    newCriteria._$stepListContainer.height(newCriteria._$stepList.find('li.step-0 > .dgfw-criteria-step-wrapper').height() + 60);
                    newCriteria._$stepListContainer.addClass('transition');
                    setTimeout(function () {
                        sourceCriteria._$stepList.remove();
                        newCriteria._$stepListContainer.removeClass('transition');
                        // dereference for garbage collection, but leave a bool flag
                        newCriteria._sourceCriteria = true;
                    }, 800);
                }, 100);
            } else {
                setTimeout(function () {
                    _this7.readjustSize();
                }, 10);
            }

            if (this._conditions.subcriteria) {
                this._conditions.subcriteria.forEach(function (subcriteriaData, index, collection) {
                    var subcriteria = new CriteriaFactory.create(subcriteriaData.id, subcriteriaData.type, subcriteriaData);
                    _this7._subcriteria.set(subcriteriaData.id, subcriteria);
                    if (_this7._$element.hasClass('first')) {
                        _this7._$element.addClass(subcriteriaData.logic.toLowerCase());
                    }
                    _this7.appendSubcriteriaElement(subcriteria.element());
                    _this7._bound.push(new BoundElement(_this7._$element, subcriteria.elementSelector(), subcriteria.changeTypeEvent(), _this7, 'changeCriteriaType'));
                    _this7._bound.push(new BoundElement(_this7._$element, subcriteria.elementSelector(), subcriteria.removeEvent(), _this7, 'removeSubcriteria'));
                });
                // unset subcriteria data after initialization
                this._conditions.subcriteria = undefined;
            }
        }
    }, {
        key: 'removeElement',
        value: function removeElement() {
            var _this8 = this;

            this._$element.css({ height: this._$element.height() });
            this._$element.slideUp(350, function () {
                _this8._$element.remove();
            });
        }
    }, {
        key: 'removeCriteria',
        value: function removeCriteria() {
            var _this9 = this;

            if (confirm(Translate.text('Are you sure you want do remove this condition and all its child conditions?'))) {
                this._$element.animate({ opacity: 0 }, 350, function () {
                    _this9._$element.trigger(_this9.removeEvent(), [_this9._id.toString()]);
                });
            }
        }
    }, {
        key: 'addHighlight',
        value: function addHighlight() {
            this._$element.addClass('highlight');
        }
    }, {
        key: 'removeHighlight',
        value: function removeHighlight() {
            this._$element.removeClass('highlight');
        }
    }, {
        key: 'removeSubcriteria',
        value: function removeSubcriteria(event, subcriteriaId) {
            var criteria = this._subcriteria.get(subcriteriaId);
            this._subcriteria.delete(subcriteriaId);
            criteria.removeElement();
            this.unbindSelector(criteria.elementSelector());

            if (this._$element.hasClass('first') && !this._subcriteria.size) {
                this._$element.removeClass('and or');
                this._$andOr.find('button').show();
            }
        }
    }, {
        key: 'unbindSelector',
        value: function unbindSelector(selector) {
            var newBound = new Array();
            this._bound.forEach(function (boundElement, index) {
                if (boundElement.selector() === selector) {
                    boundElement.unbind();
                } else {
                    newBound.push(boundElement);
                }
            });
            this._bound = newBound;
        }
    }, {
        key: 'prevStepButtonText',
        value: function prevStepButtonText() {
            var prevStep;
            prevStep = this._currentStep > 0 ? this._currentStep - 1 : this._currentStep;
            return this._steps[prevStep].stepName || Translate.text('Back');
        }
    }, {
        key: 'nextStepButtonText',
        value: function nextStepButtonText() {
            var nextStep;
            nextStep = this._currentStep < this._lastStep ? this._currentStep + 1 : this._currentStep;
            return this._steps[nextStep].stepName || Translate.text('Next');
        }
    }, {
        key: 'toggleStepHelp',
        value: function toggleStepHelp(event) {
            var _this10 = this;

            var $stepDescription = jQuery(event.currentTarget);
            var $stepHelp = $stepDescription.siblings('.dgfw-step-help');

            if ($stepHelp.is(':visible')) {
                $stepHelp.slideUp(185);
            } else {
                $stepHelp.slideDown(185);
            }

            setTimeout(function () {
                _this10.readjustSize();
            }, 185);
        }
    }]);
    return Criteria;
}();

var Meta = function () {
    function Meta(id, options) {
        classCallCheck(this, Meta);

        this._id = id;
        this._value;
        this._elements;
        this._inputElementId;
        this._$inputElement;
        this._options = options;
        this._bindings = new Array();

        this.init();
    }

    createClass(Meta, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'hookElements',
        value: function hookElements() {
            this._$inputElement = this._$inputElement || jQuery(document.getElementById(this._inputElementId));
        }
    }, {
        key: 'elements',
        value: function elements() {
            return this._elements;
        }
    }, {
        key: 'id',
        value: function id() {
            return this._id;
        }
    }, {
        key: 'elementId',
        value: function elementId() {
            return this._inputElementId;
        }
    }, {
        key: 'bindings',
        value: function bindings() {
            return this._bindings;
        }
    }]);
    return Meta;
}();

var MetaCurrency = function (_Meta) {
    inherits(MetaCurrency, _Meta);

    function MetaCurrency() {
        classCallCheck(this, MetaCurrency);
        return possibleConstructorReturn(this, (MetaCurrency.__proto__ || Object.getPrototypeOf(MetaCurrency)).apply(this, arguments));
    }

    createClass(MetaCurrency, [{
        key: 'init',
        value: function init() {
            this._currency = this._options.currency;
            this._label = this._options.label;
            this._inputElementId = 'dgfw_criteria_amount_' + this._id;
            this._currencyElementId = 'dgfw_criteria_amount_currency_' + this._id;
            this._prefixElementId = 'dgfw_criteria_amount_prefix_' + this._id;
            this._$prefixElement = null;
            this._value = this._options.value;
            // this._minValue = 0;
            // this._maxValue = Infinity;

            var currencySpan = {
                tag: 'span',
                id: this._prefixElementId,
                classes: ['dgfw-currency', 'dgfw-currency-amount'],
                text: this._currency.symbol
            };

            this._elements = [{
                tag: 'label',
                id: 'dgfw_criteria_amount_label_' + this._id,
                classes: ['dgfw-label', 'dgfw-label-amount'],
                text: this._label,
                attributes: {
                    'for': this._inputElementId
                }
            }];

            if (this._currency.position === 'left' || this._currency.position === 'left_space') {
                currencySpan.classes.push('left');
                this._elements.push(currencySpan);
            }

            this._elements.push({
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-amount'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'number',
                    step: '0.01',
                    // min: this._minValue,
                    // max: this._maxValue,
                    value: this._value
                }
            });

            if (this._currency.position === 'right' || this._currency.position === 'right_space') {
                currencySpan.classes.push('right');
                this._elements.push(currencySpan);
            }

            this._elements.push({
                tag: 'input',
                id: this._currencyElementId,
                classes: ['dgfw-amount'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]',
                    type: 'hidden',
                    value: this._currency.text
                }
            });

            get(MetaCurrency.prototype.__proto__ || Object.getPrototypeOf(MetaCurrency.prototype), 'init', this).call(this);
        }
    }, {
        key: 'hookElements',
        value: function hookElements() {
            get(MetaCurrency.prototype.__proto__ || Object.getPrototypeOf(MetaCurrency.prototype), 'hookElements', this).call(this);
            this._$prefixElement = this._$prefixElement || jQuery(document.getElementById(this._prefixElementId));
            this._$currencyElement = this._$currencyElement || jQuery(document.getElementById(this._currencyElementId));
        }
    }, {
        key: 'changeCurrencyTo',
        value: function changeCurrencyTo(currency) {
            this.hookElements();

            // switch places if different
            if (this._currency.position !== currency.position) {
                if (currency.position === 'left' || currency.position === 'left_space') {
                    this._$prefixElement.removeClass('right').addClass('left').insertBefore(this._$inputElement);
                } else {
                    this._$prefixElement.removeClass('left').addClass('right').insertAfter(this._$inputElement);
                }
            }

            this._currency = currency;
            this._$prefixElement.text(this._currency.symbol);
            this._$currencyElement.val(this._currency.text);
        }
    }, {
        key: 'validate',
        value: function validate() {
            this.hookElements();
            var newValue = parseFloat(this._$inputElement.val());
            var valid = false;
            // if ( (newValue >= this._minValue) && (newValue <= this._maxValue) ) {
            this._value = newValue;
            valid = true;
            // }

            this.format();
            return valid;
        }
    }, {
        key: 'value',
        value: function value() {
            var newValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (newValue) {
                this._value = parseFloat(newValue);
                this.format();
            }

            return this._value;
        }
    }, {
        key: 'setMin',
        value: function setMin(minValue) {
            this.hookElements();
            this._minValue = parseFloat(minValue);
            this._$inputElement.attr('min', this._minValue);
            if (this._minValue > this._value) {
                this.value(this._minValue);
            }
        }
    }, {
        key: 'setMax',
        value: function setMax(maxValue) {
            this.hookElements();
            this._maxValue = parseFloat(maxValue);
            this._$inputElement.attr('max', this._maxValue);
            if (this._maxValue < this._value) {
                this.value(this._maxValue);
            }
        }
    }, {
        key: 'format',
        value: function format() {
            this.hookElements();
            var n = 2;
            var x = 999; // no thousand separator for now
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            var formatedValue = this._value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
            this._$inputElement.val(formatedValue);
        }
    }]);
    return MetaCurrency;
}(Meta);

var CriteriaAmounts = function (_Criteria) {
    inherits(CriteriaAmounts, _Criteria);

    function CriteriaAmounts() {
        classCallCheck(this, CriteriaAmounts);
        return possibleConstructorReturn(this, (CriteriaAmounts.__proto__ || Object.getPrototypeOf(CriteriaAmounts)).apply(this, arguments));
    }

    createClass(CriteriaAmounts, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._type = 'amounts';
            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._currencies = decomGiftable.screen.data.currencies;

            // saved currency if enabled, first of enabled currencies, or default currency
            if (this._conditions.min_amount && this._conditions.min_amount.currency) {
                this._currency = this.getCurrency(this._conditions.min_amount.currency);
            } else {
                this._currency = this.getDefaultCurrency();
            }

            this._currencySelectId = 'dgfw_criteria_currency_' + this._id;
            this._$currencySelect = null;

            var currencyElements = [];

            if (this._currencies.length) {
                this._currencies.forEach(function (currency, key, collection) {
                    currencyElements.push({
                        tag: 'option',
                        attributes: {
                            value: currency.text,
                            selected: currency.text === _this2._currency.text ? 'selected' : false
                        },
                        text: currency.text
                    });
                });
            }

            this._minAmount = new MetaCurrency(this._id + '-min_amount', { currency: this._currency, label: Translate.text('Min amount'), value: this._conditions.min_amount ? this._conditions.min_amount.value : 0 });
            this._maxAmount = new MetaCurrency(this._id + '-max_amount', { currency: this._currency, label: Translate.text('Max amount'), value: this._conditions.max_amount ? this._conditions.max_amount.value : 0 });

            this._steps = new Array();

            this._steps[0] = {
                description: Translate.text('Set amount range. Leave empty for no limits.'),
                help: Translate.text('This condition will be met if the <strong>total cart amount</strong> is within the defined min/max amounts range.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_min_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._minAmount.elements()
                }, {
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_max_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._maxAmount.elements()
                }]
            };

            if (currencyElements.length) {
                this._steps[0].elements.unshift({
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_currency_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: [{
                        tag: 'label',
                        id: 'dgfw_criteria_currency_label_' + this._id,
                        classes: ['dgfw-label', 'dgfw-label-amount'],
                        text: Translate.text('Currency'),
                        attributes: {
                            'for': 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                        }
                    }, {
                        tag: 'select',
                        id: this._currencySelectId,
                        classes: ['dgfw-currency', 'dgfw-select'],
                        attributes: {
                            name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                        },
                        children: currencyElements
                    }]
                });

                this._steps[0].elements.push({
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_currency_note_' + this._id,
                    classes: ['dgfw-step-description', 'dgfw-step-note'],
                    html: Translate.text('<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.')
                });
            }

            this.showCriteria();

            this._bindings.push({
                selector: '#' + this._currencySelectId,
                event: 'change',
                object: this,
                method: 'changeCurrency'
            }, {
                selector: '#' + this._minAmount.elementId(),
                event: 'focusout',
                object: this,
                method: 'updateMinAmount'
            }, {
                selector: '#' + this._maxAmount.elementId(),
                event: 'focusout',
                object: this,
                method: 'updateMaxAmount'
            });

            get(CriteriaAmounts.prototype.__proto__ || Object.getPrototypeOf(CriteriaAmounts.prototype), 'init', this).call(this);
        }
    }, {
        key: 'getCurrency',
        value: function getCurrency(currencyText) {
            if (!this._currencies) {
                return decomGiftable.screen.data.currency || false;
            }

            var currenciesLength = this._currencies.length;
            var newCurrency = false;

            for (var i = 0; i < currenciesLength; i++) {
                if (this._currencies[i].text === currencyText) {
                    newCurrency = this._currencies[i];
                    break;
                }
            }

            // set default currency if not within the currently enabled currencies
            if (!newCurrency) {
                newCurrency = decomGiftable.screen.data.currency;
            }

            return newCurrency;
        }
    }, {
        key: 'getDefaultCurrency',
        value: function getDefaultCurrency() {
            return this._currencies && this._currencies.length ? this._currencies[0] : decomGiftable.screen.data.currency;
        }
    }, {
        key: 'changeCurrency',
        value: function changeCurrency() {
            if (!this._$currencySelect) {
                this._$currencySelect = jQuery(document.getElementById(this._currencySelectId));
            }

            var newCurrency = this.getCurrency(this._$currencySelect.val());

            // change currency only if different
            if (newCurrency && newCurrency.text !== this._currency.text) {
                this._currency = newCurrency;
                this._minAmount.changeCurrencyTo(this._currency);
                this._maxAmount.changeCurrencyTo(this._currency);
            }
        }
    }, {
        key: 'updateMinAmount',
        value: function updateMinAmount() {
            if (this._minAmount.validate()) {
                // this._maxAmount.setMin(this._minAmount.value());

                // if (this._minAmount.value() > this._maxAmount.value()) {
                //     this._maxAmount.value(this._minAmount.value());
                // }
            }
        }
    }, {
        key: 'updateMaxAmount',
        value: function updateMaxAmount() {
            if (this._maxAmount.validate()) {
                // this._minAmount.setMax(this._maxAmount.value());
            }
        }
    }]);
    return CriteriaAmounts;
}(Criteria);

var MetaQuantity = function (_Meta) {
	inherits(MetaQuantity, _Meta);

	function MetaQuantity() {
		classCallCheck(this, MetaQuantity);
		return possibleConstructorReturn(this, (MetaQuantity.__proto__ || Object.getPrototypeOf(MetaQuantity)).apply(this, arguments));
	}

	createClass(MetaQuantity, [{
		key: 'init',
		value: function init() {
			this._label = this._options.label;
			this._inputElementId = 'dgfw_criteria_items_' + this._id;
			this._value = this._options.value;
			// this._minValue = 0;
			// this._maxValue = Infinity;

			this._elements = [{
				tag: 'label',
				id: 'dgfw_criteria_items_label_' + this._id,
				classes: ['dgfw-label', 'dgfw-label-items'],
				text: this._label,
				attributes: {
					'for': this._inputElementId
				}
			}, {
				tag: 'input',
				id: this._inputElementId,
				classes: ['dgfw-items'],
				attributes: {
					name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
					type: 'number',
					step: '1',
					// min: this._minValue,
					// max: this._maxValue,
					value: this._value
				}
			}];

			get(MetaQuantity.prototype.__proto__ || Object.getPrototypeOf(MetaQuantity.prototype), 'init', this).call(this);
		}
	}, {
		key: 'validate',
		value: function validate() {
			this.hookElements();
			var newValue = parseFloat(this._$inputElement.val());
			var valid = false;
			if (newValue >= this._minValue && newValue <= this._maxValue) {
				this._value = newValue;
				valid = true;
			}

			this.format();
			return valid;
		}
	}, {
		key: 'value',
		value: function value() {
			var newValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (newValue) {
				this._value = parseFloat(newValue);
				this.format();
			}

			return this._value;
		}
	}, {
		key: 'setMin',
		value: function setMin(minValue) {
			this.hookElements();
			this._minValue = parseFloat(minValue);
			this._$inputElement.attr('min', this._minValue);
			if (this._minValue > this._value) {
				this.value(this._minValue);
			}
		}
	}, {
		key: 'setMax',
		value: function setMax(maxValue) {
			this.hookElements();
			this._maxValue = parseFloat(maxValue);
			this._$inputElement.attr('max', this._maxValue);
			if (this._maxValue < this._value) {
				this.value(this._maxValue);
			}
		}
	}, {
		key: 'format',
		value: function format() {
			this.hookElements();
			var n = 0;
			var x = 3;
			var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
			var formatedValue = this._value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
			this._$inputElement.val(formatedValue);
		}
	}]);
	return MetaQuantity;
}(Meta);

var CriteriaItems = function (_Criteria) {
    inherits(CriteriaItems, _Criteria);

    function CriteriaItems() {
        classCallCheck(this, CriteriaItems);
        return possibleConstructorReturn(this, (CriteriaItems.__proto__ || Object.getPrototypeOf(CriteriaItems)).apply(this, arguments));
    }

    createClass(CriteriaItems, [{
        key: 'init',
        value: function init() {
            this._type = 'items';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._minItems = new MetaQuantity(this._id + '-min_items', { label: Translate.text('Min items'), value: this._conditions.min_items ? this._conditions.min_items.value : 0 });
            this._maxItems = new MetaQuantity(this._id + '-max_items', { label: Translate.text('Max items'), value: this._conditions.max_items ? this._conditions.max_items.value : 0 });

            this._steps = new Array();

            this._steps[0] = {
                description: Translate.text('Set items range. Leave empty for no limits.'),
                help: Translate.text('This condition will be met if the <strong>total number of items in the cart</strong> is within the defined min/max items range.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_items_min_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._minItems.elements()
                }, {
                    tag: 'div',
                    id: 'dgfw_criteria_items_max_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._maxItems.elements()
                }]
            };

            this.showCriteria();

            // this._bindings.push(
            //     {
            //         selector: '#' + this._minItems.elementId(),
            //         event: 'focusout',
            //         object: this,
            //         method: 'updateMinItems'
            //     },
            //     {
            //         selector: '#' + this._maxItems.elementId(),
            //         event: 'focusout',
            //         object: this,
            //         method: 'updateMaxItems'
            //     }

            // );

            get(CriteriaItems.prototype.__proto__ || Object.getPrototypeOf(CriteriaItems.prototype), 'init', this).call(this);
        }
    }, {
        key: 'updateMinItems',
        value: function updateMinItems() {
            if (this._minItems.validate()) {
                this._maxItems.setMin(this._minItems.value());

                if (this._minItems.value() > this._maxItems.value()) {
                    this._maxItems.value(this._minItems.value());
                }
            }
        }
    }, {
        key: 'updateMaxItems',
        value: function updateMaxItems() {
            if (this._maxItems.validate()) {
                this._minItems.setMax(this._maxItems.value());
            }
        }
    }]);
    return CriteriaItems;
}(Criteria);

var MetaPosts = function (_Meta) {
    inherits(MetaPosts, _Meta);

    function MetaPosts() {
        classCallCheck(this, MetaPosts);
        return possibleConstructorReturn(this, (MetaPosts.__proto__ || Object.getPrototypeOf(MetaPosts)).apply(this, arguments));
    }

    createClass(MetaPosts, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._postType = this._options.postType;
            this._label = this._options.label;
            this._inputElementId = 'dgfw_criteria_posts_' + this._id;
            this._containerId = 'dgfw_critera_posts_select_' + this._id;
            this._selectedListId = 'dgfw_criteria_posts_' + this._id + '_selected_list';

            this._advancedContainerId = 'dgfw_criteria_posts_advanced_settings_' + this._id;
            this._advancedListId = 'dgfw_criteria_posts_' + this._id + '_advanced_list';

            this._navPrevId = 'dgfw_criteria_posts_select_nav_prev_' + this._id;
            this._navNextId = 'dgfw_criteria_posts_select_nav_next_' + this._id;
            this._statusCurrentPageId = 'dgfw_criteria_posts_select_nav_status_current_' + this._id;
            this._statusTotalPagesId = 'dgfw_criteria_posts_select_nav_status_total_' + this._id;
            this._value = new Object();

            if (this._options.value) {
                this._value = this._options.value;
            }

            this._currentPage = 0;
            this._totalProducts = 0;
            this._totalPages = 1;
            this._productsPerPage = jQuery(window).width() > 1023 ? 5 : 3;
            var productElements = new Array();

            if (decomGiftable.screen.data.products) {
                this._totalProducts = decomGiftable.screen.data.products.length;
                this._totalPages = Math.ceil(this._totalProducts / this._productsPerPage);
                decomGiftable.screen.data.products.forEach(function (product, index, collection) {
                    productElements[Math.floor(index / _this2._productsPerPage)] = productElements[Math.floor(index / _this2._productsPerPage)] || new Array();
                    productElements[Math.floor(index / _this2._productsPerPage)].push(_this2.productElement(product));
                });
            }

            var productPages = new Array();

            productElements.forEach(function (productPage, index, collection) {
                productPages[index] = {
                    tag: 'div',
                    id: _this2._containerId + '_page_' + index,
                    classes: ['dgfw-select-posts-container-page', 'page-' + index, index === 0 ? 'page-current' : ''],
                    children: productPage
                };
            });

            var selectedProductsElement = {
                tag: 'div',
                id: this._selectedListId,
                classes: ['dgfw-selected-posts'],
                children: []
            };

            var advancedElement = {
                tag: 'div',
                id: this._advancedListId,
                classes: ['dgfw-advanced-posts'],
                children: []
            };

            if (Object.keys(this._value).length) {
                for (var selectedProductId in this._value) {
                    var selectedProduct = this.post(parseInt(selectedProductId));
                    if (this._value[selectedProductId] && selectedProduct) {
                        selectedProductsElement.children.push(this.selectedProductElement(selectedProduct, false));
                        advancedElement.children.push(this.advancedProductElement(selectedProduct, this._value[selectedProductId]));
                    }
                }
            } else {
                selectedProductsElement.classes.push('invisible');
            }

            this._elements = [selectedProductsElement, {
                tag: 'div',
                id: this._containerId,
                classes: ['dgfw-select-wrapper', 'dgfw-select-posts', 'current-page-0'],
                children: productPages
            }, {
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'hidden',
                    value: Object.keys(this._value).join(',')
                }
            }, {
                tag: 'input',
                id: this._inputElementId + '_post_types',
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][post_types][]',
                    type: 'hidden',
                    value: this._postType
                }
            }];

            if (this._totalPages > 1) {
                this._elements.splice(1, 0, {
                    tag: 'div',
                    id: 'dgfw_criteria_posts_select_nav_' + this._id,
                    classes: ['dgfw-select-posts-nav'],
                    children: [{
                        tag: 'button',
                        id: this._navPrevId,
                        classes: ['dgfw-select-posts-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-left']
                    }, {
                        tag: 'span',
                        id: 'dgfw_criteria_select_nav_status_' + this._id,
                        classes: ['dgfw-select-posts-nav-status'],
                        children: [{
                            tag: 'span',
                            id: '',
                            classes: [],
                            text: Translate.text('Page ')
                        }, {
                            tag: 'span',
                            id: this._statusCurrentPageId,
                            classes: ['dgfw-select-posts-nav-status-number'],
                            text: this._currentPage + 1
                        }, {
                            tag: 'span',
                            id: '',
                            classes: [],
                            text: Translate.text(' of ')
                        }, {
                            tag: 'span',
                            id: this._statusTotalPagesId,
                            classes: ['dgfw-select-posts-nav-status-number'],
                            text: this._totalPages
                        }]
                    }, {
                        tag: 'button',
                        id: this._navNextId,
                        classes: ['dgfw-select-posts-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-right']
                    }]
                });
            }

            this._advancedElements = [{
                tag: 'div',
                id: this._advancedContainerId,
                classes: ['dgfw-advanced-wrapper'],
                children: [advancedElement]
            }];

            this._bindings.push({
                selector: '#' + this._containerId,
                event: 'mouseover',
                object: this,
                method: 'loadNextPage'
            }, {
                selector: '#' + this._navPrevId,
                event: 'click',
                object: this,
                method: 'previousPage'
            }, {
                selector: '#' + this._navNextId,
                event: 'click',
                object: this,
                method: 'nextPage'
            }, {
                selector: '.dgfw-posts-select-post',
                event: 'click',
                object: this,
                method: 'toggleSelectPost'
            }, {
                selector: '.dgfw-posts-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedPost'
            });

            get(MetaPosts.prototype.__proto__ || Object.getPrototypeOf(MetaPosts.prototype), 'init', this).call(this);
        }
    }, {
        key: 'hookElements',
        value: function hookElements() {
            get(MetaPosts.prototype.__proto__ || Object.getPrototypeOf(MetaPosts.prototype), 'hookElements', this).call(this);
            this._$containerElement = this._$containerElement || jQuery(document.getElementById(this._containerId));
            this._$selectedListElement = this._$selectedListElement || jQuery(document.getElementById(this._selectedListId));
            this._$currentPageStatus = this._$currentPageStatus || jQuery(document.getElementById(this._statusCurrentPageId));
            this._$advancedListElement = this._$advancedListElement || jQuery(document.getElementById(this._advancedListId));
        }
    }, {
        key: 'containerId',
        value: function containerId() {
            return this._containerId;
        }
    }, {
        key: 'loadNextPage',
        value: function loadNextPage() {
            this.hookElements();
            Debug.info('Loading more products...');
        }
    }, {
        key: 'productElement',
        value: function productElement(product) {
            var productClasses = ['dgfw-posts-select-post'];

            if (this._value[product.id]) {
                productClasses.push('selected');
            }

            return {
                tag: 'div',
                id: 'dgfw_criteria_posts_' + this._id + '_product_' + product.id,
                classes: productClasses,
                attributes: {
                    'data-decom-id': product.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 30 ? product.title : product.title.slice(0, 30) + '…'
                }, {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');'
                    }
                }]
            };
        }
    }, {
        key: 'selectedProductElement',
        value: function selectedProductElement(product) {
            var invisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var selectedClasses = ['dgfw-posts-selected-post'];

            if (invisible) {
                selectedClasses.push('invisible');
            }

            return {
                tag: 'div',
                id: 'dgfw_criteria_posts_' + this._id + '_selected_' + product.id,
                classes: selectedClasses,
                attributes: {
                    'data-decom-id': product.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 30 ? product.title : product.title.slice(0, 30) + '…'
                }, {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');'
                    }
                }, {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_selected_remove_' + product.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': product.id
                    }
                }]
            };
        }
    }, {
        key: 'advancedProductMinItemsInputId',
        value: function advancedProductMinItemsInputId(productId) {
            return 'dgfw_criteria_posts_advanced_min_items_' + productId;
        }
    }, {
        key: 'advancedProductElement',
        value: function advancedProductElement(product, productAdvancedSettings) {
            var advancedClasses = ['dgfw-posts-advanced-post'];
            var minItemsInputId = this.advancedProductMinItemsInputId(product.id);

            return {
                tag: 'div',
                id: 'dgfw_criteria_posts_' + this._id + '_advanced_' + product.id,
                classes: advancedClasses,
                attributes: {
                    'data-decom-id': product.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: product.title.length < 20 ? product.title : product.title.slice(0, 40) + '…'
                }, {
                    tag: 'div',
                    classes: ['dgfw-posts-select-post-img'],
                    attributes: {
                        style: 'background-image: url(' + product.img + ');'
                    }
                }, {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_advanced_remove_' + product.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': product.id
                    }
                }, {
                    tag: 'input',
                    id: minItemsInputId,
                    classes: ['dgfw-posts-advanced-min-items'],
                    attributes: {
                        type: 'number',
                        name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][' + product.id + '][min_items]',
                        value: productAdvancedSettings.min_items
                    }
                }]
            };
        }
    }, {
        key: 'toggleSelectPost',
        value: function toggleSelectPost(event) {
            this.hookElements();
            var $post = jQuery(event.currentTarget);
            var postId = parseInt($post.data('decom-id'));
            $post.toggleClass('selected');
            if (this._value[postId]) {
                delete this._value[postId];
                this.removeFromList(postId);
            } else {
                this._value[postId] = { min_items: 1 };
                this.addToList(postId);
            }
            this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
        }
    }, {
        key: 'removeSelectedPost',
        value: function removeSelectedPost(event) {
            this.hookElements();
            var $post = jQuery(event.currentTarget);
            var postId = parseInt($post.data('decom-id'));
            $post = jQuery('#dgfw_criteria_posts_' + this._id + '_product_' + postId);
            $post.removeClass('selected');
            if (this._value[postId]) {
                delete this._value[postId];
                this.removeFromList(postId);
            }
            // this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
        }
    }, {
        key: 'addToList',
        value: function addToList(postId) {
            var _this3 = this;

            var post = this.post(postId);
            this.createAndAppendChild(this._$selectedListElement, this.selectedProductElement(post));
            this.createAndAppendChild(this._$advancedListElement, this.advancedProductElement(post, { min_items: 1 }));
            setTimeout(function () {
                _this3._$selectedListElement.removeClass('invisible');
                _this3.$postElement(postId).removeClass('invisible');
                setTimeout(function () {
                    _this3.selectionChanged();
                }, 200);
            }, 50);
        }
    }, {
        key: 'removeFromList',
        value: function removeFromList(postId) {
            var _this4 = this;

            var $post = this.$postElement(postId);
            var $advancedPost = this.$advancedPostElement(postId);
            $post.addClass('invisible');
            setTimeout(function () {
                if (Object.keys(_this4._value).length === 0) {
                    _this4._$selectedListElement.addClass('invisible');
                }
                $post.remove();
                $advancedPost.remove();
                setTimeout(function () {
                    _this4.selectionChanged();
                }, 200);
            }, 50);
        }
    }, {
        key: 'selectionChangedEvent',
        value: function selectionChangedEvent() {
            return 'DGFW.SelectionChanged_' + this._id;
        }
    }, {
        key: 'selectionChanged',
        value: function selectionChanged() {
            this._$inputElement.trigger(this.selectionChangedEvent());
        }
    }, {
        key: 'post',
        value: function post(postId) {
            var product = false;

            decomGiftable.screen.data.products.forEach(function (post, index, products) {
                if (post.id === postId) {
                    product = post;
                }
            });

            return product;
        }
    }, {
        key: '$postElement',
        value: function $postElement(postId) {
            return jQuery(document.getElementById('dgfw_criteria_posts_' + this._id + '_selected_' + postId));
        }
    }, {
        key: '$advancedPostElement',
        value: function $advancedPostElement(postId) {
            return jQuery(document.getElementById('dgfw_criteria_posts_' + this._id + '_advanced_' + postId));
        }
    }, {
        key: 'createAndAppendChild',
        value: function createAndAppendChild($parentElement, childData) {
            var _this5 = this;

            var $el = jQuery(document.createElement(childData.tag));
            $el.attr('id', childData.id);
            if (childData.classes) {
                $el.addClass(childData.classes.join(' '));
            }
            if (childData.attributes) {
                for (var attr in childData.attributes) {
                    $el.attr(attr, childData.attributes[attr]);
                }
            }
            if (childData.text) {
                $el.text(childData.text);
            }
            $parentElement.append($el);
            if (childData.children) {
                childData.children.forEach(function (elementData, index, collection) {
                    _this5.createAndAppendChild($el, elementData);
                });
            }
            return $el;
        }
    }, {
        key: 'previousPage',
        value: function previousPage() {
            this.hookElements();
            this._currentPage -= this._currentPage > 0 ? 1 : 0;
            this._$containerElement.find('.page-' + (this._currentPage + 1)).removeClass('page-current');
            this._$containerElement.find('.page-' + this._currentPage).removeClass('page-prev').addClass('page-current');
            this.updateCurrentPageStatus();
        }
    }, {
        key: 'nextPage',
        value: function nextPage() {
            this.hookElements();
            this._currentPage += this._currentPage < this._totalPages - 1 ? 1 : 0;
            this._$containerElement.find('.page-' + (this._currentPage - 1)).removeClass('page-current').addClass('page-prev');
            this._$containerElement.find('.page-' + this._currentPage).addClass('page-current');
            this.updateCurrentPageStatus();
        }
    }, {
        key: 'updateCurrentPageStatus',
        value: function updateCurrentPageStatus() {
            this.hookElements();
            this._$currentPageStatus.text(this._currentPage + 1);
        }
    }, {
        key: 'advancedElements',
        value: function advancedElements() {
            return this._advancedElements;
        }
    }]);
    return MetaPosts;
}(Meta);

var CriteriaProducts = function (_Criteria) {
    inherits(CriteriaProducts, _Criteria);

    function CriteriaProducts() {
        classCallCheck(this, CriteriaProducts);
        return possibleConstructorReturn(this, (CriteriaProducts.__proto__ || Object.getPrototypeOf(CriteriaProducts)).apply(this, arguments));
    }

    createClass(CriteriaProducts, [{
        key: 'init',
        value: function init() {
            this._type = 'products';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._products = new MetaPosts(this._id + '-posts', { label: Translate.text('Posts'), postType: 'product', value: this._conditions.posts ? this._conditions.posts.value : false });

            this._steps = new Array();

            var productElements = this._products.elements();
            var productAdvancedElements = this._products.advancedElements();

            this._steps[0] = {
                stepName: Translate.text('Select Products'),
                description: Translate.text('Select products this gift category applies for.'),
                help: Translate.text('This condition will be met if the customer has at least one item of any of the selected products in their cart. To specify a minimum quantity for each selected product, click the <strong>Product Quantities</strong> button below.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_products_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: productElements
                }]
            };

            this._steps[1] = {
                stepName: Translate.text('Product Quantities'),
                description: Translate.text('Set minimum quantity for each selected product.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_products_advanced_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: productAdvancedElements
                }]
            };

            this.showCriteria();

            this._bindings = this._bindings.concat(this._products.bindings());

            this._bindings.push({
                selector: '#' + this._products.elementId(),
                event: this._products.selectionChangedEvent(),
                object: this,
                method: 'readjustSize'
            });

            get(CriteriaProducts.prototype.__proto__ || Object.getPrototypeOf(CriteriaProducts.prototype), 'init', this).call(this);
        }
    }]);
    return CriteriaProducts;
}(Criteria);

var MetaTerms = function (_Meta) {
    inherits(MetaTerms, _Meta);

    function MetaTerms() {
        classCallCheck(this, MetaTerms);
        return possibleConstructorReturn(this, (MetaTerms.__proto__ || Object.getPrototypeOf(MetaTerms)).apply(this, arguments));
    }

    createClass(MetaTerms, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._taxonomy = this._options.taxonomy;
            this._label = this._options.label;
            this._value = this._options.terms.value || new Array();
            this._minAmounts = this._options.terms.min_amounts || new Object();
            this._minItems = this._options.terms.min_items || new Object();
            this._inputElementId = 'dgfw_criteria_terms_' + this._id;
            this._inputElementName = 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]';

            this._termsMeta = new Object();

            this._currency = this._options.currency;

            this._advancedContainerId = 'dgfw_criteria_terms_advanced_settings_' + this._id;
            this._advancedListId = 'dgfw_criteria_terms_' + this._id + '_advanced_list';

            var termElements = new Array();

            var advancedElement = {
                tag: 'div',
                id: this._advancedListId,
                classes: ['dgfw-advanced-posts'],
                children: []
            };

            if (decomGiftable.screen.data.productCategories) {
                decomGiftable.screen.data.productCategories.forEach(function (term, index, collection) {
                    termElements.push(_this2.termElement(term));
                });
            }

            this._elements = [{
                tag: 'div',
                id: 'dgfw_select_terms_' + this._id,
                classes: ['dgfw-checkbox-group-wrapper'],
                children: termElements
            }, {
                tag: 'input',
                id: this._inputElementId + '_taxonomy',
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][taxonomy]',
                    type: 'hidden',
                    value: this._taxonomy
                }
            }];

            if (this._value.length) {
                this._value.forEach(function (selectedTermId, index) {
                    var selectedTerm = _this2.productCategory(parseInt(selectedTermId));
                    if (selectedTerm) {
                        advancedElement.children.push(_this2.advancedProductCategoryElement(selectedTerm, selectedTermId));
                    }
                });
            }

            this._advancedElements = [{
                tag: 'div',
                id: this._advancedContainerId,
                classes: ['dgfw-advanced-wrapper'],
                children: [advancedElement]
            }];

            this._bindings.push({
                selector: '.dgfw-terms-select-checkbox',
                event: 'change',
                object: this,
                method: 'toggleSelectTerm'
            }, {
                selector: '.dgfw-posts-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedTerm'
            });

            get(MetaTerms.prototype.__proto__ || Object.getPrototypeOf(MetaTerms.prototype), 'init', this).call(this);
        }
    }, {
        key: 'advancedListId',
        value: function advancedListId() {
            return this._advancedListId;
        }
    }, {
        key: 'hookElements',
        value: function hookElements() {
            get(MetaTerms.prototype.__proto__ || Object.getPrototypeOf(MetaTerms.prototype), 'hookElements', this).call(this);

            this._$advancedListElement = this._$advancedListElement || jQuery(document.getElementById(this._advancedListId));
        }
    }, {
        key: 'termElement',
        value: function termElement(term) {
            var checkBoxAttributes = {
                type: 'checkbox',
                name: this._inputElementName + '[]',
                value: term.id
            };

            this._value.forEach(function (termId, index, collection) {
                if (parseInt(termId) === term.id) {
                    checkBoxAttributes.checked = 'checked';
                }
            });
            return {
                tag: 'div',
                id: 'dgfw_criteria_terms_' + this._id + '_term_' + term.id,
                classes: ['dgfw-terms-select'],
                attributes: {
                    'data-decom-id': term.id
                },
                children: [{
                    tag: 'input',
                    id: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id,
                    classes: ['dgfw-terms-select-checkbox'],
                    attributes: checkBoxAttributes
                }, {
                    tag: 'label',
                    classes: ['dgfw-terms-select-label'],
                    text: term.title,
                    attributes: {
                        for: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id
                    }
                }]
            };
        }
    }, {
        key: 'productCategory',
        value: function productCategory(termId) {
            var productCategory = false;

            decomGiftable.screen.data.productCategories.forEach(function (term, index, terms) {
                if (term.id === termId) {
                    productCategory = term;
                }
            });

            return productCategory;
        }
    }, {
        key: 'advancedProductCategoryElement',
        value: function advancedProductCategoryElement(term, termAdvancedSettings) {
            var advancedClasses = ['dgfw-posts-advanced-post', 'dgfw-terms-advanced-term'];

            var minAmountInputId = this._id + '-min_amounts-' + term.id;
            var minAmountValue = this._minAmounts[term.id] ? this._minAmounts[term.id].value : 0;

            var minItemsInputId = this._id + '-min_items-' + term.id;
            var minItemsValue = this._minItems[term.id] ? this._minItems[term.id].value : 1;

            this._termsMeta[term.id] = {
                minAmount: new MetaCurrency(minAmountInputId, { currency: this._currency, label: Translate.text('Min amount'), value: minAmountValue }),
                minItems: new MetaQuantity(minItemsInputId, { label: Translate.text('Min items'), value: minItemsValue })
            };

            return {
                tag: 'div',
                id: 'dgfw_criteria_posts_' + this._id + '_advanced_' + term.id,
                classes: advancedClasses,
                attributes: {
                    'data-decom-id': term.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: term.title.length < 20 ? term.title : term.title.slice(0, 40) + '…'
                }, {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_advanced_remove_' + term.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': term.id
                    }
                }, {
                    tag: 'div',
                    id: 'dgfw_criteria_posts_advanced_options_' + term.id,
                    classes: ['dgfw-terms-advanced-options'],
                    children: [{
                        tag: 'div',
                        id: minAmountInputId + '_container',
                        classes: ['dgfw-terms-advanced-min-amount'],
                        children: this._termsMeta[term.id].minAmount.elements()
                    }, {
                        tag: 'div',
                        id: minItemsInputId + '_container',
                        classes: ['dgfw-terms-advanced-min-items'],
                        children: this._termsMeta[term.id].minItems.elements()
                    }]
                }]
            };
        }
    }, {
        key: 'advancedElements',
        value: function advancedElements() {
            return this._advancedElements;
        }
    }, {
        key: 'toggleSelectTerm',
        value: function toggleSelectTerm(event) {
            this.hookElements();

            var $termCheckBox = jQuery(event.currentTarget);
            var termId = parseInt($termCheckBox.val());
            var termEnabled = $termCheckBox.is(':checked');

            if (termEnabled) {
                this.addToList(termId);
            } else {
                this.removeFromList(termId);
            }
        }
    }, {
        key: 'removeSelectedTerm',
        value: function removeSelectedTerm(event) {
            this.hookElements();

            var $advancedElementRemove = jQuery(event.currentTarget);
            var termId = parseInt($advancedElementRemove.data('decom-id'));
            var $termCheckBox = jQuery(document.getElementById('dgfw_terms_select_' + this._id + '_checkbox_' + termId));

            this.removeFromList(termId);
            $termCheckBox.prop('checked', false);
        }
    }, {
        key: 'addToList',
        value: function addToList(termId) {
            var productCategory = this.productCategory(termId);
            this.createAndAppendChild(this._$advancedListElement, this.advancedProductCategoryElement(productCategory));
        }
    }, {
        key: 'removeFromList',
        value: function removeFromList(termId) {
            var $advancedTermElement = this.$advancedTermElement(termId);
            $advancedTermElement.remove();
            delete this._termsMeta[termId];
            this.selectionChanged();
        }
    }, {
        key: '$advancedTermElement',
        value: function $advancedTermElement(termId) {
            return jQuery(document.getElementById('dgfw_criteria_posts_' + this._id + '_advanced_' + termId));
        }
    }, {
        key: 'createAndAppendChild',
        value: function createAndAppendChild($parentElement, childData) {
            var _this3 = this;

            var $el = jQuery(document.createElement(childData.tag));
            $el.attr('id', childData.id);
            if (childData.classes) {
                $el.addClass(childData.classes.join(' '));
            }
            if (childData.attributes) {
                for (var attr in childData.attributes) {
                    $el.attr(attr, childData.attributes[attr]);
                }
            }
            if (childData.text) {
                $el.text(childData.text);
            }
            $parentElement.append($el);
            if (childData.children) {
                childData.children.forEach(function (elementData, index, collection) {
                    _this3.createAndAppendChild($el, elementData);
                });
            }
            return $el;
        }
    }, {
        key: 'selectionChangedEvent',
        value: function selectionChangedEvent() {
            return 'DGFW.SelectionChanged_' + this._id;
        }
    }, {
        key: 'selectionChanged',
        value: function selectionChanged() {
            this._$advancedListElement.trigger(this.selectionChangedEvent());
        }
    }, {
        key: 'changeCurrencyTo',
        value: function changeCurrencyTo(newCurrency) {
            this._currency = newCurrency;

            for (var termId in this._termsMeta) {
                this._termsMeta[termId].minAmount.changeCurrencyTo(this._currency);
            }
        }
    }]);
    return MetaTerms;
}(Meta);

var CriteriaProductCategories = function (_Criteria) {
    inherits(CriteriaProductCategories, _Criteria);

    function CriteriaProductCategories() {
        classCallCheck(this, CriteriaProductCategories);
        return possibleConstructorReturn(this, (CriteriaProductCategories.__proto__ || Object.getPrototypeOf(CriteriaProductCategories)).apply(this, arguments));
    }

    createClass(CriteriaProductCategories, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._type = 'product_categories';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._currencies = decomGiftable.screen.data.currencies;

            // saved currency if enabled, first of enabled currencies, or default currency
            if (this._conditions.currency && this._conditions.currency) {
                this._currency = this.getCurrency(this._conditions.currency);
            } else {
                this._currency = this.getDefaultCurrency();
            }

            this._terms = new MetaTerms(this._id + '-terms', {
                label: Translate.text('Terms'),
                taxonomy: 'product_cat',
                terms: this._conditions.terms ? this._conditions.terms : false,
                currency: this._currency
            });

            this._currencySelectId = 'dgfw_criteria_currency_' + this._id;
            this._$currencySelect = null;

            var currencyElements = [];

            if (this._currencies.length) {
                this._currencies.forEach(function (currency, key, collection) {
                    currencyElements.push({
                        tag: 'option',
                        attributes: {
                            value: currency.text,
                            selected: currency.text === _this2._currency.text ? 'selected' : false
                        },
                        text: currency.text
                    });
                });
            }

            this._steps = new Array();

            this._steps[0] = {
                stepName: Translate.text('Select Product Categories'),
                description: Translate.text('Select product categories this gift category applies for.'),
                help: Translate.text('This condition will be met if the customer has at least one product belonging to any of the selected product categories in their cart. To specify minimum amounts and/or items for each selected category, click the <strong>Amounts and Quantities</strong> button below.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.elements()
                }]
            };

            this._steps[1] = {
                stepName: Translate.text('Amounts and Quantities'),
                description: Translate.text('Set up the minimum amount and/or number of items for each selected category.'),
                help: Translate.text('By default, this condition will be met if the customer has at least one product belonging to any of the selected product categories in their cart. You can change minimum amount and/or items for each selected category here. Leave the fields empty for default value (one item minimum, regardless of the amount).'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_advanced_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.advancedElements()
                }]
            };

            if (currencyElements.length) {
                this._steps[1].elements.unshift({
                    tag: 'div',
                    id: 'dgfw_criteria_terms_currency_container_' + this._id,
                    classes: ['dgfw-criteria-input-container', 'dgfw-criteria-terms-currency-select-container'],
                    children: [{
                        tag: 'label',
                        id: 'dgfw_criteria_currency_label_' + this._id,
                        classes: ['dgfw-label', 'dgfw-label-amount'],
                        text: Translate.text('Currency'),
                        attributes: {
                            'for': 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                        }
                    }, {
                        tag: 'select',
                        id: this._currencySelectId,
                        classes: ['dgfw-currency', 'dgfw-select'],
                        attributes: {
                            name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                        },
                        children: currencyElements
                    }]
                });

                this._steps[1].elements.push({
                    tag: 'div',
                    id: 'dgfw_criteria_terms_currency_note_' + this._id,
                    classes: ['dgfw-step-description', 'dgfw-step-note'],
                    html: Translate.text('<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.')
                });
            }

            this.showCriteria();

            this._bindings = this._bindings.concat(this._terms.bindings());

            this._bindings.push({
                selector: '#' + this._currencySelectId,
                event: 'change',
                object: this,
                method: 'changeCurrency'
            }, {
                selector: '#' + this._terms.advancedListId(),
                event: this._terms.selectionChangedEvent(),
                object: this,
                method: 'readjustSize'
            });

            get(CriteriaProductCategories.prototype.__proto__ || Object.getPrototypeOf(CriteriaProductCategories.prototype), 'init', this).call(this);
        }
    }, {
        key: 'getCurrency',
        value: function getCurrency(currencyText) {
            if (!this._currencies) {
                return decomGiftable.screen.data.currency || false;
            }

            var currenciesLength = this._currencies.length;
            var newCurrency = false;

            for (var i = 0; i < currenciesLength; i++) {
                if (this._currencies[i].text === currencyText) {
                    newCurrency = this._currencies[i];
                    break;
                }
            }

            // set default currency if not within the currently enabled currencies
            if (!newCurrency) {
                newCurrency = decomGiftable.screen.data.currency;
            }

            return newCurrency;
        }
    }, {
        key: 'getDefaultCurrency',
        value: function getDefaultCurrency() {
            return this._currencies && this._currencies.length ? this._currencies[0] : decomGiftable.screen.data.currency;
        }
    }, {
        key: 'changeCurrency',
        value: function changeCurrency() {
            if (!this._$currencySelect) {
                this._$currencySelect = jQuery(document.getElementById(this._currencySelectId));
            }

            var newCurrency = this.getCurrency(this._$currencySelect.val());

            // change currency only if different
            if (newCurrency && newCurrency.text !== this._currency.text) {
                this._currency = newCurrency;
                this._terms.changeCurrencyTo(this._currency);
            }
        }
    }]);
    return CriteriaProductCategories;
}(Criteria);

var MetaUsers = function (_Meta) {
    inherits(MetaUsers, _Meta);

    function MetaUsers() {
        classCallCheck(this, MetaUsers);
        return possibleConstructorReturn(this, (MetaUsers.__proto__ || Object.getPrototypeOf(MetaUsers)).apply(this, arguments));
    }

    createClass(MetaUsers, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._label = this._options.label;
            this._inputElementId = 'dgfw_criteria_users_' + this._id;
            this._containerId = 'dgfw_critera_users_select_' + this._id;
            this._selectedListId = 'dgfw_criteria_users_' + this._id + '_selected_list';

            this._navPrevId = 'dgfw_criteria_users_select_nav_prev_' + this._id;
            this._navNextId = 'dgfw_criteria_users_select_nav_next_' + this._id;
            this._statusCurrentPageId = 'dgfw_criteria_users_select_nav_status_current_' + this._id;
            this._statusTotalPagesId = 'dgfw_criteria_users_select_nav_status_total_' + this._id;

            this._value = new Object();

            if (this._options.value) {
                this._options.value.split(',').forEach(function (userId) {
                    if (parseInt(userId)) {
                        _this2._value[userId] = userId;
                    }
                });
            }

            this._currentPage = 0;
            this._totalUsers = 0;
            this._totalPages = 1;
            this._usersPerPage = 5;
            var userElements = new Array();

            if (decomGiftable.screen.data.users) {
                this._totalUsers = decomGiftable.screen.data.users.length;
                this._totalPages = Math.ceil(this._totalUsers / this._usersPerPage);
                decomGiftable.screen.data.users.forEach(function (user, index, collection) {
                    userElements[Math.floor(index / _this2._usersPerPage)] = userElements[Math.floor(index / _this2._usersPerPage)] || new Array();
                    userElements[Math.floor(index / _this2._usersPerPage)].push(_this2.userElement(user));
                });
            }

            var userPages = new Array();

            userElements.forEach(function (userPage, index, collection) {
                userPages[index] = {
                    tag: 'div',
                    id: _this2._containerId + '_page_' + index,
                    classes: ['dgfw-select-users-container-page', 'page-' + index, index === 0 ? 'page-current' : ''],
                    children: userPage
                };
            });

            var selectedUsersElement = {
                tag: 'div',
                id: this._selectedListId,
                classes: ['dgfw-selected-users'],
                children: []
            };

            if (Object.keys(this._value).length) {
                for (var selectedUserId in this._value) {
                    var selectedUser = this.user(parseInt(selectedUserId));
                    if (this._value[selectedUserId] && selectedUser) {
                        selectedUsersElement.children.push(this.selectedUserElement(selectedUser, false));
                    }
                }
            } else {
                selectedUsersElement.classes.push('invisible');
            }

            this._elements = [selectedUsersElement, {
                tag: 'div',
                id: this._containerId,
                classes: ['dgfw-select-wrapper', 'dgfw-select-users', 'current-page-0'],
                children: userPages
            }, {
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-users'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'hidden',
                    value: Object.keys(this._value).join(',')
                }
            }];

            if (this._totalPages > 1) {
                this._elements.splice(1, 0, {
                    tag: 'div',
                    id: 'dgfw_criteria_users_select_nav_' + this._id,
                    classes: ['dgfw-select-users-nav'],
                    children: [{
                        tag: 'button',
                        id: this._navPrevId,
                        classes: ['dgfw-select-users-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-left']
                    }, {
                        tag: 'span',
                        id: 'dgfw_criteria_select_nav_status_' + this._id,
                        classes: ['dgfw-select-users-nav-status'],
                        children: [{
                            tag: 'span',
                            id: '',
                            classes: [],
                            text: Translate.text('Page ')
                        }, {
                            tag: 'span',
                            id: this._statusCurrentPageId,
                            classes: ['dgfw-select-users-nav-status-number'],
                            text: this._currentPage + 1
                        }, {
                            tag: 'span',
                            id: '',
                            classes: [],
                            text: Translate.text(' of ')
                        }, {
                            tag: 'span',
                            id: this._statusTotalPagesId,
                            classes: ['dgfw-select-users-nav-status-number'],
                            text: this._totalPages
                        }]
                    }, {
                        tag: 'button',
                        id: this._navNextId,
                        classes: ['dgfw-select-users-nav-prev', 'button', 'dgfw-button-secondary', 'dashicons-before', 'dashicons-arrow-right']
                    }]
                });
            }

            this._bindings.push({
                selector: '#' + this._containerId,
                event: 'mouseover',
                object: this,
                method: 'loadNextPage'
            }, {
                selector: '#' + this._navPrevId,
                event: 'click',
                object: this,
                method: 'previousPage'
            }, {
                selector: '#' + this._navNextId,
                event: 'click',
                object: this,
                method: 'nextPage'
            }, {
                selector: '.dgfw-users-select-user',
                event: 'click',
                object: this,
                method: 'toggleSelectUser'
            }, {
                selector: '.dgfw-users-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedUser'
            });

            get(MetaUsers.prototype.__proto__ || Object.getPrototypeOf(MetaUsers.prototype), 'init', this).call(this);
        }
    }, {
        key: 'hookElements',
        value: function hookElements() {
            get(MetaUsers.prototype.__proto__ || Object.getPrototypeOf(MetaUsers.prototype), 'hookElements', this).call(this);
            this._$containerElement = this._$containerElement || jQuery(document.getElementById(this._containerId));
            this._$selectedListElement = this._$selectedListElement || jQuery(document.getElementById(this._selectedListId));
            this._$currentPageStatus = this._$currentPageStatus || jQuery(document.getElementById(this._statusCurrentPageId));
        }
    }, {
        key: 'containerId',
        value: function containerId() {
            return this._containerId;
        }
    }, {
        key: 'loadNextPage',
        value: function loadNextPage() {
            this.hookElements();
            Debug.info('Loading more users...');
        }
    }, {
        key: 'userElement',
        value: function userElement(user) {
            var userClasses = ['dgfw-users-select-user'];

            if (this._value[user.id]) {
                userClasses.push('selected');
            }

            return {
                tag: 'div',
                id: 'dgfw_criteria_users_' + this._id + '_user_' + user.id,
                classes: userClasses,
                attributes: {
                    'data-decom-id': user.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-users-select-user-name'],
                    text: user.displayName.length < 30 ? user.displayName : user.displayName.slice(0, 30) + '…'
                }, {
                    tag: 'div',
                    classes: ['dgfw-users-select-user-img'],
                    attributes: {
                        style: 'background-image: url(' + user.img + ');'
                    }
                }]
            };
        }
    }, {
        key: 'selectedUserElement',
        value: function selectedUserElement(user) {
            var invisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var selectedClasses = ['dgfw-users-selected-user'];

            if (invisible) {
                selectedClasses.push('invisible');
            }

            return {
                tag: 'div',
                id: 'dgfw_criteria_users_' + this._id + '_selected_' + user.id,
                classes: selectedClasses,
                attributes: {
                    'data-decom-id': user.id
                },
                children: [{
                    tag: 'h4',
                    classes: ['dgfw-users-select-user-name'],
                    text: user.displayName.length < 30 ? user.displayName : user.displayName.slice(0, 30) + '…'
                }, {
                    tag: 'div',
                    classes: ['dgfw-users-select-user-img'],
                    attributes: {
                        style: 'background-image: url(' + user.img + ');'
                    }
                }, {
                    tag: 'span',
                    id: 'dgfw_criteria_users_selected_remove_' + user.id,
                    classes: ['dgfw-users-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': user.id
                    }
                }]
            };
        }
    }, {
        key: 'toggleSelectUser',
        value: function toggleSelectUser(event) {
            this.hookElements();
            var $user = jQuery(event.currentTarget);
            var userId = parseInt($user.data('decom-id'));
            $user.toggleClass('selected');
            if (this._value[userId]) {
                delete this._value[userId];
                this.removeFromList(userId);
            } else {
                this._value[userId] = userId;
                this.addToList(userId);
            }
            this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
        }
    }, {
        key: 'removeSelectedUser',
        value: function removeSelectedUser(event) {
            this.hookElements();
            var $user = jQuery(event.currentTarget);
            var userId = parseInt($user.data('decom-id'));
            $user = jQuery('#dgfw_criteria_users_' + this._id + '_user_' + userId);
            $user.removeClass('selected');
            if (this._value[userId]) {
                delete this._value[userId];
                this.removeFromList(userId);
            }
            this._$inputElement.val(Object.getOwnPropertyNames(this._value).join(','));
        }
    }, {
        key: 'addToList',
        value: function addToList(userId) {
            var _this3 = this;

            var user = this.user(userId);
            this.createAndAppendChild(this._$selectedListElement, this.selectedUserElement(user));
            setTimeout(function () {
                _this3._$selectedListElement.removeClass('invisible');
                _this3.$userElement(userId).removeClass('invisible');
                setTimeout(function () {
                    _this3.selectionChanged();
                }, 300);
            }, 50);
        }
    }, {
        key: 'removeFromList',
        value: function removeFromList(userId) {
            var _this4 = this;

            var $user = this.$userElement(userId);
            $user.addClass('invisible');
            setTimeout(function () {
                if (Object.keys(_this4._value).length === 0) {
                    _this4._$selectedListElement.addClass('invisible');
                }
                $user.remove();
                setTimeout(function () {
                    _this4.selectionChanged();
                }, 300);
            }, 50);
        }
    }, {
        key: 'selectionChangedEvent',
        value: function selectionChangedEvent() {
            return 'DGFW.SelectionChanged_' + this._id;
        }
    }, {
        key: 'selectionChanged',
        value: function selectionChanged() {
            this._$inputElement.trigger(this.selectionChangedEvent());
        }
    }, {
        key: 'user',
        value: function user(userId) {
            var user = false;

            decomGiftable.screen.data.users.forEach(function (userData, index, users) {
                if (userData.id === userId) {
                    user = userData;
                }
            });

            return user;
        }
    }, {
        key: '$userElement',
        value: function $userElement(userId) {
            return jQuery(document.getElementById('dgfw_criteria_users_' + this._id + '_selected_' + userId));
        }
    }, {
        key: 'createAndAppendChild',
        value: function createAndAppendChild($parentElement, childData) {
            var _this5 = this;

            var $el = jQuery(document.createElement(childData.tag));
            $el.attr('id', childData.id);
            if (childData.classes) {
                $el.addClass(childData.classes.join(' '));
            }
            if (childData.attributes) {
                for (var attr in childData.attributes) {
                    $el.attr(attr, childData.attributes[attr]);
                }
            }
            if (childData.text) {
                $el.text(childData.text);
            }
            $parentElement.append($el);
            if (childData.children) {
                childData.children.forEach(function (elementData, index, collection) {
                    _this5.createAndAppendChild($el, elementData);
                });
            }
            return $el;
        }
    }, {
        key: 'previousPage',
        value: function previousPage() {
            this.hookElements();
            this._currentPage -= this._currentPage > 0 ? 1 : 0;
            this._$containerElement.find('.page-' + (this._currentPage + 1)).removeClass('page-current');
            this._$containerElement.find('.page-' + this._currentPage).removeClass('page-prev').addClass('page-current');
            this.updateCurrentPageStatus();
        }
    }, {
        key: 'nextPage',
        value: function nextPage() {
            this.hookElements();
            this._currentPage += this._currentPage < this._totalPages - 1 ? 1 : 0;
            this._$containerElement.find('.page-' + (this._currentPage - 1)).removeClass('page-current').addClass('page-prev');
            this._$containerElement.find('.page-' + this._currentPage).addClass('page-current');
            this.updateCurrentPageStatus();
        }
    }, {
        key: 'updateCurrentPageStatus',
        value: function updateCurrentPageStatus() {
            this.hookElements();
            this._$currentPageStatus.text(this._currentPage + 1);
        }
    }]);
    return MetaUsers;
}(Meta);

var CriteriaUsers = function (_Criteria) {
    inherits(CriteriaUsers, _Criteria);

    function CriteriaUsers() {
        classCallCheck(this, CriteriaUsers);
        return possibleConstructorReturn(this, (CriteriaUsers.__proto__ || Object.getPrototypeOf(CriteriaUsers)).apply(this, arguments));
    }

    createClass(CriteriaUsers, [{
        key: 'init',
        value: function init() {
            this._type = 'users';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._users = new MetaUsers(this._id + '-users', { label: Translate.text('Users'), value: this._conditions.users ? this._conditions.users.value : false });

            this._steps = new Array();

            var userElements = this._users.elements();

            this._steps[0] = {
                description: Translate.text('Select users this gift category applies for.'),
                help: Translate.text('This condition will be met if the customer is logged in as any of the selected users below.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_users_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: userElements
                }]
            };

            this.showCriteria();

            this._bindings = this._bindings.concat(this._users.bindings());

            this._bindings.push({
                selector: '#' + this._users.elementId(),
                event: this._users.selectionChangedEvent(),
                object: this,
                method: 'readjustSize'
            });

            get(CriteriaUsers.prototype.__proto__ || Object.getPrototypeOf(CriteriaUsers.prototype), 'init', this).call(this);
        }
    }]);
    return CriteriaUsers;
}(Criteria);

var MetaRoles = function (_Meta) {
    inherits(MetaRoles, _Meta);

    function MetaRoles() {
        classCallCheck(this, MetaRoles);
        return possibleConstructorReturn(this, (MetaRoles.__proto__ || Object.getPrototypeOf(MetaRoles)).apply(this, arguments));
    }

    createClass(MetaRoles, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            this._label = this._options.label;
            this._inputElementId = 'dgfw_criteria_roles_' + this._id;
            this._inputElementName = 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]';

            this._value = this._options.value || new Array();

            var roleElements = new Array();

            if (decomGiftable.screen.data.roles) {
                decomGiftable.screen.data.roles.forEach(function (role, index, collection) {
                    roleElements.push(_this2.roleElement(role));
                });
            }

            this._elements = [{
                tag: 'div',
                id: 'dgfw_select_roles_' + this._id,
                classes: ['dgfw-checkbox-group-wrapper'],
                children: roleElements
            }];

            get(MetaRoles.prototype.__proto__ || Object.getPrototypeOf(MetaRoles.prototype), 'init', this).call(this);
        }
    }, {
        key: 'roleElement',
        value: function roleElement(role) {
            var checkBoxAttributes = {
                type: 'checkbox',
                name: this._inputElementName + '[]',
                value: role.name
            };

            this._value.forEach(function (roleName, index, collection) {
                if (roleName === role.name) {
                    checkBoxAttributes.checked = 'checked';
                }
            });

            return {
                tag: 'div',
                id: 'dgfw_criteria_roles_' + this._id + '_role_' + role.name,
                classes: ['dgfw-roles-select'],
                attributes: {
                    'data-decom-id': role.name
                },
                children: [{
                    tag: 'input',
                    id: 'dgfw_roles_select_' + this._id + '_checkbox_' + role.name,
                    classes: ['dgfw-roles-select-checkbox'],
                    attributes: checkBoxAttributes
                }, {
                    tag: 'label',
                    classes: ['dgfw-roles-select-label'],
                    text: role.title,
                    attributes: {
                        for: 'dgfw_roles_select_' + this._id + '_checkbox_' + role.name
                    }
                }]
            };
        }
    }]);
    return MetaRoles;
}(Meta);

var CriteriaUserRoles = function (_Criteria) {
    inherits(CriteriaUserRoles, _Criteria);

    function CriteriaUserRoles() {
        classCallCheck(this, CriteriaUserRoles);
        return possibleConstructorReturn(this, (CriteriaUserRoles.__proto__ || Object.getPrototypeOf(CriteriaUserRoles)).apply(this, arguments));
    }

    createClass(CriteriaUserRoles, [{
        key: 'init',
        value: function init() {
            this._type = 'user_roles';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._roles = new MetaRoles(this._id + '-roles', { label: Translate.text('Roles'), value: this._conditions.roles ? this._conditions.roles.value : false });

            this._steps = new Array();

            this._steps[0] = {
                description: Translate.text('Select user roles this gift category applies for.'),
                help: Translate.text('This condition will be met if the customer is a logged in user and has one of the user roles selected below.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_roles_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._roles.elements()
                }]
            };

            this.showCriteria();

            this._bindings = this._bindings.concat(this._roles.bindings());

            get(CriteriaUserRoles.prototype.__proto__ || Object.getPrototypeOf(CriteriaUserRoles.prototype), 'init', this).call(this);
        }
    }]);
    return CriteriaUserRoles;
}(Criteria);

var MetaTime = function (_Meta) {
    inherits(MetaTime, _Meta);

    function MetaTime() {
        classCallCheck(this, MetaTime);
        return possibleConstructorReturn(this, (MetaTime.__proto__ || Object.getPrototypeOf(MetaTime)).apply(this, arguments));
    }

    createClass(MetaTime, [{
        key: 'init',
        value: function init() {
            this._label = this._options.label;
            this._dateInputElementId = 'dgfw_criteria_date_' + this._id;
            this._timeInputElementId = 'dgfw_criteria_time_' + this._id;
            this._value = new Object();

            if (this._options.value) {
                this._value = this._options.value;
            } else {
                var today = new Date();
                var todayParts = new Object();
                todayParts.dd = today.getDate();
                todayParts.mm = today.getMonth() + 1; //January is 0!
                todayParts.yyyy = today.getFullYear();
                todayParts.hh = today.getHours();
                todayParts.ii = today.getMinutes();

                for (var dateSegment in todayParts) {
                    if (todayParts[dateSegment] < 10) {
                        todayParts[dateSegment] = '0' + todayParts[dateSegment];
                    }
                }

                this._value.date = todayParts.yyyy + '-' + todayParts.mm + '-' + todayParts.dd;
                this._value.time = todayParts.hh + ':' + todayParts.ii;
            }

            this._elements = [{
                tag: 'label',
                id: 'dgfw_criteria_date_label_' + this._id,
                classes: ['dgfw-label-date'],
                text: this._label,
                attributes: {
                    for: this._dateInputElementId
                }
            }, {
                tag: 'input',
                id: this._dateInputElementId,
                classes: ['dgfw-date'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][date]',
                    type: 'date',
                    value: this._value.date
                }
            }, {
                tag: 'label',
                id: 'dgfw_criteria_time_label_' + this._id,
                classes: ['dgfw-label-time'],
                text: Translate.text(' at '),
                attributes: {
                    for: this._timeInputElementId
                }
            }, {
                tag: 'input',
                id: this._timeInputElementId,
                classes: ['dgfw-time'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][time]',
                    type: 'time',
                    value: this._value.time
                }
            }];

            get(MetaTime.prototype.__proto__ || Object.getPrototypeOf(MetaTime.prototype), 'init', this).call(this);
        }
    }, {
        key: 'hookElements',
        value: function hookElements() {
            this._$dateInputElement = this._$dateInputElement || jQuery(document.getElementById(this._dateInputElementId));
            this._$timeInputElement = this._$timeInputElement || jQuery(document.getElementById(this._timeInputElementId));
        }
    }, {
        key: 'dateElementId',
        value: function dateElementId() {
            return this._dateInputElementId;
        }
    }, {
        key: 'timeElementId',
        value: function timeElementId() {
            return this._timeInputElementId;
        }
    }, {
        key: 'updateDate',
        value: function updateDate() {
            this.hookElements();
            this._value.date = this._$dateInputElement.val();
        }
    }, {
        key: 'updateTime',
        value: function updateTime() {
            this.hookElements();
            this._value.time = this._$timeInputElement.val();
        }
    }]);
    return MetaTime;
}(Meta);

var CriteriaPeriods = function (_Criteria) {
    inherits(CriteriaPeriods, _Criteria);

    function CriteriaPeriods() {
        classCallCheck(this, CriteriaPeriods);
        return possibleConstructorReturn(this, (CriteriaPeriods.__proto__ || Object.getPrototypeOf(CriteriaPeriods)).apply(this, arguments));
    }

    createClass(CriteriaPeriods, [{
        key: 'init',
        value: function init() {
            this._type = 'periods';

            if (this._sourceCriteria) {
                this.takeOverFromSource();
            }

            this._start = new MetaTime(this._id + '-start', { label: Translate.text('Start date'), value: this._conditions.start ? this._conditions.start.value : false });
            this._end = new MetaTime(this._id + '-end', { label: Translate.text('End date'), value: this._conditions.end ? this._conditions.end.value : false });

            this._steps = new Array();

            this._steps[0] = {
                description: Translate.text('Set start and end of this period.'),
                help: Translate.text('This condition will be met if the time of customer checkout is within the defined start/end time interval.'),
                elements: [{
                    tag: 'div',
                    id: 'dgfw_criteria_periods_start_container_' + this._id,
                    classes: ['dgfw-criteria-input-container', 'dgfw-criteria-period-container'],
                    children: this._start.elements()
                }, {
                    tag: 'div',
                    id: 'dgfw_criteria_periods_end_container_' + this._id,
                    classes: ['dgfw-criteria-input-container', 'dgfw-criteria-period-container'],
                    children: this._end.elements()
                }]
            };

            this.showCriteria();

            this._bindings.push({
                selector: '#' + this._start.dateElementId(),
                event: 'focusout',
                object: this,
                method: 'updateStartDate'
            }, {
                selector: '#' + this._start.timeElementId(),
                event: 'focusout',
                object: this,
                method: 'updateStartTime'
            }, {
                selector: '#' + this._end.dateElementId(),
                event: 'focusout',
                object: this,
                method: 'updateEndDate'
            }, {
                selector: '#' + this._end.timeElementId(),
                event: 'focusout',
                object: this,
                method: 'updateEndTime'
            });

            get(CriteriaPeriods.prototype.__proto__ || Object.getPrototypeOf(CriteriaPeriods.prototype), 'init', this).call(this);
        }
    }, {
        key: 'updateStartDate',
        value: function updateStartDate() {
            this._start.updateDate();
        }
    }, {
        key: 'updateStartTime',
        value: function updateStartTime() {
            this._start.updateTime();
        }
    }, {
        key: 'updateEndDate',
        value: function updateEndDate() {
            this._end.updateDate();
        }
    }, {
        key: 'updateEndTime',
        value: function updateEndTime() {
            this._end.updateTime();
        }
    }]);
    return CriteriaPeriods;
}(Criteria);

var _criteria = new Map([['amounts', CriteriaAmounts], ['items', CriteriaItems], ['periods', CriteriaPeriods], ['products', CriteriaProducts], ['product_categories', CriteriaProductCategories], ['users', CriteriaUsers], ['user_roles', CriteriaUserRoles], ['default', CriteriaAmounts]]);

var CriteriaFactory = function () {
    function CriteriaFactory() {
        classCallCheck(this, CriteriaFactory);
    }

    createClass(CriteriaFactory, null, [{
        key: 'create',
        value: function create(id, criteria) {
            var conditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!_criteria.has(criteria)) {
                criteria = 'default';
            }
            return new (_criteria.get(criteria))(id, conditions);
        }
    }, {
        key: 'createAndScrollTo',
        value: function createAndScrollTo(id, criteria) {
            var conditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            conditions.scrollTo = true;
            return this.create(id, criteria, conditions);
        }
    }, {
        key: 'createFrom',
        value: function createFrom(existingCriteria, newType) {
            if (!_criteria.has(newType)) {
                newType = 'default';
            }
            return new (_criteria.get(newType))(existingCriteria.id(), existingCriteria.conditions(), existingCriteria);
        }
    }]);
    return CriteriaFactory;
}();

var Category = function () {
    function Category(categoryData) {
        var criteriaData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        classCallCheck(this, Category);


        this._id = categoryData.id;
        this._name = categoryData.name;
        this._bound = new Array();

        this._$element = jQuery(document.getElementById(categoryData.elementId));
        this._$description = jQuery(document.getElementById(categoryData.descriptionId));
        this._$addButton = jQuery(document.getElementById(categoryData.addButtonId));

        this._criteria = new Map();

        if (criteriaData) {
            var criteria = CriteriaFactory.create(criteriaData.id, criteriaData.type, criteriaData);
            this._criteria.set(this._criteria.size.toString(), criteria);

            jQuery("#dgfw-loading").fadeOut();
            this.updateDescription();
            this.appendCriteriaElement(criteria.element());
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeCriteria'));
        }
    }

    createClass(Category, [{
        key: 'addCriteria',
        value: function addCriteria() {
            var criteria = new CriteriaAmounts(this._criteria.size, { scrollTo: true });
            this._criteria.set(this._criteria.size.toString(), criteria);
            this.updateDescription();
            this._$addButton.hide();
            this.appendCriteriaElement(criteria.element());
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeCriteria'));
        }
    }, {
        key: 'removeCriteria',
        value: function removeCriteria(event, criteriaId) {
            var criteria = this._criteria.get(criteriaId);
            this._criteria.delete(criteriaId);
            criteria.removeElement();
            this.unbindSelector(criteria.elementSelector());
            this.updateDescription();
            this._$addButton.show();
        }
    }, {
        key: 'updateDescription',
        value: function updateDescription() {
            var newDescription = '';
            // this._criteria.forEach((criteria, index, collection) => {
            //     newDescription += criteria.description() + ' ';
            // });
            this._$description.text(newDescription);
        }
    }, {
        key: 'appendCriteriaElement',
        value: function appendCriteriaElement($element) {
            this._$description.after($element);
        }
    }, {
        key: 'changeCriteriaType',
        value: function changeCriteriaType(event, criteriaId, newType) {
            var newCriteria = new CriteriaFactory.createFrom(this._criteria.get(criteriaId), newType);
            this._criteria.set(criteriaId, newCriteria);
        }
    }, {
        key: 'unbindSelector',
        value: function unbindSelector(selector) {
            var newBound = new Array();
            this._bound.forEach(function (boundElement, index) {
                if (boundElement.selector() === selector) {
                    boundElement.unbind();
                } else {
                    newBound.push(boundElement);
                }
            });
            this._bound = newBound;
        }
    }]);
    return Category;
}();

var ScreenEditCategory = function (_Screen) {
    inherits(ScreenEditCategory, _Screen);

    function ScreenEditCategory() {
        classCallCheck(this, ScreenEditCategory);
        return possibleConstructorReturn(this, (ScreenEditCategory.__proto__ || Object.getPrototypeOf(ScreenEditCategory)).apply(this, arguments));
    }

    createClass(ScreenEditCategory, [{
        key: 'init',
        value: function init() {
            this._category = new Category(this._data.category, this._data.criteria);

            this._bindings.push({
                selector: '#dgfw_add_criteria',
                event: 'click',
                object: this,
                method: 'addCriteria'
            });

            get(ScreenEditCategory.prototype.__proto__ || Object.getPrototypeOf(ScreenEditCategory.prototype), 'init', this).call(this);
        }
    }, {
        key: 'addCriteria',
        value: function addCriteria() {
            this._category.addCriteria();
        }
    }]);
    return ScreenEditCategory;
}(Screen);

var ScreenEditProduct = function (_Screen) {
    inherits(ScreenEditProduct, _Screen);

    function ScreenEditProduct() {
        classCallCheck(this, ScreenEditProduct);
        return possibleConstructorReturn(this, (ScreenEditProduct.__proto__ || Object.getPrototypeOf(ScreenEditProduct)).apply(this, arguments));
    }

    createClass(ScreenEditProduct, [{
        key: 'init',
        value: function init() {
            this._giftableOptionId = '_dgfw_giftable';
            this._productTypeSelectId = 'product-type';
            this._hasGiftableVariationsId = '_dgfw_has_giftable_variations';

            this._$giftableOption = jQuery(document.getElementById(this._giftableOptionId));
            this._$producTypeSelect = jQuery(document.getElementById(this._productTypeSelectId));
            this._$hasGiftableVariations = jQuery(document.getElementById(this._hasGiftableVariationsId));

            this._bindings.push({
                selector: '#' + this._giftableOptionId,
                event: 'change',
                object: this,
                method: 'toggleGiftable'
            }, {
                selector: '#' + this._productTypeSelectId,
                event: 'change',
                object: this,
                method: 'productTypeChange'
            }, {
                selector: '#_virtual, #_downloadable',
                event: 'change',
                object: this,
                method: 'productTypeChange'
            }, {
                selector: 'input.variable_is_giftable',
                event: 'change',
                object: this,
                method: 'toggleGiftable'
            }, {
                selector: '#woocommerce-product-data',
                event: 'woocommerce_variations_loaded',
                object: this,
                method: 'toggleGiftable'
            });

            get(ScreenEditProduct.prototype.__proto__ || Object.getPrototypeOf(ScreenEditProduct.prototype), 'init', this).call(this);
        }
    }, {
        key: 'toggleGiftable',
        value: function toggleGiftable() {
            var show, hide;
            var $giftableOptions,
                haveGiftableVariations = false;

            $giftableOptions = jQuery('input.variable_is_giftable');

            for (var i = 0; i < $giftableOptions.length; i++) {
                var $giftableOption = jQuery($giftableOptions[i]);
                var $giftableLabel = $giftableOption.closest('.woocommerce_variation').find('.dgfw_giftable_label');
                if ($giftableOption.prop('checked')) {
                    haveGiftableVariations = true;
                    this._$hasGiftableVariations.val('yes');

                    // add giftable label (if it's not there already)
                    if (!$giftableLabel.length) {
                        $giftableOption.closest('.woocommerce_variation').find('h3').append(this.giftableVariationLabel());
                    }
                } else {
                    $giftableLabel.remove();
                }
            }

            if ($giftableOptions.length && !haveGiftableVariations) {
                this._$hasGiftableVariations.val('no');
            }

            // show gift options if product giftable option is checked
            // or at least one variation is marked as giftable (if any)
            if (this._$giftableOption.prop('checked') || $giftableOptions.length && haveGiftableVariations || this._$hasGiftableVariations.val() === 'yes') {
                show = 'show_if';
                hide = 'hide_if';
            } else {
                show = 'hide_if';
                hide = 'show_if';
            }

            jQuery(document.getElementsByClassName(show + this._giftableOptionId)).show();
            jQuery(document.getElementsByClassName(hide + this._giftableOptionId)).hide();

            // show the notice if product is not giftable but has giftable variations
            if (!this._$giftableOption.prop('checked') && this._$hasGiftableVariations.val() === 'yes') {
                jQuery(document.getElementsByClassName('show_if_has_giftable_variations_only')).show();
            } else {
                jQuery(document.getElementsByClassName('show_if_has_giftable_variations_only')).hide();
            }
        }
    }, {
        key: 'productTypeChange',
        value: function productTypeChange() {
            if (this._$giftableOption.is(':visible')) {
                this.toggleGiftable();
            }
        }
    }, {
        key: 'giftableVariationLabel',
        value: function giftableVariationLabel() {
            return '<strong class="dgfw_giftable_label">(' + Translate.text('Giftable') + ')</strong>';
        }
    }]);
    return ScreenEditProduct;
}(Screen);

var _screens = new Map([['edit-category', ScreenEditCategory], ['edit-product', ScreenEditProduct]]);

var ScreenFactory = function () {
    function ScreenFactory() {
        classCallCheck(this, ScreenFactory);
    }

    createClass(ScreenFactory, null, [{
        key: 'create',
        value: function create(screen) {

            if (_screens.has(screen.name)) {
                return new (_screens.get(screen.name))(screen.data);
            }
        }
    }]);
    return ScreenFactory;
}();

var Admin = function () {
    function Admin() {
        classCallCheck(this, Admin);

        if (decomGiftable && decomGiftable.screen) {
            this._screen = ScreenFactory.create(decomGiftable.screen);

            this.init();
        }
    }

    createClass(Admin, [{
        key: 'init',
        value: function init() {
            Debug.info('Giftable for WooCommerce initialized.');
        }
    }]);
    return Admin;
}();

/*!
 *
 * Decom Gifts for WooCommerce
 *
 * Admin js
 *
 */

new Admin();

}());
