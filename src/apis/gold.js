import { request } from './base';

export const generateGold = async (actionKey, params) => {
    var data = await request('/goldtoken/generategold', 'goldtoken.generategold', {
        actionKey,
        params
    });
    return data || 'fail';

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughGoldRight'), 500));
}

export const checkTimeout = async (actionKey) => {
    var data = await request('/goldtoken/checktimeout', 'goldtoken.checktimeout', {
        actionKey
    });
    return data || 'fail';

}