import { request } from './base';

export const generateGold = async (actionKey) => {
    var data = await request('/goldtoken/generategold', 'goldtoken.generategold', {
        actionKey
    });
    return data || 'fail';

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughGoldRight'), 500));
}