import CriteriaFactory from './CriteriaFactory.js';
import CriteriaAmounts from './CriteriaAmounts.js';
import BoundElement from './BoundElement.js';

import $ from '../jquery.js';

export default class Category {

    constructor(categoryData, criteriaData = false) {

        this._id = categoryData.id;
        this._name = categoryData.name;
        this._bound = new Array();

        this._$element = $(document.getElementById(categoryData.elementId));
        this._$description = $(document.getElementById(categoryData.descriptionId));
        this._$addButton = $(document.getElementById(categoryData.addButtonId));

        this._criteria = new Map();

        if (criteriaData) {
            var criteria = CriteriaFactory.create(criteriaData.id, criteriaData.type, criteriaData);
            this._criteria.set(this._criteria.size.toString(), criteria);

            $("#dgfw-loading").fadeOut();
            this.updateDescription();
            this.appendCriteriaElement(criteria.element());
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
            this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeCriteria'));

        }
    }

    addCriteria() {
        var criteria = new CriteriaAmounts(this._criteria.size, {scrollTo: true});
        this._criteria.set(this._criteria.size.toString(), criteria);
        this.updateDescription();
        this._$addButton.hide();
        this.appendCriteriaElement(criteria.element());
        this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.changeTypeEvent(), this, 'changeCriteriaType'));
        this._bound.push(new BoundElement(this._$element, criteria.elementSelector(), criteria.removeEvent(), this, 'removeCriteria'));
    }

    removeCriteria(event, criteriaId) {
        var criteria = this._criteria.get(criteriaId);
        this._criteria.delete(criteriaId);
        criteria.removeElement();
        this.unbindSelector(criteria.elementSelector());
        this.updateDescription();
        this._$addButton.show();
    }

    updateDescription() {
        var newDescription = '';
        // this._criteria.forEach((criteria, index, collection) => {
        //     newDescription += criteria.description() + ' ';
        // });
        this._$description.text(newDescription);
    }

    appendCriteriaElement($element) {
        this._$description.after($element);
    }

    changeCriteriaType(event, criteriaId, newType) {
        var newCriteria = new CriteriaFactory.createFrom(this._criteria.get(criteriaId), newType);
        this._criteria.set(criteriaId, newCriteria);
    }

    unbindSelector(selector) {
        var newBound = new Array();
        this._bound.forEach((boundElement, index) => {
            if (boundElement.selector() === selector) {
                boundElement.unbind();
            } else {
                newBound.push(boundElement);
            }
        });
        this._bound = newBound;
    }

}
