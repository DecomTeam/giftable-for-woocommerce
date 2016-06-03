import Meta from './Meta.js';
import $ from '../jquery.js';

export default class MetaQuantity extends Meta {


	init() {
		this._label = this._options.label;
		this._inputElementId = 'dgfw_criteria_items_' + this._id;
		this._value = this._options.value;
		// this._minValue = 0;
		// this._maxValue = Infinity;

		this._elements = [
			{
				tag: 'label',
				id: 'dgfw_criteria_items_label_' + this._id,
				classes: ['dgfw-label', 'dgfw-label-items'],
				text: this._label,
				attributes: {
					'for': this._inputElementId,
				},
			},
			{
				tag: 'input',
				id: this._inputElementId,
				classes: ['dgfw-items'],
				attributes: {
					name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]',
					type: 'number',
					step: '1',
					// min: this._minValue,
					// max: this._maxValue,
					value: this._value,
				},
			},
		];

		super.init();

	}

	validate() {
		this.hookElements();
		var newValue = parseFloat(this._$inputElement.val());
		var valid = false;
		if ( (newValue >= this._minValue) && (newValue <= this._maxValue) ) {
			this._value = newValue;
			valid = true;
		}

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
		var n = 0;
		var x = 3;
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
		var formatedValue = this._value.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
		this._$inputElement.val(formatedValue);
	}
}