import * as goldApi from '../apis/gold';

var actions = {}, timeout = null;
export const generateGold = (actionKey) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    timeout = setTimeout(async () => {
        if (actions[actionKey])
            return;
        actions[actionKey] = true;
        if (actions[actionKey]) {
            await goldApi.generateGold(actionKey);
            actions[actionKey] = false;
        }
    }, 5000);
}