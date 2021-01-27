import Sound from 'react-native-sound';

export const COINS = 'coins';

let coinsMp3 = require('../../assets/coins.mp3');

let mp3 = {};

mp3[COINS] = new Sound(coinsMp3);

export const play = (type) => {
    if (mp3[type]) {
        mp3[type].setVolume(0.3).play();
    }
}