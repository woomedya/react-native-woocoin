
import tr from './tr';
import en from './en';
import opts from '../../config';
import * as langStore from '../store/language';
import * as stringUtil from '../utilities/string';


let changedWordByLang = {};



const changeWordForObject = (str, from, to) => {
    if (typeof str == 'string') {
        return stringUtil.replaceAll(str, from, to);
    } else {
        Object.keys(str).forEach(key => {
            str[key] = changeWordForObject(str[key], from, to);
        });
        return str;
    }
}

const changeWord = (lang, locale) => {
    if (opts.localesChangeWord[lang]) {
        if (changedWordByLang[lang]) {
            locale = changedWordByLang[lang];
        } else {
            Object.keys(opts.localesChangeWord[lang]).forEach(from => {
                locale = changeWordForObject(locale, from, opts.localesChangeWord[lang][from]);
            });
            changedWordByLang[lang] = locale;
        }
        return locale;
    } else {
        return locale;
    }
}

const getLocaleByLang = (lang) => {
    if (opts.locales[lang])
        return opts.locales[lang];
    else if (lang == 'tr')
        return tr;
    else if (lang == 'en')
        return en;
    else
        return en;
}

export default () => {
    var lang = langStore.getLanguage();
    let locale = getLocaleByLang(lang);
    locale = changeWord(lang, locale);
    return locale;
}
