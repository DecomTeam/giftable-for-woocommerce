import Meta from './Meta.js';
import $ from '../jquery.js';

export default class MetaTerms extends Meta {


    init() {
        this._taxonomy = this._options.taxonomy;
        this._label = this._options.label;
        this._value = this._options.value || new Array();
        this._inputElementId = 'dgfw_criteria_terms_' + this._id;
        this._inputElementName = 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][value]';

        var termElements = new Array();

        if (decomGifts.screen.data.productCategories) {
            decomGifts.screen.data.productCategories.forEach((term, index, collection) => {
                termElements.push(this.termElement(term));
            });
        }


        this._elements = [
            {
                tag: 'div',
                id: 'dgfw_select_terms_' + this._id,
                classes: ['dgfw-checkbox-group-wrapper'],
                children: termElements,
            },
            {
                tag: 'input',
                id: this._inputElementId + '_taxonomy',
                classes: ['dgfw-products'],
                attributes: {
                    name: 'dgfw_criteria[' + this._id.toString().split('-').join('][') + '][taxonomy]',
                    type: 'hidden',
                    value: this._taxonomy,
                },
            },
        ];


        super.init();

    }


   termElement(term) {
        var checkBoxAttributes = {
            type: 'checkbox',
            name: this._inputElementName + '[]',
            value: term.id,
        };

        this._value.forEach((termId, index, collection) => {
            if (parseInt(termId) === term.id) {
                checkBoxAttributes.checked = 'checked';
            }
        });
        return {
            tag: 'div',
            id: 'dgfw_criteria_terms_' + this._id + '_term_' + term.id,
            classes: ['dgfw-terms-select'],
            attributes: {
                'data-decom-id': term.id,
            },
            children: [
                {
                    tag: 'input',
                    id: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id,
                    classes: ['dgfw-terms-select-checkbox'],
                    attributes: checkBoxAttributes,
                },
                {
                    tag: 'label',
                    classes: ['dgfw-terms-select-label'],
                    text: term.title,
                    attributes: {
                        for: 'dgfw_terms_select_' + this._id + '_checkbox_' + term.id,
                    }
                },
            ],
        };
    }

}