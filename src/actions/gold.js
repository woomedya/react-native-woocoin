import * as goldApi from '../apis/gold';

var actions = {};
export const generateGold = async (actionKey) => {
    if (actions[actionKey])
        return;

    actions[actionKey] = true;
    await new Promise(res => {
        setTimeout(async () => {
            await goldApi.generateGold(actionKey);
            res();
        }, 1000);
    })
    actions[actionKey] = false;
}