import * as userStore from '../store/user';
import * as userApi from '../apis/user';



export const getUserInfo = async () => {
    let info = userStore.getUserInfo();

    if (info == null) {
        let userId = userStore.getUserId();
        info = await userApi.getUserInfo(userId);
        userStore.setUserInfo(info);
    }

    return info;
}