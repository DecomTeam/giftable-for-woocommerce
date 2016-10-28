import Criteria from './Criteria.js';
import MetaQuantity from './MetaQuantity.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaItems extends Criteria {

    init() {
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
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_items_min_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._minItems.elements(),
                },
                {
                    tag: 'div',
                    id: 'dgfw_criteria_items_max_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._maxItems.elements(),
                },
            ],
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

        super.init();

    }


    updateMinItems() {
        if (this._minItems.validate()) {
            this._maxItems.setMin(this._minItems.value());

            if (this._minItems.value() > this._maxItems.value()) {
                this._maxItems.value(this._minItems.value());
            }
        }
    }

    updateMaxItems() {
        if (this._maxItems.validate()) {
            this._minItems.setMax(this._maxItems.value());
        }
    }

}