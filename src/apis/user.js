import { request } from './base';

export const searchByUsername = async (username) => {
    var data = await request('/user/searchbyusername', 'user.searchbyusername', {
        username
    });
    return data;
}