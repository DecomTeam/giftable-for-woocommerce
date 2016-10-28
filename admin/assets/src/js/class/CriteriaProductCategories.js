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