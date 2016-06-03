export default class Translate {
    static loadTranslations() {
        this._translations = this._translations || decomGifts.screen.translations || new Object();
    }

    static text(original) {
        this.loadTranslations();
        return this._translations[original] || original;
    }

}
