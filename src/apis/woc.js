import { request } from './base';
import * as userStore from '../store/user';

let getUserDataWorking = false, promiseRes = [];
export const getUserData = async () => {
    if (getUserDataWorking) {
        return await new Promise(async res => {
            if (getUserDataWorking) {
                promiseRes.push(res);
            } else {
                res(await getUserData());
            }
        });
    } else {
        var jwt = userStore.getToken();
        getUserDataWorking = true && jwt;
        var data = await request('/user/getuserdata', 'user.getuserdata');
        if (data == undefined) {
            getUserDataWorking = false;
            data = await getUserData();
        }
        let result = data || {
            keys: 0,
            gold: 0,
            woc: 0,
        };
        getUserDataWorking = false;
        let recurRes = () => {
            if (promiseRes.length) {
                let res = promiseRes.pop();
                if (res) {
                    res(result);
                    recurRes();
                }
            }
        }
        recurRes();
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

