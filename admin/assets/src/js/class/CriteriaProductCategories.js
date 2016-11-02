import Criteria from './Criteria.js';
import MetaTerms from './MetaTerms.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaProductCategories extends Criteria {

    init() {
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
            currency: this._currency,
        });


        this._currencySelectId = 'dgfw_criteria_currency_' + this._id;
        this._$currencySelect = null;

        var currencyElements = [];

        if (this._currencies.length) {
            this._currencies.forEach((currency, key, collection) => {
                currencyElements.push({
                    tag: 'option',
                    attributes: {
                        value: currency.text,
                        selected: (currency.text === this._currency.text ? 'selected' : false),
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
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.elements(),
                }
            ],
        };

        this._steps[1] = {
            stepName: Translate.text('Amounts and Quantities'),
            description: Translate.text('Set up the minimum amount and/or number of items for each selected category.'),
            help: Translate.text('By default, this condition will be met if the customer has at least one product belonging to any of the selected product categories in their cart. You can change minimum amount and/or items for each selected category here. Leave the fields empty for default value (one item minimum, regardless of the amount).'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_advanced_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.advancedElements(),
                }
            ],
        };


        if (currencyElements.length) {
            this._steps[1].elements.unshift({
                tag: 'div',
                id: 'dgfw_criteria_terms_currency_container_' + this._id,
                classes: ['dgfw-criteria-input-container', 'dgfw-criteria-terms-currency-select-container'],
                children: [
                    {
                        tag: 'label',
                        id: 'dgfw_criteria_currency_label_' + this._id,
                        classes: ['dgfw-label', 'dgfw-label-amount'],
                        text: Translate.text('Currency'),
                        attributes: {
                            'for': 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]',
                        },
                    },
                    {
                        tag: 'select',
                        id: this._currencySelectId,
                        classes: ['dgfw-currency', 'dgfw-select'],
                        attributes: {
                            name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                        },
                        children: currencyElements,
                    },
                ],
            });

            this._steps[1].elements.push({
                tag: 'div',
                id: 'dgfw_criteria_terms_currency_note_' + this._id,
                classes: ['dgfw-step-description', 'dgfw-step-note'],
                html: Translate.text('<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.'),
            });
        }


        this.showCriteria();

        this._bindings = this._bindings.concat(this._terms.bindings());

        this._bindings.push(
            {
                selector: '#' + this._currencySelectId,
                event: 'change',
                object: this,
                method: 'changeCurrency'
            },
            {
                selector: '#' + this._terms.advancedListId(),
                event: this._terms.selectionChangedEvent(),
                object: this,
                method: 'readjustSize',
            }
        );

        super.init();

    }


    getCurrency(currencyText) {
        if (!this._currencies) {
            return decomGiftable.screen.data.currency || false;
        }

        var currenciesLength = this._currencies.length;
        var newCurrency = false;

        for (let i = 0; i < currenciesLength; i++) {
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

    getDefaultCurrency() {
        return (this._currencies && this._currencies.length) ? this._currencies[0] : decomGiftable.screen.data.currency;
    }

    changeCurrency() {
        if (!this._$currencySelect) {
            this._$currencySelect = $(document.getElementById(this._currencySelectId));
        }

        var newCurrency = this.getCurrency(this._$currencySelect.val());

        // change currency only if different
        if (newCurrency && newCurrency.text !== this._currency.text) {
            this._currency = newCurrency;
            this._terms.changeCurrencyTo(this._currency);
        }
    }

}