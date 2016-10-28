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

        this._terms = new MetaTerms(this._id + '-terms', {
            label: Translate.text('Terms'),
            taxonomy: 'product_cat',
            terms: this._conditions.terms ? this._conditions.terms : false,
        });

        this._steps = new Array();

        this._steps[0] = {
            stepName: Translate.text('Select Product Categories'),
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

        this._steps[1] = {
            stepName: Translate.text('Amounts and Quantities'),
            description: Translate.text('Set up minimum amount and/or number of items for each selected category.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_product_cats_advanced_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: this._terms.advancedElements(),
                }
            ],
        };

        this.showCriteria();

        this._bindings = this._bindings.concat(this._terms.bindings());

        this._bindings.push(
            {
                selector: '#' + this._terms.advancedListId(),
                event: this._terms.selectionChangedEvent(),
                object: this,
                method: 'readjustSize',
            }
        );

        super.init();

    }

}