import * as storeUtil from 'jutore';

var store = storeUtil.setScope('woocoin_cache', {
    walletPage: {},
    wocCard: {},
    scanQRPage: {}
});

export const WALLET_PAGE = 'walletPage';
export const WOC_CARD = 'wocCard';
export const SCAN_QR_PAGE = 'scanQRPage';

export const setWalletPage = (value) => {
    store.set(WALLET_PAGE, value);
}

export const getWalletPage = () => {
    return store.get(WALLET_PAGE) || {};
}

export const setWocCard = (value) => {
    store.set(WOC_CARD, value);
}

export const getWocCard = () => {
    return store.get(WOC_CARD) || {};
}

export const setScanQRPage = (value) => {
    store.set(SCAN_QR_PAGE, value);
}

export const getScanQRPage = () => {
    return store.get(SCAN_QR_PAGE) || {};
}

export const setDefaultValue = () => {
    setWalletPage({});
    setWocCard({});
    setScanQRPage({});
}

export default store;