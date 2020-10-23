import { userStore } from 'react-native-woomobileuser';

export const USER = userStore.USER;

export const getUser = () => {
    return userStore.getUser();
}

export const setUser = (value) => {
    return userStore.setUser(value);
}

export const getToken = () => {
    var user = getUser();
    return (user && user.token) || '';
}

export default userStore.default;