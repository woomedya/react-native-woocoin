import * as storeUtil from 'jutore';
import { userStore } from 'react-native-woomobileuser';


export const USER = userStore.USER;
export const USER_INFO = 'userInfo';


export const userInfoStore = storeUtil.setScope('woocoin_user_info', {
    userInfo: null
});


export const getUser = () => {
    return userStore.getUser();
}

export const getUserId = () => {
    return (getUser() || {}).id;
}

export const setUser = (value) => {
    return userStore.setUser(value);
}

export const getToken = () => {
    var user = getUser();
    return (user && user.token) || '';
}

export const getUserInfo = () => {
    return userInfoStore.get(USER_INFO);
}

export const setUserInfo = (value) => {
    return userInfoStore.set(USER_INFO, value);
}


export default userStore.default;