import ScreenEditCategory from './ScreenEditCategory.js';
import ScreenEditProduct from './ScreenEditProduct.js';

var _screens = new Map([
        ['edit-category', ScreenEditCategory],
        ['edit-product', ScreenEditProduct],
]);


export default class ScreenFactory {

    static create(screen) {

        if (_screens.has(screen.name)) {
            return new (_screens.get(screen.name))(screen.data);
        }
    }
}
