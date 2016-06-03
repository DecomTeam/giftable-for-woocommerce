import Meta from './Meta.js';
import $ from '../jquery.js';
import Translate from './Translate.js';

export default class MetaTime extends Meta {


    init() {
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
            todayParts.mm = today.getMonth()+1; //January is 0!
            todayParts.yyyy = today.getFullYear();
            todayParts.hh = today.getHours();
            todayParts.ii = today.getMinutes();

            for (var dateSegment in todayParts) {
                if(todayParts[dateSegment] < 10) {
                    todayParts[dateSegment] = '0' + todayParts[dateSegment] ;
                 }
            }

            this._value.date = todayParts.yyyy + '-' + todayParts.mm + '-' + todayParts.dd;
            this._value.time = todayParts.hh + ':' + todayParts.ii;
        }

        this._elements = [
            {
                tag: 'label',
                id: 'dgfw_criteria_date_label_' + this._id,
                classes: ['dgfw-label-date'],
                text: this._label,
                attributes: {
                    for: this._dateInputElementId,
                },
            },
            {
                tag: 'input',
                id: this._dateInputElementId,
                classes: ['dgfw-date'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][date]',
                    type: 'date',
                    value: this._value.date,
                },
            },
            {
                tag: 'label',
                id: 'dgfw_criteria_time_label_' + this._id,
                classes: ['dgfw-label-time'],
                text: Translate.text(' at '),
                attributes: {
                    for: this._timeInputElementId,
                },
            },
            {
                tag: 'input',
                id: this._timeInputElementId,
                classes: ['dgfw-time'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value][time]',
                    type: 'time',
                    value: this._value.time,
                },
            },
        ];

        super.init();

    }

    hookElements() {
        this._$dateInputElement = this._$dateInputElement || $(document.getElementById(this._dateInputElementId));
        this._$timeInputElement = this._$timeInputElement || $(document.getElementById(this._timeInputElementId));
    }

    dateElementId() {
        return this._dateInputElementId;
    }

    timeElementId() {
        return this._timeInputElementId;
    }

    updateDate() {
        this.hookElements();
        this._value.date = this._$dateInputElement.val();
    }

    updateTime() {
        this.hookElements();
        this._value.time = this._$timeInputElement.val();
    }
}