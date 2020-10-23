import Crypto from 'woo-crypto';
import opts from '../../config';
import Axios from "axios";
import * as userStore from '../store/user';
import * as userApi from 'react-native-woomobileuser/src/apis/user';
import * as userAction from 'react-native-woomobileuser/src/actions/user';

const getUTCTime = (miliseconds = 0) => {
    return new Date(Date.now() + miliseconds).toISOString();
}

const post = async (baseURL, url, headers, data) => {
    var instance = Axios.create({
        baseURL: baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', ...headers }
    });
    var responseJson = await instance.post(url, data);
    return responseJson.data;
}

const login = async () => {
    var token = userStore.getToken();
    if (token) {
        var user = await userApi.token(token);
        if (user) {
            userAction.login(user);
            return user;
        } else {
            throw new Error('failed user login');
        }
    } else {
        throw new Error('not exist user');
    }
}

export const request = async (url, type, obj) => {
    try {
        var jwt = userStore.getToken();
        var result = {};

        if (jwt) {
            obj = obj || {};
            var token = (Crypto.encrypt(JSON.stringify({ expire: getUTCTime(opts.tokenTimeout).toString(), type }), opts.publicKey, opts.privateKey));

            result = await post(opts.serverUrl, url, {
                public: opts.woouserPublicKey,
                applicationId: opts.applicationId,
                token,
                jwt
            }, {
                ...obj
            });

            if (result.auth == false) {
                var user = await login();
                result = await request(url, type, obj);
            }
        }

        return result.data;
    } catch (error) {
        return null;
    }
}