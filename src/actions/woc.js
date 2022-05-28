import * as wocApi from '../apis/woc';
import * as wocStore from '../store/woc';

export const getUserWoc = async () => {
    var userData = await wocApi.getUserData();
    return userData.woc;
}

export const useUserWoc = async (woc, outcode) => {
    var result = await wocApi.useUserWoc(woc, outcode);
    wocStore.setChanged();
    return result == 'ok';
}

export const sendUserWoc = async (userId, woc, outcode) => {
    var result = await wocApi.sendUserWoc(userId, woc, outcode);
    wocStore.setChanged();
    return result == 'ok';
}

export const checkUserWoc = async (woc) => {
    var result = await wocApi.checkUserWoc(woc);
    return result;
}

export const checkInvitationId = async (userId) => {
    var result = await wocApi.checkInvitationId(userId);
    return result == 'ok';
}

export const generateWoc = async () => {
    var result = await wocApi.generateWoc();
    wocStore.setChanged();
    return result;
}