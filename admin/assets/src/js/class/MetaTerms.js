import Meta from './Meta.js';
import MetaCurrency from './MetaCurrency.js';
import MetaQuantity from './MetaQuantity.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class MetaTerms extends Meta {


    init() {
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
            decomGiftable.screen.data.productCategories.forEach((term, index, collection) => {
                termElements.push(this.termElement(term));
            });
        }

        this._elements = [
            {
                tag: 'div',
                id: 'dgfw_select_terms_' + this._id,
                classes: ['dgfw-checkbox-group-wrapper'],
                children: termElements,
            },
            {
                tag: 'input',
                id: this._inputElementId + '_taxonomy',
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][taxonomy]',
                    type: 'hidden',
                    value: this._taxonomy,
                },
            },
        ];


        if (this._value.length) {
            this._value.forEach((selectedTermId, index) => {
                let selectedTerm = this.productCategory(parseInt(selectedTermId));
                if (selectedTerm) {
                    advancedElement.children.push(this.advancedProductCategoryElement(selectedTerm,selectedTermId));
                }
            });
        }

        this._advancedElements = [
            {
                tag: 'div',
                id: this._advancedContainerId,
                classes: ['dgfw-advanced-wrapper'],
                children: [advancedElement],
            }
        ];

        this._bindings.push(
            {
                selector: '.dgfw-terms-select-checkbox',
                event: 'change',
                object: this,
                method: 'toggleSelectTerm',
            },
            {
                selector: '.dgfw-posts-selected-remove',
                event: 'click',
                object: this,
                method: 'removeSelectedTerm',
            }
        );


        super.init();

    }

    advancedListId() {
        return this._advancedListId;
    }

    hookElements() {
        super.hookElements();

        this._$advancedListElement = this._$advancedListElement || $(document.getElementById(this._advancedListId));
    }


    termElement(term) {
        var checkBoxAttributes = {
            type: 'checkbox',
            name: this._inputElementName + '[]',
            value: term.id,
        };

        this._value.forEach((termId, index, collection) => {
            if (parseInt(termId) === term.id) {
                checkBoxAttributes.checked = 'checked';
            }
        });
        return {
            tag: 'div',
            id: 'dgfw_criteria_terms_' + this._id + '_term_' + term.id,
            classes: ['dgfw-terms-select'],
            attributes: {
                'data-decom-id': term.id,
            },
            children: [
                {
                    tag: 'input',
                    id: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id,
                    classes: ['dgfw-terms-select-checkbox'],
                    attributes: checkBoxAttributes,
                },
                {
                    tag: 'label',
                    classes: ['dgfw-terms-select-label'],
                    text: term.title,
                    attributes: {
                        for: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id,
                    }
                },
            ],
        };
    }

    productCategory(termId) {
        var productCategory = false;

        decomGiftable.screen.data.productCategories.forEach((term, index, terms) => {
            if (term.id === termId) {
                productCategory = term;
            }
        });

        return productCategory;
    }

    advancedProductCategoryElement(term, termAdvancedSettings) {
        var advancedClasses = ['dgfw-posts-advanced-post', 'dgfw-terms-advanced-term'];

        var minAmountInputId = this._id + '-min_amounts-' + term.id;
        var minAmountValue = this._minAmounts[term.id] ? this._minAmounts[term.id].value : 0;

        var minItemsInputId = this._id + '-min_items-' + term.id;
        var minItemsValue = this._minItems[term.id] ? this._minItems[term.id].value : 1;

        this._termsMeta[term.id] = {
            minAmount: new MetaCurrency(minAmountInputId, { currency: this._currency, label: Translate.text('Min amount'), value: minAmountValue }),
            minItems: new MetaQuantity(minItemsInputId, {label: Translate.text('Min items'), value: minItemsValue })
        };


        return {
            tag: 'div',
            id: 'dgfw_criteria_posts_' + this._id + '_advanced_' + term.id,
            classes: advancedClasses,
            attributes: {
                'data-decom-id': term.id,
            },
            children: [
                {
                    tag: 'h4',
                    classes: ['dgfw-posts-select-post-title'],
                    text: term.title.length < 20 ? term.title : term.title.slice(0, 40) + '…',
                },
                {
                    tag: 'span',
                    id: 'dgfw_criteria_posts_advanced_remove_' + term.id,
                    classes: ['dgfw-posts-selected-remove', 'dashicons-before', 'dashicons-no'],
                    attributes: {
                        'data-decom-id': term.id
                    }
                },
                {
                    tag: 'div',
                    id: 'dgfw_criteria_posts_advanced_options_' + term.id,
                    classes: ['dgfw-terms-advanced-options'],
                    children: [
                        {
                            tag: 'div',
                            id: minAmountInputId + '_container',
                            classes: ['dgfw-terms-advanced-min-amount'],
                            children: this._termsMeta[term.id].minAmount.elements(),
                        },
                        {
                            tag: 'div',
                            id: minItemsInputId + '_container',
                            classes: ['dgfw-terms-advanced-min-items'],
                            children: this._termsMeta[term.id].minItems.elements(),
                        },
                    ]
                }
            ],
        };
    }

    advancedElements() {
        return this._advancedElements;
    }

    toggleSelectTerm(event) {
        this.hookElements();

        var $termCheckBox = $(event.currentTarget);
        var termId = parseInt($termCheckBox.val());
        var termEnabled = $termCheckBox.is(':checked');

        if (termEnabled) {
            this.addToList(termId);
        } else {
            this.removeFromList(termId);
        }
    }

    removeSelectedTerm(event) {
        this.hookElements();

        var $advancedElementRemove = $(event.currentTarget);
        var termId = parseInt($advancedElementRemove.data('decom-id'));
        var $termCheckBox = $(document.getElementById('dgfw_terms_select_' + this._id + '_checkbox_' + termId));

        this.removeFromList(termId);
        $termCheckBox.prop('checked', false);

    }

    addToList(termId) {
        var productCategory = this.productCategory(termId);
        this.createAndAppendChild(this._$advancedListElement, this.advancedProductCategoryElement(productCategory));
    }


    removeFromList(termId) {
        var $advancedTermElement = this.$advancedTermElement(termId);
        $advancedTermElement.remove();
        delete this._termsMeta[termId];
        this.selectionChanged();
    }

    $advancedTermElement(termId) {
        return $(document.getElementById('dgfw_criteria_posts_' + this._id + '_advanced_' + termId));
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
        $parentElement.append($el);
        if (childData.children) {
            childData.children.forEach((elementData, index, collection) => {
                this.createAndAppendChild($el, elementData);
            });
        }
        return $el;
    }

    selectionChangedEvent() {
        return 'DGFW.SelectionChanged_' + this._id;
    }

    selectionChanged() {
        this._$advancedListElement.trigger(this.selectionChangedEvent());
    }

    changeCurrencyTo(newCurrency) {
        this._currency = newCurrency;

        for (let termId in this._termsMeta) {
            this._termsMeta[termId].minAmount.changeCurrencyTo(this._currency);
        }
    }

}