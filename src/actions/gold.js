import * as goldApi from '../apis/gold';

var actions = {};

export const generateGold = async (actionKey) => {
    actions[actionKey] = true;
    setTimeout(() => {
        if (actions[actionKey]) {
            actions[actionKey] = false;
            goldApi.generateGold(actionKey);
        }
    }, 5000);
}