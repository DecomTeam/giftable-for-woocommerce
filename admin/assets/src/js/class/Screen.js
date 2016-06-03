import BoundElement from './BoundElement.js';

export default class Screen {

    constructor(screenData) {
        this._data = screenData;
        this._bound = new Array();
        this._bindings = new Array();
        this.init();
    }

    init() {
        this.bind();
    }

    bind() {
        this._bindings.forEach((element, index, collection) => {
            this._bound.push(new BoundElement(this._element, element.selector, element.event, element.object, element.method, element.preventDefault || true));
        });
    }

}
