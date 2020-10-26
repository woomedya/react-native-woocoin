import { request } from './base';

export const getActions = async () => {
    var data = await request('/application/getactions', 'application.getactions', {});
    return data || [];

    // return await new Promise(res => setTimeout(() => res('ok'), 500));
    // return await new Promise(res => setTimeout(() => res('notEnoughGoldRight'), 500));
}