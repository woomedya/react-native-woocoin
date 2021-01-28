import * as goldApi from '../apis/gold';

var actions = {};
export const generateGold = async (actionKey) => {
    let code = 'ok';
    if (actions[actionKey])
        return;

    actions[actionKey] = true;
    await new Promise(res => {
        setTimeout(async () => {
            code = await goldApi.generateGold(actionKey);
            res();
        }, 1000);
    })
    actions[actionKey] = false;
    return code == 'ok';
}