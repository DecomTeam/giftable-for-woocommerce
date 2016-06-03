import BoundElement from './BoundElement.js';
import $ from '../jquery.js';

export default class Meta {
    constructor(id, options) {
        this._id = id;
        this._value;
        this._elements;
        this._inputElementId;
        this._$inputElement;
        this._options = options;
        this._bindings = new Array();

        this.init();
    }

    init() {
    }

    hookElements() {
        this._$inputElement = this._$inputElement || $(document.getElementById(this._inputElementId));
    }

    elements() {
        return this._elements;
    }

    id() {
        return this._id;
    }

    elementId() {
        return this._inputElementId;
    }

    bindings() {
        return this._bindings;
    }

}