import { request } from './base';



export const searchByUsername = async (username) => {
    var data = await request('/user/searchbyusername', 'user.searchbyusername', {
        username
    });
    return data;
}

export const getUserInfo = async (userId) => {
    var data = await request('/user/getuserinfo', 'user.getuserinfo', {
        userId
    });
    return data;
}

export const setUserInfo = async (userId, info) => {
    var data = await request('/user/setuserinfo', 'user.setuserinfo', {
        userId,
        info
    });
    return data || 'fail';
}