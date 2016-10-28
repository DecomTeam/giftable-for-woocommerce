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

        // stick to default currency only for now
        //
        // this._currencies = new Map([
        //     ['usd', { text: 'USD', symbol: '$'}],
        //     ['eur', { text: 'EUR', symbol: '€'}]
        // ]);

        this._currency = decomGiftable.screen.data.currency;
        // this._currencySelectId = 'dgfw_criteria_currency_' + this._id;
        // this._$currencySelect = null;

        // var currencyElements = [];
        // this._currencies.forEach((currency, key, collection) => {
        //     currencyElements.push({
        //         tag: 'option',
        //         attributes: {
        //             value: key
        //         },
        //         text: currency.text
        //     });
        // });


        this._minAmount = new MetaCurrency(this._id + '-min_amount', { currency: this._currency, label: Translate.text('Min amount'), value: this._conditions.min_amount ? this._conditions.min_amount.value : 0 });
        this._maxAmount = new MetaCurrency(this._id + '-max_amount', { currency: this._currency, label: Translate.text('Max amount'), value: this._conditions.max_amount ? this._conditions.max_amount.value : 0 });

        this._steps = new Array();

        this._steps[0] = {
            description: Translate.text('Set amount range. Leave empty for no limits.'),
            help: Translate.text('This condition will be met if the <strong>total cart amount</strong> is within the defined min/max amounts range.'),
            elements: [
                // {
                //     tag: 'div',
                //     id: 'dgfw_criteria_amounts_currency_container_' + this._id,
                //     classes: ['dgfw-criteria-input-container'],
                //     children: [
                //         {
                //             tag: 'label',
                //             id: 'dgfw_criteria_currency_label_' + this._id,
                //             classes: ['dgfw-label', 'dgfw-label-amount'],
                //             text: 'Currency',
                //             attributes: {
                //                 'for': 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]',
                //             },
                //         },
                //         {
                //             tag: 'select',
                //             id: this._currencySelectId,
                //             classes: ['dgfw-currency', 'dgfw-select'],
                //             attributes: {
                //                 name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]'
                //             },
                //             children: currencyElements,
                //         },
                //     ],
                // },
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

        this.showCriteria();

        this._bindings.push(
            // {
            //     selector: '#' + this._currencySelectId,
            //     event: 'change',
            //     object: this,
            //     method: 'changeCurrency'
            // },
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

    changeCurrency() {
        if (!this._$currencySelect) {
            this._$currencySelect = $(document.getElementById(this._currencySelectId));
        }

        this._currency = this._currencies.get(this._$currencySelect.val());
        this._minAmount.changeCurrencyTo(this._currency);
        this._maxAmount.changeCurrencyTo(this._currency);
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