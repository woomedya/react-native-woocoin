import Sound from 'react-native-sound';
import { Platform } from 'react-native';

export const COINS = 'coins';

let coinsMp3 = require('../../assets/coins.mp3');

let mp3 = {};

mp3[COINS] = new Sound(coinsMp3);

export const play = (type) => {
    if (mp3[type]) {
        mp3[type].stop();

        mp3[type].setVolume(Platform.OS == 'ios' ? 0.3 : 0.7).play();
    }
}