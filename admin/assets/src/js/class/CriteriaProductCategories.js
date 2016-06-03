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

        this._terms = new MetaTerms(this._id + '-terms', { label: Translate.text('Terms'), taxonomy: 'product_cat', value: this._conditions.terms ? this._conditions.terms.value : false });

        this._steps = new Array();

        this._steps[0] = {
            description: Translate.text('Select product categories this gift category applies for.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.elements(),
                }
            ],
        };

        this.showCriteria();

        this._bindings = this._bindings.concat(this._terms.bindings());

        super.init();

    }

}