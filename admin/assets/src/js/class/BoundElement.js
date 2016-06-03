import $ from '../jquery.js';
import Debug from './Debug.js';

export default class BoundElement {

    constructor(parent = 'body', selector, event, object, method, preventDefault = true) {
        this._parent = parent;
        this._selector = selector;
        this._event = event;
        this._object = object;
        this._method = method;
        this._callback = function(e) {
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            object[method](...arguments);
        };

        $(this._parent).on(this._event, this._selector, this._callback);

        Debug.info('Bound - parent: ' + this._parent + ', event: ' + this._event + ', selector: ' + this._selector + ', object: ' + object + ', method: ' + method);
        Debug.log('Parent:');
        Debug.log(this._parent);
        Debug.log('Object:');
        Debug.log(object);
    }

    unbind() {
        $(this._parent).off(this._event, this._selector, this._callback);

        Debug.info('Unbound - parent: ' + this._parent + ', event: ' + this._event + ', selector: ' + this._selector);
        Debug.log('Parent:');
        Debug.log(this._parent);

    }

    selector() {
        return this._selector;
    }
}
