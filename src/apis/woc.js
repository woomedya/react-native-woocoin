import { request } from './base';

let getUserDataWorking = false;
export const getUserData = async () => {
    let promiseRes = null;
    if (getUserDataWorking) {
        return await new Promise(async res => {
            if (getUserDataWorking) {
                promiseRes = res;
            } else {
                res(await getUserData());
            }
        });
    } else {
        getUserDataWorking = true;
        var data = await request('/user/getuserdata', 'user.getuserdata');
        let result = data || {
            keys: 0,
            gold: 0,
            woc: 0,
        };
        getUserDataWorking = false;
        if (promiseRes) promiseRes(result);
        return result;
    }
}

export const getSettingsData = async () => {
    var data = await request('/settings/getsettingsdata', 'settings.getsettingsdata');
    return data || {
        equationGold: 0,
        equationWoc: 0,
        chestWeight: 0,
        giftChest: 0,
        inviteWocGift: 0,
        inviteConfirmWocGift: 0
    };
}

export const generateWoc = async () => {
    var data = await request('/coinkeytoken/generatewoc', 'coinkeytoken.generatewoc');
    return data || 'fail';
}

export const generateKey = async () => {
    var data = await request('/coinkeytoken/generatekey', 'coinkeytoken.generatekey');
    return data || 'fail';
}

export const getAdsLimit = async () => {
    var data = await request('/coinkeytoken/getadslimit', 'coinkeytoken.getadslimit');
    return data || 'fail';
}

export const useUserWoc = async (woc, outcode) => {
    var data = await request('/coinkeytoken/useuserwoc', 'coinkeytoken.useuserwoc', {
        woc,
        outcode
    });
    return data || 'fail';
}

export const sendUserWoc = async (userId, woc, outcode) => {
    var data = await request('/coinkeytoken/senduserwoc', 'coinkeytoken.senduserwoc', {
        userId,
        woc,
        outcode
    });
    return data || 'fail';
}

export const checkUserWoc = async (woc) => {
    var data = await request('/coinkeytoken/checkuserwoc', 'coinkeytoken.checkuserwoc', {
        woc
    });
    return data || '';
}

