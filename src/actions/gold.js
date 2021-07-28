import * as goldApi from '../apis/gold';

var actions = {};
export const generateGold = async (actionKey, params) => {
    let code = 'ok';
    if (actions[actionKey])
        return;

    actions[actionKey] = true;
    await new Promise(res => {
        setTimeout(async () => {
            code = await goldApi.generateGold(actionKey, params);
            res();
        }, 1000);
    })
    actions[actionKey] = false;
    return code == 'ok';
}

export const checkTimeout = async (actionKey, userId, params) => {
    let code = await goldApi.checkTimeout(actionKey, userId, params);
    return code == 'ok';
}

export const checkInvitationWoc = async (userId) => {
    return await checkTimeout('invitation', userId);
}

export const generateInvitationWoc = async (giftWoc) => {
    return await generateGold('invitation', { woc: giftWoc });
}

export const checkInvitationConfirmWoc = async (deviceId, invitationId) => {
    return await checkTimeout('invitation.confirm', null, { deviceId, invitationId });
}

export const generateInvitationConfirmWoc = async (giftWoc, deviceId, invitationId) => {
    return await generateGold('invitation.confirm', { woc: giftWoc, deviceId, invitationId });
}