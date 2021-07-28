import opts from './config';
import WocPage from './src/components/WocPage';
import * as langStore from './src/store/language';
import * as wocStore from './src/store/woc';
import * as userStore from './src/store/user';
import * as cacheStore from './src/store/cache';
import WocBackButton_ from './src/components/WocBackButton';
import * as goldAction from './src/actions/gold';

export const config = async ({ serverUrl, publicKey, privateKey, locales, lang, woouserPublicKey, applicationId, deviceId, siteUrl }) => {
    opts.serverUrl = serverUrl;
    opts.publicKey = publicKey;
    opts.privateKey = privateKey;
    opts.applicationId = applicationId;
    opts.deviceId = deviceId;
    opts.woouserPublicKey = woouserPublicKey;
    opts.siteUrl = siteUrl;

    opts.lang = lang;
    opts.locales = locales || {};

    langStore.setLanguage(lang);

    userStore.default.addListener(userStore.USER, () => {
        if (userStore.getUser() == null)
            cacheStore.setDefaultValue();
    });
}

export const setLang = (lang) => {
    opts.lang = lang;
    langStore.setLanguage(lang);
}

export const setSendFee = (value) => {
    wocStore.setSendFee(value);
}

export default WocPage;

export const GoldAction = goldAction;

export const WocBackButton = WocBackButton_;