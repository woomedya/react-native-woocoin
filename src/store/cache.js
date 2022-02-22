import * as storeUtil from 'jutore';
import * as wocStore from './woc';

var store = storeUtil.setScope('woocoin_cache', {
    walletPage: {},
    wocCard: {},
    scanQRPage: {}
});

export const WALLET_PAGE = 'walletPage';
export const WOC_CARD = 'wocCard';
export const SCAN_QR_PAGE = 'scanQRPage';

export const setWalletPage = (cache) => {
    let value = {
        equationGold: cache.equationGold,
        equationKey: cache.equationKey,
        equationWoc: cache.equationWoc,
        woc: cache.woc,
        gold: cache.gold,
        keys: cache.keys,
        chestWeight: cache.chestWeight,
        giftChest: cache.giftChest,
        inviteWocGift: cache.inviteWocGift,
        inviteConfirmWocGift: cache.inviteConfirmWocGift,
        miningRequiredGold: cache.miningRequiredGold,
        miningValue: cache.miningValue,
        wocSendFee: cache.wocSendFee,
        coinExchangeValue: cache.coinExchangeValue,
        coinUnitValue: cache.coinUnitValue,
        coinUnitLocale: cache.coinUnitLocale,
        showCoinExchangeValue: cache.showCoinExchangeValue,

        actions: cache.actions,
        initial: cache.initial
    };
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

wocStore.default.addListener(wocStore.WOC_CHANGED, () => {
    setWalletPage({
        ...getWalletPage(),
        initial: false
    });

    setWocCard({
        ...getWocCard(),
        initial: false
    });
});

export default store;