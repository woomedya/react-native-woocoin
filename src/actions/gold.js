import * as goldApi from '../apis/gold';

export const generateGold = async (actionKey) => {
    setTimeout(() => {
        goldApi.generateGold(actionKey);
    }, 5000);
}