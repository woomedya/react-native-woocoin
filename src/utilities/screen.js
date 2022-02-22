import { Dimensions, Platform, StatusBar } from 'react-native';


const { width, height } = Dimensions.get('window');


export const isPad = () => {
    return Platform.isPad ? true : (getWidth() / getHeight() > 0.7);
}

export const getHeight = () => {
    return Dimensions.get('window').height - StatusBar.currentHeight;
}

export const getWidth = () => {
    return Dimensions.get('window').width - StatusBar.currentHeight;
}

export const getHeightByScale = (scale) => {
    return getHeight() * scale;
}

export const getSmallerAxes = (width, height) => {
    return width < height ? width : height;
}

export const getSquareHeight = () => {
    var contentArea = getHeight() - (getHeight() / (isPad() ? 10 : 6));
    return contentArea * (isPad() ? 2.2 / 3 : 2 / 3);
}

export const getSquareWidth = () => {
    var contentArea = getWidth() - (getWidth() / (isPad() ? 10 : 6));
    return contentArea
}

export const getScoreSize = () => {
    return isPad() ? 100 : 60;
}

export const getZoneTitleSize = () => {
    return isPad() ? 30 : 20;
}

export const getCellSize = (zone) => {
    var squareHeight = getSquareHeight() - getScoreSize() - getZoneTitleSize();
    var squareWidth = getSquareWidth();

    var contentArea = getSmallerAxes(squareWidth, squareHeight);

    return contentArea / zone;
}

export const getAdsSize = () => {
    return 100;
}

export const getControlHeight = () => {
    var contentArea = getHeight() - getAdsSize();
    return contentArea * (isPad() ? 0.8 / 3 : 1 / 3);
}

export const getControlButtonsSize = () => {
    var controlHeight = getControlHeight();
    var controlWidth = getSquareWidth();

    var controlArea = getSmallerAxes(controlWidth / 2, controlHeight);

    return controlArea - (isPad() ? 50 : 0);
}

export const getControlPaintButtonSize = () => {
    return getControlButtonsSize() / 4 - (getControlButtonsSize() / 20);
}

export const getControlHintButtonTop = () => {
    return - getControlPaintButtonSize() - 10;
}

export const getHintControlPaintButtonSize = () => {
    return getControlButtonsSize() / 4 - (getControlButtonsSize() / 20);
}

export const getAutoControlPaintButtonSize = () => {
    return getControlButtonsSize() / 4.2 - (getControlButtonsSize() / 20);
}

export const getControlDirectionButtonSize = () => {
    return getControlButtonsSize() / 2 - (getControlButtonsSize() / 10);
}

export const bigScreenCondition = (bigValue, smallValue, obj = { conditionValue: 800 }) => {
    return height > obj.conditionValue ? bigValue : smallValue;
}

export const bigWidthScreenCondition = (bigValue, smallValue, obj = { conditionValue: 400 }) => {
    return width > obj.conditionValue ? bigValue : smallValue;
}