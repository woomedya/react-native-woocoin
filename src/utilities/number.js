import numeral from 'numeral';

export const numeralFormat = (nmbr) => {
    return  numeral(nmbr).format('0.0a').replace('.0', '');
}