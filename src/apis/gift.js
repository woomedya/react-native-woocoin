import { request } from './base';
import * as langStore from '../store/language';



export const buyGift = async ({ userId, item, userInfo, outcode }) => {
    var data = await request('/gift/buy', 'gift.buy', {
        userId,
        outcode,
        userInfo,
        key: item.key,
        image: item.image,
        message: item.message,
        woc: item.woc,
        type: item.type
    });
    return data || 'fail';
}

export const getMyOrders = async (userId) => {
    var data = await request('/gift/myorders', 'gift.myorders', {
        userId
    });

    var lang = langStore.getLanguage();

    return (data || []).map(item => {
        return {
            ...item,
            messageLang: item.message[lang]
        };
    });
}

export const checkGiftItemCount = async (giftItemKey) => {
    var data = await request('/gift/checkgiftitemcount', 'gift.checkgiftitemcount', {
        giftItemKey
    });
    return data || 'fail';
}

export const increaseGiftItemCount = async (giftItemKey, outcode) => {
    var data = await request('/gift/increasegiftitemcount', 'gift.increasegiftitemcount', {
        giftItemKey,
        outcode
    });
    return data == 'ok';
}