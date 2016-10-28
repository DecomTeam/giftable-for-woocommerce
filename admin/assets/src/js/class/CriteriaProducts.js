import Criteria from './Criteria.js';
import MetaPosts from './MetaPosts.js';
import Translate from './Translate.js';
import $ from '../jquery.js';

export default class CriteriaProducts extends Criteria {

    init() {
        this._type = 'products';

        if (this._sourceCriteria) {
            this.takeOverFromSource();
        }

        this._products = new MetaPosts(this._id + '-posts', { label: Translate.text('Posts'), postType: 'product', value: this._conditions.posts ? this._conditions.posts.value : false });

        this._steps = new Array();

        var productElements = this._products.elements();
        var productAdvancedElements = this._products.advancedElements();

        this._steps[0] = {
            stepName: Translate.text('Select Products'),
            description: Translate.text('Select products this gift category applies for.'),
            help: Translate.text('This condition will be met if the customer has at least one item of any of the selected products in their cart. To specify a minimum quantity for each selected product, click the <strong>Product Quantities</strong> button below.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_products_container_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: productElements,
                }
            ],
        };

        this._steps[1] = {
            stepName: Translate.text('Product Quantities'),
            description: Translate.text('Set minimum quantity for each selected product.'),
            elements: [
                {
                    tag: 'div',
                    id: 'dgfw_criteria_products_advanced_' + this._id,
                    classes: ['dgfw-criteria-input-container'],
                    children: productAdvancedElements,
                }
            ],
        };

        this.showCriteria();

        this._bindings = this._bindings.concat(this._products.bindings());

        this._bindings.push({
            selector: '#' + this._products.elementId(),
            event: this._products.selectionChangedEvent(),
            object: this,
            method: 'readjustSize'
        });

        super.init();

    }

}