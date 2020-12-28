import * as wocApi from '../apis/woc';
import * as wocStore from '../store/woc';

export const getUserWoc = async () => {
    var userData = await wocApi.getUserData();
    return userData.woc;
}

export const useUserWoc = async (woc) => {
    var result = await wocApi.useUserWoc(woc);
    wocStore.setChanged();
    return result == 'ok';
}

export const generateWoc = async () => {
    var result = await wocApi.generateWoc();
    wocStore.setChanged();
    return result;
}