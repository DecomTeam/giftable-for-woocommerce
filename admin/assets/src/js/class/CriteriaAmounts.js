import Criteria from './Criteria.js';
import MetaCurrency from './MetaCurrency.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaAmounts extends Criteria {

    init() {
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


        this._minAmount = new MetaCurrency(this._id + '-min_amount', { currency: this._currency, label: Translate.text('Min amount'), value: this._conditions.min_amount ? this._conditions.min_amount.value : 0 });
        this._maxAmount = new MetaCurrency(this._id + '-max_amount', { currency: this._currency, label: Translate.text('Max amount'), value: this._conditions.max_amount ? this._conditions.max_amount.value : 0 });

        this._steps = new Array();

        this._steps[0] = {
            description: Translate.text('Set amount range. Leave empty for no limits.'),
            help: Translate.text('This condition will be met if the <strong>total cart amount</strong> is within the defined min/max amounts range.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_min_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._minAmount.elements(),
                },
                {
                    tag: 'div',
                    id: 'dgfw_criteria_amounts_max_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._maxAmount.elements(),
                },
            ],
        };

        if (currencyElements.length) {
            this._steps[0].elements.unshift({
                tag: 'div',
                id: 'dgfw_criteria_amounts_currency_container_' + this._id,
                classes: ['dgfw-criteria-input-container'],
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

            this._steps[0].elements.push({
                tag: 'div',
                id: 'dgfw_criteria_amounts_currency_note_' + this._id,
                classes: ['dgfw-step-description', 'dgfw-step-note'],
                html: Translate.text('<strong>Multi-currency Note</strong>: This condition can be met only by customers shopping in the selected currency. You can cover other currencies by adding another "OR" Amount condition with appropriate min/max amounts for each enabled currency.'),
            });
        }

        this.showCriteria();

        this._bindings.push(
            {
                selector: '#' + this._currencySelectId,
                event: 'change',
                object: this,
                method: 'changeCurrency'
            },
            {
                selector: '#' + this._minAmount.elementId(),
                event: 'focusout',
                object: this,
                method: 'updateMinAmount'
            },
            {
                selector: '#' + this._maxAmount.elementId(),
                event: 'focusout',
                object: this,
                method: 'updateMaxAmount'
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
            this._minAmount.changeCurrencyTo(this._currency);
            this._maxAmount.changeCurrencyTo(this._currency);
        }
    }

    updateMinAmount() {
        if (this._minAmount.validate()) {
            // this._maxAmount.setMin(this._minAmount.value());

            // if (this._minAmount.value() > this._maxAmount.value()) {
            //     this._maxAmount.value(this._minAmount.value());
            // }
        }
    }

    updateMaxAmount() {
        if (this._maxAmount.validate()) {
            // this._minAmount.setMax(this._maxAmount.value());
        }
    }

}