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

export const checkTimeout = async (actionKey) => {
    let code = await goldApi.checkTimeout(actionKey);
    return code == 'ok';
}