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