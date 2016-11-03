import BoundElement from './BoundElement.js';
import CriteriaFactory from './CriteriaFactory.js';
import $ from '../jquery.js';
import Debug from './Debug.js';
import Translate from './Translate.js';

export default class Criteria {

    constructor(id, conditions = {}, sourceCriteria = false) {
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
            classes: ['dgfw-criteria'],
        };
        this._descriptionData = {
            tag: 'div',
            id: 'dgfw_criteria_description_' + this._id,
            classes: ['dgfw-criteria-description']
        };

        this._types = new Map([
            ['amounts', Translate.text('Amounts')],
            ['items', Translate.text('Items')],
            ['products', Translate.text('Products')],
            ['product_categories', Translate.text('Product Categories')],
            ['periods', Translate.text('Time Period')],
            ['users', Translate.text('Users')],
            ['user_roles', Translate.text('User Roles')],
            // ['countries', 'Countries'],
        ]);

        this._chooseTypeData = {
            tag: 'div',
            id: 'dgfw_choose_type_wrap_' + this._id,
            classes: ['dgfw-choose-type-container'],
            children: [
                {
                    tag: 'select',
                    id: this._selectTypeElementId,
                    classes: ['dgfw-select-type'],
                    attributes: {
                        name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][type]',
                    },
                    children: [],
                }
            ],
        };

        this._types.forEach((value, key, collection) => {
            var option = {
                tag: 'option',
                attributes: {
                    value: key,
                },
                text: value
            };

            if (this._type === key) {
                option.attributes.selected = 'selected';
            }

            this._chooseTypeData.children[0].children.push(option);
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
            children: [
                {
                    tag: 'button',
                    id: 'dgfw_prev_step_' + this._id,
                    classes: ['button', 'dgfw-button', 'dgfw-prev-step', 'dashicons-before', 'dashicons-arrow-left-alt'],
                    text: Translate.text('Back'),
                    attributes: {
                        disabled: 'disabled',
                    }
                },
                {
                    tag: 'button',
                    id: 'dgfw_next_step_' + this._id,
                    classes: ['button', 'dgfw-button', 'dgfw-next-step', 'dashicons-after', 'dashicons-arrow-right-alt'],
                    text: Translate.text('Next'),

                }
            ]
        };
        this._removeData = {
            tag: 'button',
            id: 'dgfw_criteria_remove_' + this._id,
            classes: ['dgfw-criteria-remove', 'dgfw-button', 'dashicons-before', 'dashicons-no'],
            text: Translate.text('Remove'),
        }
        var andButtonData = {
            tag: 'button',
            id: 'dgfw_add_and_' + this._id,
            classes: ['button', 'dgfw-button', 'dgfw-add-and', 'dashicons-before', 'dashicons-warning'],
            text: Translate.text('AND'),
        };
        var orButtonData = {
            tag: 'button',
            id: 'dgfw_add_or_' + this._id,
            classes: ['button', 'dgfw-button', 'dgfw-add-or', 'dashicons-before', 'dashicons-editor-help'],
            text: Translate.text('OR'),
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
                    style: 'display: none;',
                };
            } else {
                andButtonData.attributes = {
                    style: 'display: none;',
                };
            }
        } else if (this._conditions.subcriteria && this._conditions.subcriteria.length) {
            if (this._conditions.subcriteria[0].logic === 'OR') {
                andButtonData.attributes = {
                    style: 'display: none;',
                };
            } else {
                orButtonData.attributes = {
                    style: 'display: none;',
                };
            }
        }

        this._andOrData.children = [andButtonData, orButtonData];

        this._chooseTypeData.children.push(
            {
                method: 'chooseType',
                description: Translate.text('Choose condition type:'),
                elements: [
                    {
                        tag: 'select',
                        id: this._selectTypeElementId,
                        classes: ['dgfw-select-type'],
                        attributes: {
                            name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][type]',
                        },
                        children: []
                    }
                ],
            }
        );

        this._bindings = [
            {
                selector: '#dgfw_next_step_' + this._id,
                event: 'click',
                object: this,
                method: 'showNextStep'
            },
            {
                selector: '#dgfw_prev_step_' + this._id,
                event: 'click',
                object: this,
                method: 'showPrevStep'
            },
            {
                selector: '#dgfw_add_and_' + this._id,
                event: 'click',
                object: this,
                method: 'addSubcriteriaAnd'
            },
            {
                selector: '#dgfw_add_or_' + this._id,
                event: 'click',
                object: this,
                method: 'addSubcriteriaOr'
            },
            {
                selector: '#dgfw_criteria_remove_' + this._id,
                event: 'click',
                object: this,
                method: 'removeCriteria',
            },
            {
                selector: '#dgfw_criteria_remove_' + this._id,
                event: 'mouseover',
                object: this,
                method: 'addHighlight',
            },
            {
                selector: '#dgfw_criteria_remove_' + this._id,
                event: 'mouseout',
                object: this,
                method: 'removeHighlight',
            },
            {
                selector: '.dgfw-step-description.has-help',
                event: 'click',
                object: this,
                method: 'toggleStepHelp',
            },
        ];

        this.init();
    }

    init() {
        this.hideNavigation();
        this._lastStep = this._steps.length - 1;
        this._bindings.push(
            {
                selector: '#' + this._selectTypeElementId,
                event: 'change',
                object: this,
                method: 'changeType'
            }
        );
        this.bind();

        if (this._steps.length > 1) {
            this.showNavigation();
        }

        // this.currentStep();
    }


    takeOverFromSource() {
        this._currentStep = this._sourceCriteria._currentStep;
        this._subcriteria = this._sourceCriteria._subcriteria;
        this._subcriteriaLastIndex = this._sourceCriteria._subcriteriaLastIndex;
        this._logic = this._sourceCriteria._logic;
        this._checksOut = this._sourceCriteria._checksOut;
        this._$element = this._sourceCriteria._$element;
        this._$description = this._sourceCriteria._$description;
        this._$stepListContainer = this._sourceCriteria._$stepListContainer;
        this._sourceCriteria._$stepList.attr('id',  this._sourceCriteria._$stepList.attr('id') + '_old');
        this._$stepList = this.createAndAppendChild(this._$stepListContainer, this._stepListData);
        this._$navigation = this._sourceCriteria._$navigation;
        this._$andOr = this._sourceCriteria._$andOr;
        this._steps = this._sourceCriteria._steps;
        this._selectTypeElementId = this._sourceCriteria._selectTypeElementId;
        this._$selectTypeElement = this._sourceCriteria._$selectTypeElement;
        this._$removeButton = this._sourceCriteria._$removeButton;

        this._sourceCriteria._bound.forEach((boundElement, index, collection) => {
            boundElement.unbind();
        });

        this._subcriteria.forEach((subcriteria, subcriteriaId, map) => {
            this._bound.push(new BoundElement(this._$element, subcriteria.elementSelector(), subcriteria.changeTypeEvent(), this, 'changeCriteriaType'));
            this._bound.push(new BoundElement(this._$element, subcriteria.elementSelector(), subcriteria.removeEvent(), this, 'removeSubcriteria'));

        });

        this._currentStep = 0;
    }


    createElement() {
        this._$element = $(document.createElement(this._elementData.tag));
        this._$element.attr('id', this._elementData.id);
        this._$element.addClass(this._elementData.classes.join(' '));
        if (this._scrollTo) {
            this._$element.addClass('invisible');
        }
        if (this._elementData.children) {
            this._elementData.children.forEach((elementData, index, collection) => {
                this.createAndAppendChild(this._$element, elementData);
            });
        }
        this._$description = this.createAndAppendChild(this._$element, this._descriptionData);
        this.createAndAppendChild(this._$element, this._chooseTypeData);
        this._$stepListContainer = this.createAndAppendChild(this._$element, this._stepListContainerData)
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
            setTimeout(() => {
                this._$element.removeClass('invisible');
                var posi = this._$element.offset().top;
                $("html, body").animate({scrollTop: posi - 100}, 1000);
            }, 10);
        }
    }

    logicElement() {
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

    idElement() {
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

    createAndAppendChild($parentElement, childData) {
        var $el = $(document.createElement(childData.tag));
        $el.attr('id', childData.id);
        if (childData.classes) {
            $el.addClass(childData.classes.join(' '));
        }
        if (childData.attributes) {
            for (let attr in childData.attributes) {
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
            childData.children.forEach((elementData, index, collection) => {
                this.createAndAppendChild($el, elementData);
            });
        }
        return $el;
    }

    bind() {
        this._bindings.forEach((element, index, collection) => {
            this._bound.push(new BoundElement(this._$element, element.selector, element.event, element.object, element.method));
        });
    }

    incrementStep(steps = 1) {
        this._currentStep += steps;
        if (this._currentStep > this._lastStep) {
            this._currentStep = this._lastStep;
        }

        this._$stepList.find('.step-' + (this._currentStep - 1)).removeClass('step-current').addClass('step-prev');
        this._$stepList.find('.step-' + this._currentStep).addClass('step-current');
    }

    decrementStep(steps = 1) {
        this._currentStep -= steps;
        if (this._currentStep < 0) {
            this._currentStep = 0;
        }

        this._$stepList.find('.step-' + (this._currentStep + 1)).removeClass('step-current');
        this._$stepList.find('.step-' + this._currentStep).removeClass('step-prev').addClass('step-current');
    }

    showNextStep() {
        this.incrementStep();
        Debug.info('next, to step:' + this._currentStep);
        this.currentStep();
    }

    showPrevStep() {
        this.decrementStep();
        Debug.info('prev, to step:' + this._currentStep);
        this.currentStep();
    }

    currentStep() {
        this.readjustSize();

        if (this._steps.length > 1) {
            var prevStepDisabled = (this._currentStep === 0);
            this._$navigation.find('button.dgfw-prev-step').text(this.prevStepButtonText()).prop('disabled', prevStepDisabled);

            var nextStepDisabled = (this._currentStep === this._lastStep);
            this._$navigation.find('button.dgfw-next-step').text(this.nextStepButtonText()).prop('disabled', nextStepDisabled);
        }


        if (this._steps[this._currentStep].method) {
            this[this._steps[this._currentStep].method]();
        }
    }

    readjustSize() {
        this._$stepListContainer.height(this._$stepList.find('li.step-' + this._currentStep + ' > .dgfw-criteria-step-wrapper').height() + 70);
    }

    id() {
        return this._id;
    }

    element() {
        return this._$element;
    }

    conditions() {
        return this._conditions;
    }

    elementSelector() {
        return '#' + this._elementData.id;
    }

    changeTypeEvent() {
        return 'DGFW.CriteriaChangeType_' + this._id;
    }

    removeEvent() {
        return 'DGFW.CriteriaRemove_' + this._id;
    }

    setElementDescription(content) {
        this._$description.text(content);
    }

    description() {
        var description = this._logic ? Translate.text(this._logic) : '';
        description += ' ' + this.generateDescription();
        return description;
    }

    generateDescription() {
        return this._type;
    }

    addSubcriteriaAnd() {
        this.addSubcriteria('AND');
        this._$andOr.find('button.dgfw-add-or').hide();
    }

    addSubcriteriaOr() {
        this.addSubcriteria('OR');
        this._$andOr.find('button.dgfw-add-and').hide();
    }

    addSubcriteria(logic) {
        var subcriteriaId = this._id + '-subcriteria-' + this.newSubcriteriaIndex();
        var criteria = CriteriaFactory.createAndScrollTo(subcriteriaId, 'amounts', {logic: logic});
        this._subcriteria.set(subcriteriaId, criteria);
        if (this._$element.hasClass('first')) {
            this._$element.addClass(logic.toLowerCase());
        }
        this.appendSubcriteriaElement(criteria.element());
        this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
        this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeSubcriteria'));
    }

    newSubcriteriaIndex() {
        return ++this._subcriteriaLastIndex;
    }

    appendSubcriteriaElement(element) {
        this._$andOr.before(element);
    }

    chooseType() {
        Debug.info('choose type');
        Debug.log(this);
        this._$navigation.find('.dgfw-prev-step').attr('disabled', true);
    }

    changeType() {
        this._$selectTypeElement = this._$selectTypeElement || $(document.getElementById(this._selectTypeElementId));
        if (this._type !== this._$selectTypeElement.val()) {
            this._$element.trigger(this.changeTypeEvent(), [this._id.toString(), this._$selectTypeElement.val()]);
            Debug.info('change type to: ' + this._$selectTypeElement.val());
            Debug.log(this);
        }
        // this.showType();
    }

    changeCriteriaType(event, criteriaId, newType) {
        this._subcriteria.set(criteriaId,  new CriteriaFactory.createFrom(this._subcriteria.get(criteriaId), newType));
    }

    showType() {
        Debug.info('show type: ' + this._type);
        Debug.log(this);
    }

    stepElementsExist(index) {
        return this._sourceCriteria && this._sourceCriteria._steps[index] && this._sourceCriteria._steps[index].elements;
    }

    removeStepElements(stepIndex) {


        this._sourceCriteria._steps[stepIndex].elements.forEach((element, index, collection) => {
            Debug.info('Removed: ' + element.id);
            $(document.getElementById('dgfw_criteria_' + this._sourceCriteria.id() + '_step_' + stepIndex)).fadeOut().remove();


        });
    }

    showNavigation() {
        this._$navigation.removeClass('invisible').find('button').prop('disabled', false);

        var prevStepDisabled = (this._currentStep === 0);
        this._$navigation.find('button.dgfw-prev-step').text(this.prevStepButtonText()).prop('disabled', prevStepDisabled);

        var nextStepDisabled = (this._currentStep === this._lastStep);
        this._$navigation.find('button.dgfw-next-step').text(this.nextStepButtonText()).prop('disabled', nextStepDisabled);
    }

    hideNavigation() {
        this._$navigation.addClass('invisible').find('button').prop('disabled', true);
    }

    showCriteria() {
        if (!this._sourceCriteria) {
            this.createElement();
        }

        this._steps.forEach((step, index, collection) => {
            if (index < this._currentStep) {
                return;
            }

            if (step.help) {
                step.elements.unshift({
                    tag: 'div',
                    id: 'dgfw_criteria_' + this._id + '_step' + index + '_help',
                    classes: ['dgfw-step-help'],
                    html: step.help,
                });
            }

            if (step.description) {
                step.elements.unshift({
                    tag: 'h4',
                    id: 'dgfw_criteria_' + this._id + '_step_' + index + '_description',
                    classes: ['dgfw-step-description', (step.help ? 'has-help' : '')],
                    text: step.description
                });
            }

            this.createAndAppendChild(this._$stepList, {
                tag: 'li',
                id: 'dgfw_criteria_' + this._id + '_step_' + index,
                classes: ['dgfw-criteria-step', 'step-' + index, (index === 0 ? 'step-current' : '')],
                children: [
                    {
                        tag: 'div',
                        id: 'dgfw_criteria_' + this._id + '_step_wrapper' + index,
                        classes: ['dgfw-criteria-step-wrapper'],
                        children: step.elements,
                    },
                ],
            });
        });

        if (this._sourceCriteria) {
            var sourceCriteria = this._sourceCriteria;
            var newCriteria = this;
            setTimeout(function() {
                newCriteria._$stepListContainer.height(newCriteria._$stepList.find('li.step-0 > .dgfw-criteria-step-wrapper').height() + 60);
                newCriteria._$stepListContainer.addClass('transition');
                setTimeout(function() {
                    sourceCriteria._$stepList.remove();
                    newCriteria._$stepListContainer.removeClass('transition');
                    // dereference for garbage collection, but leave a bool flag
                    newCriteria._sourceCriteria = true;
                }, 800);
            }, 100);
        } else {
            setTimeout(() => {
                this.readjustSize();
            }, 10);
        }

        if (this._conditions.subcriteria) {
            this._conditions.subcriteria.forEach((subcriteriaData, index, collection) => {
                var subcriteria = new CriteriaFactory.create(subcriteriaData.id, subcriteriaData.type, subcriteriaData);
                this._subcriteria.set(subcriteriaData.id, subcriteria);
                if (this._$element.hasClass('first')) {
                    this._$element.addClass(subcriteriaData.logic.toLowerCase());
                }
                this.appendSubcriteriaElement(subcriteria.element());
                this._bound.push(new BoundElement(this._$element, subcriteria.elementSelector(), subcriteria.changeTypeEvent(), this, 'changeCriteriaType'));
                this._bound.push(new BoundElement(this._$element, subcriteria.elementSelector(), subcriteria.removeEvent(), this, 'removeSubcriteria'));
            });
            // unset subcriteria data after initialization
            this._conditions.subcriteria = undefined;
        }


    }

    removeElement() {
        this._$element.css({height: this._$element.height()});
        this._$element.slideUp(350, () => {
            this._$element.remove();
        });
    }

    removeCriteria() {
        if (confirm(Translate.text('Are you sure you want do remove this condition and all its child conditions?'))) {
            this._$element.animate({opacity: 0}, 350, () => {
                this._$element.trigger(this.removeEvent(), [this._id.toString()]);
            });

        }
    }

    addHighlight() {
        this._$element.addClass('highlight');
    }

    removeHighlight() {
        this._$element.removeClass('highlight');
    }

    removeSubcriteria(event, subcriteriaId) {
        var criteria = this._subcriteria.get(subcriteriaId);
        this._subcriteria.delete(subcriteriaId);
        criteria.removeElement();
        this.unbindSelector(criteria.elementSelector());

        if (this._$element.hasClass('first') && !this._subcriteria.size) {
            this._$element.removeClass('and or');
            this._$andOr.find('button').show();
        }
    }

    unbindSelector(selector) {
        var newBound = new Array();
        this._bound.forEach((boundElement, index) => {
            if (boundElement.selector() === selector) {
                boundElement.unbind();
            } else {
                newBound.push(boundElement);
            }
        });
        this._bound = newBound;
    }

    prevStepButtonText() {
        var prevStep;
        prevStep = this._currentStep > 0 ? this._currentStep - 1 : this._currentStep;
        return this._steps[prevStep].stepName || Translate.text('Back');
    }

    nextStepButtonText() {
        var nextStep;
        nextStep = this._currentStep < this._lastStep ? this._currentStep + 1 : this._currentStep;
        return this._steps[nextStep].stepName || Translate.text('Next');
    }

    toggleStepHelp(event) {
        var $stepDescription = $(event.currentTarget);
        var $stepHelp = $stepDescription.siblings('.dgfw-step-help');

        if ($stepHelp.is(':visible')) {
            $stepHelp.slideUp(185);
        } else {
            $stepHelp.slideDown(185);
        }

        setTimeout(() => {
            this.readjustSize();
        }, 185);
    }
}