
import ScreenFactory from './ScreenFactory.js';
import Debug from './Debug.js';

export default class Admin {

    constructor() {
        if (decomGiftable && decomGiftable.screen) {
            this._screen = ScreenFactory.create(decomGiftable.screen);

            this.init();
        }
    }

    init() {
        Debug.info('Giftable for WooCommerce initialized.');
    }

}
