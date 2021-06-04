import * as storeUtil from 'jutore';

var store = storeUtil.setScope('woocoin_woc', {
    changed: 0,
    sendFee: 1
});

export const WOC_CHANGED = 'changed';
export const SEND_FEE = 'sendFee';

export const setChanged = () => {
    let value = store.get(WOC_CHANGED) || 0;
    store.set(WOC_CHANGED, ++value);
}

export const setSendFee = (value) => {
    if (value) store.set(SEND_FEE, value);
}

export const getSendFee = (woc) => {
    let fee = store.get(SEND_FEE);
    return Math.ceil(woc / 100) * fee;
}

export default store;