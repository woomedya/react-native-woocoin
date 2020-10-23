import * as storeUtil from 'jutore';

export const PAGE_WALLET = 'wallet';

var store = storeUtil.setScope('woocoin_page', {
    page: PAGE_WALLET
});

var pages = [PAGE_WALLET];

export const PAGE = 'page';

export const setPage = (value) => {
    if (value) {
        if (pages.indexOf(value) > -1)
            pages = pages.filter((p, i) => i < pages.indexOf(value));

        pages.push(value);
        store.set(PAGE, value);
    }
}

export const backPage = () => {
    if (pages.length > 1) {
        pages.pop();
        var value = pages[pages.length - 1];
        store.set(PAGE, value);
        return value;
    } else {
        return null;
    }
}

export const clearPage = () => {
    pages = [PAGE_WALLET];
    store.set(PAGE, PAGE_WALLET);
}

export const getPage = () => {
    return store.get(PAGE);
}

export default store;