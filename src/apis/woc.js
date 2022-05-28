import { request } from './base';
import * as userStore from '../store/user';


let getUserDataWorking = false;



export const getUserData = async () => {
    if (getUserDataWorking) {
        return await new Promise(res => {
            setTimeout(async () => {
                res(await getUserData());
            }, 100);
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
        inviteConfirmWocGift: 0,
        miningRequiredGold: 0,
        miningValue: 0,
        wocSendFee: 0,
        equationKey: 0,
        coinExchangeValue: 0,
        coinUnitValue: '',
        coinUnitLocale: '',
        showCoinExchangeValue: false
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

export const checkInvitationId = async (userId) => {
    var data = await request('/coinkeytoken/checkinvitationid', 'coinkeytoken.checkinvitationid', {
        userId
    });
    return data || '';
}
