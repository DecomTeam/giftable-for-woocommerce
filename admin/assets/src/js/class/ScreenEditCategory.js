import Screen from './Screen.js';
import Category from './Category.js';

import $ from '../jquery.js';

export default class ScreenEditCategory extends Screen {

    init() {
        this._category = new Category(this._data.category, this._data.criteria);

        this._bindings.push(
            {
                selector: '#dgfw_add_criteria',
                event: 'click',
                object: this,
                method: 'addCriteria'
            }
        );

        super.init();
    }

    addCriteria() {
        this._category.addCriteria();
    }

}
