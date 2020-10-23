import { request } from './base';

export const getUserData = async () => {
    var data = await request('/user/getuserdata', 'user.getuserdata');
    return data || {
        keys: 0,
        gold: 0,
        woc: 0,
    };

    // return await new Promise(res => setTimeout(() => res({
    //     keys: 3,
    //     gold: 6,
    //     woc: 5,
    // }), 500));

}

export const getSettingsData = async () => {
    var data = await request('/settings/getsettingsdata', 'settings.getsettingsdata');
    return data || {
        equationGold: 0,
        equationWoc: 0,
        chestWeight: 0,
        giftChest: 0,
    };

    // return await new Promise(res => setTimeout(() => res({
    //     equationGold: 10,
    //     equationWoc: 1,
    //     chestWeight: 10,
    //     giftChest: 10,
    // }), 500));
}

export const generateWoc = async () => {
    var data = await request('/coinkeytoken/generatewoc', 'coinkeytoken.generatewoc');
    return data || 'fail';

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughGold'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughKey'), 500));
}

export const generateKey = async () => {
    var data = await request('/coinkeytoken/generatekey', 'coinkeytoken.generatekey');
    return data || 'fail';

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
}

export const getAdsLimit = async () => {
    var data = await request('/coinkeytoken/getadslimit', 'coinkeytoken.getadslimit');
    return data || 'fail';

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughKeyRight'), 500));
}