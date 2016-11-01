import Meta from './Meta.js';
import $ from '../jquery.js';

export default class MetaCurrency extends Meta {


    init() {
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

        this._elements = [
            {
                tag: 'label',
                id: 'dgfw_criteria_amount_label_' + this._id,
                classes: ['dgfw-label', 'dgfw-label-amount'],
                text: this._label,
                attributes: {
                    'for': this._inputElementId,
                },
            },
        ];

        if (this._currency.position === 'left' || this._currency.position === 'left_space') {
            currencySpan.classes.push('left');
            this._elements.push(currencySpan);
        }

        this._elements.push(
            {
                tag: 'input',
                id: this._inputElementId,
                classes: ['dgfw-amount'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
                    type: 'number',
                    step: '0.01',
                    // min: this._minValue,
                    // max: this._maxValue,
                    value: this._value,
                },
            }
        );

        if (this._currency.position === 'right' || this._currency.position === 'right_space') {
            currencySpan.classes.push('right');
            this._elements.push(currencySpan);
        }

        this._elements.push(
            {
                tag: 'input',
                id: this._currencyElementId,
                classes: ['dgfw-amount'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][currency]',
                    type: 'hidden',
                    value: this._currency.text,
                },
            }
        );

        super.init();

    }

    hookElements() {
        super.hookElements();
        this._$prefixElement = this._$prefixElement || $(document.getElementById(this._prefixElementId));
        this._$currencyElement = this._$currencyElement || $(document.getElementById(this._currencyElementId));
    }

    changeCurrencyTo(currency) {
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

    validate() {
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

    value(newValue = false) {
        if (newValue) {
            this._value = parseFloat(newValue);
            this.format();
        }

        return this._value;
    }

    setMin(minValue) {
        this.hookElements();
        this._minValue = parseFloat(minValue);
        this._$inputElement.attr('min', this._minValue);
        if (this._minValue > this._value) {
            this.value(this._minValue);
        }
    }

    setMax(maxValue) {
        this.hookElements();
        this._maxValue = parseFloat(maxValue);
        this._$inputElement.attr('max', this._maxValue);
        if (this._maxValue < this._value) {
            this.value(this._maxValue);
        }
    }

    format() {
        this.hookElements();
        var n = 2;
        var x = 999; // no thousand separator for now
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        var formatedValue = this._value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
        this._$inputElement.val(formatedValue);
    }
}