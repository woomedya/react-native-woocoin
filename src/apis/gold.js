import { request } from './base';

export const generateGold = async (actionKey, params) => {
    var data = await request('/goldtoken/generategold', 'goldtoken.generategold', {
        actionKey,
        params
    });
    return data || 'fail';
}

export const checkTimeout = async (actionKey, userId, params) => {
    var data = await request('/goldtoken/checktimeout', 'goldtoken.checktimeout', {
        actionKey,
        userId,
        params
    });
    return data || 'fail';
}