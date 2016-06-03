
import ScreenFactory from './ScreenFactory.js';
import Debug from './Debug.js';

export default class Admin {

    constructor() {
        if (decomGifts && decomGifts.screen) {
            this._screen = ScreenFactory.create(decomGifts.screen);

            this.init();
        }
    }

    init() {
        Debug.info('Giftable for WooCommerce initialized.');
    }

}
