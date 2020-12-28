import * as storeUtil from 'jutore';

var store = storeUtil.setScope('woocoin_woc', {
    changed: 0
});

export const WOC_CHANGED = 'changed';

export const setChanged = () => {
    let value = store.get(WOC_CHANGED) || 0;
    store.set(WOC_CHANGED, ++value);
}

export default store;