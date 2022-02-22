import numeral from 'numeral';

export const numeralFormat = (nmbr) => {
    return numeral(nmbr).format('0.0a').replace('.0', '');
}

export const concurencyFormat = (nmbr, locale) => {
    return (nmbr || 0).toLocaleString(locale, { maximumSignificantDigits: 1 });
}