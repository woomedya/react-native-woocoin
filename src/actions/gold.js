import * as goldApi from '../apis/gold';

var actions = {};
export const generateGold = async (actionKey) => {
    if (actions[actionKey])
        return;

    actions[actionKey] = true;

    if (actions[actionKey]) {
        await goldApi.generateGold(actionKey);
        actions[actionKey] = false;
    }
}