export default class Debug {
    static isEnabled() {
        return this._enabled = this._enabled || decomGiftable.debug || false;
    }

    static info(debugObject) {
        if (this.isEnabled()) {
            console.info(debugObject);
        }
    }

    static log(debugObject) {
        if (this.isEnabled()) {
            console.log(debugObject);
        }
    }

    static error(debugObject) {
        if (this.isEnabled()) {
            console.error(debugObject);
        }
    }

}
