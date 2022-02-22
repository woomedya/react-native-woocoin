import { request } from './base';
import * as langStore from '../store/language';

export const getActions = async () => {
    var data = await request('/application/getactions', 'application.getactions', {});

    var lang = langStore.getLanguage();

    return (data || []).map(x => {
        return {
            ...x,
            descriptionLang: x.description[lang],
            type: x.gold ? 'gold' : 'energy',
            value: x.gold || x.coinKey
        };
    });
}

export const getGifts = async () => {
    var data = await request('/application/getgifts', 'application.getgifts', {});

    var lang = langStore.getLanguage();

    return Object.keys(data || {}).map(key => {
        let x = data[key];
        return {
            key,
            ...x,
            messageLang: x.message[lang]
        };
    });
}