import Screen from './Screen.js';
import Category from './Category.js';
import Translate from './Translate.js';

import $ from '../jquery.js';

export default class ScreenEditProduct extends Screen {

    init() {
        this._giftableOptionId = '_dgfw_giftable';
        this._productTypeSelectId = 'product-type';
        this._hasGiftableVariationsId = '_dgfw_has_giftable_variations';

        this._$giftableOption = $(document.getElementById(this._giftableOptionId));
        this._$producTypeSelect = $(document.getElementById(this._productTypeSelectId));
        this._$hasGiftableVariations = $(document.getElementById(this._hasGiftableVariationsId));

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
            },
            {
                selector: 'input.variable_is_giftable',
                event: 'change',
                object: this,
                method: 'toggleGiftable',
            },
            {
                selector: '#woocommerce-product-data',
                event: 'woocommerce_variations_loaded',
                object: this,
                method: 'toggleGiftable',
            }
        );

        super.init();
    }

    toggleGiftable() {
        var show, hide;
        var $giftableOptions, haveGiftableVariations = false;

        $giftableOptions = $('input.variable_is_giftable');

        for (var i = 0; i < $giftableOptions.length; i++) {
            let $giftableOption = $($giftableOptions[i]);
            let $giftableLabel = $giftableOption.closest('.woocommerce_variation').find('.dgfw_giftable_label');
            if ($giftableOption.prop('checked')) {
                haveGiftableVariations = true;
                this._$hasGiftableVariations.val('yes');

                // add giftable label (if it's not there already)
                if (!$giftableLabel.length){
                    $giftableOption.closest('.woocommerce_variation').find('h3').append(this.giftableVariationLabel());
                }
            } else {
                $giftableLabel.remove();
            }
        }

        if ($giftableOptions.length && !haveGiftableVariations) {
            this._$hasGiftableVariations.val('no');
        }

        // show gift options if product giftable option is checked
        // or at least one variation is marked as giftable (if any)
        if (this._$giftableOption.prop('checked') || ($giftableOptions.length && haveGiftableVariations) || this._$hasGiftableVariations.val() === 'yes') {
            show = 'show_if';
            hide = 'hide_if';
        } else {
            show = 'hide_if';
            hide = 'show_if';
        }

        $(document.getElementsByClassName(show + this._giftableOptionId)).show();
        $(document.getElementsByClassName(hide + this._giftableOptionId)).hide();

        // show the notice if product is not giftable but has giftable variations
        if (!this._$giftableOption.prop('checked') && this._$hasGiftableVariations.val() === 'yes') {
            $(document.getElementsByClassName('show_if_has_giftable_variations_only')).show();
        } else {
            $(document.getElementsByClassName('show_if_has_giftable_variations_only')).hide();
        }

    }

    productTypeChange() {
        if (this._$giftableOption.is(':visible')) {
            this.toggleGiftable();
        }
    }

    giftableVariationLabel() {
        return '<strong class="dgfw_giftable_label">(' + Translate.text('Giftable') + ')</strong>';
    }

}
