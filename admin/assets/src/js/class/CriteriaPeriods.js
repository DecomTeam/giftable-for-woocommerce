import Criteria from './Criteria.js';
import MetaTime from './MetaTime.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaPeriods extends Criteria {

    init() {
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
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_periods_start_container_' + this._id,
                    classes: ['dgfw-criteria-input-container', 'dgfw-criteria-period-container'],
                    children: this._start.elements(),
                },
                {
                    tag: 'div',
                    id: 'dgfw_criteria_periods_end_container_' + this._id,
                    classes: ['dgfw-criteria-input-container', 'dgfw-criteria-period-container'],
                    children: this._end.elements(),
                },
            ],
        };

        this.showCriteria();


        this._bindings.push(
            {
                selector: '#' + this._start.dateElementId(),
                event: 'focusout',
                object: this,
                method: 'updateStartDate'
            },
            {
                selector: '#' + this._start.timeElementId(),
                event: 'focusout',
                object: this,
                method: 'updateStartTime'
            },
            {
                selector: '#' + this._end.dateElementId(),
                event: 'focusout',
                object: this,
                method: 'updateEndDate'
            },
            {
                selector: '#' + this._end.timeElementId(),
                event: 'focusout',
                object: this,
                method: 'updateEndTime'
            }
        );

        super.init();

    }

    updateStartDate() {
        this._start.updateDate();
    }

    updateStartTime() {
        this._start.updateTime();
    }

    updateEndDate() {
        this._end.updateDate();
    }

    updateEndTime() {
        this._end.updateTime();
    }

}