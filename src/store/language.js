import * as storeUtil from 'jutore';
import opts from '../../config';

var store = storeUtil.setScope('woocoin_language', {
    lang: '',
    giftType: {}
});

export const LANG = 'lang';
export const GIFT_TYPE = 'giftType';

export const setLanguage = (value) => {
    store.set(LANG, value);
}

export const getLanguage = () => {
    return store.get(LANG) || opts.lang;
}

export const setGiftType = (value) => {
    store.set(GIFT_TYPE, value);
}

export const getGiftType = () => {
    return store.get(GIFT_TYPE) || opts.giftType;
}

export default store;