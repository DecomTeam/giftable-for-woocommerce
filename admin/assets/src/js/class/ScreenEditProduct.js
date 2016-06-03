import Screen from './Screen.js';
import Category from './Category.js';

import $ from '../jquery.js';

export default class ScreenEditProduct extends Screen {

    init() {
        this._giftableOptionId = '_dgfw_giftable';
        this._productTypeSelectId = 'product-type';

        this._$giftableOption = $(document.getElementById(this._giftableOptionId));
        this._$producTypeSelect = $(document.getElementById(this._productTypeSelectId));

        this._bindings.push(
            {
                selector: '#' + this._giftableOptionId,
                event: 'change',
                object: this,
                method: 'toggleGiftable',
            },
            {
                selector: '#' + this._productTypeSelectId,
                event: 'change',
                object: this,
                method: 'productTypeChange',
            },
            {
                selector: '#_virtual, #_downloadable',
                event: 'change',
                object: this,
                method: 'productTypeChange',
            }
        );

        super.init();
    }

    toggleGiftable() {
        var show, hide;

        if (this._$giftableOption.prop('checked')) {
            show = 'show_if';
            hide = 'hide_if';
        } else {
            show = 'hide_if';
            hide = 'show_if';
        }

        $(document.getElementsByClassName(show + this._giftableOptionId)).show();
        $(document.getElementsByClassName(hide + this._giftableOptionId)).hide();
    }

    productTypeChange() {
        if(this._$giftableOption.is(':visible')) {
            this.toggleGiftable();
        }
    }
}
