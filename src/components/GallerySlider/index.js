import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getInset } from 'react-native-safe-area-view';
import Orientation from 'react-native-orientation-locker';


import { padding } from "../../constants/theme";
import GallerySwiperHelper from "./GallerySwiperHelper";


const offsetTop = getInset('top', false);
const paddingHorizontal = padding.paddingHorizontal.content;


export default class GallerySlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentIndex: 1,
            pressIndex: 0,
            modalVisible: false,
            butonBarBG: '#000000',
            images: []
        };

        this.onImageLoadTimeout = null;
    }

    /** Gösterim durumuna göre modal olarak yani sayfadan ayrılmadan resmi büyüterek gösteriyoruz.*/
    show = (images, index) => {
        index = index || 0;

        Orientation.lockToPortrait();
        this.setState({
            images,
            modalVisible: true,
            pressIndex: index,
            currentIndex: index
        });
    }

    hide = () => {
        Orientation.unlockAllOrientations();
        this.setState({
            modalVisible: false
        });
    }

    changeIndex = (index) => {
        if (index != this.state.currentIndex)
            this.setState({
                currentIndex: index
            });
    }

    onImageLoad = (index) => {
        if (this.onImageLoadTimeout == null)
            this.onImageLoadTimeout = setTimeout(() => {
                this.showButtonBar(false);
            }, 1000);
    }

    showButtonBar = (value) => {
        if (this.onImageLoadTimeout) {
            clearTimeout(this.onImageLoadTimeout);
            this.onImageLoadTimeout = null;
        }

        if (value == null) {
            if (this.state.butonBarBG == 'transparent')
                this.setState({
                    butonBarBG: '#000000'
                });
            else
                this.setState({
                    butonBarBG: 'transparent'
                });
        } else {
            this.setState({
                butonBarBG: value ? '#000000' : 'transparent'
            });
        }
    }

    getWidth = () => {
        return Dimensions.get('window').width;
    }

    getHeight = () => {
        return Dimensions.get('window').height;
    }

    getUrl = () => {
        return (this.state.images[this.state.pressIndex] && this.state.images[this.state.pressIndex].url) || '';
    }

    render() {
        return this.state.images.length ? <GallerySwiperHelper
            images={this.state.images.map(x => ({
                ...x,
                dimensions: { width: this.getWidth(), height: this.getHeight() }
            }))}
            height={this.getHeight()}
            width={this.getWidth()}
            offsetTop={offsetTop}
            onTap={this.showButtonBar}
            backgroundColor={'#000000'}
            imageIndex={this.state.pressIndex}
            isVisible={this.state.modalVisible}
            onBackPress={this.hide}
            onClose={this.hide}
            onImageChange={this.changeIndex}
            onImageLoad={this.onImageLoad}
            bodyStyle={{
                flex: 1,
                backgroundColor: '#000000',
                paddingTop: offsetTop
            }}
            header={
                this.state.butonBarBG == 'transparent' ? null : <View style={[styles.butonBar, { width: "100%", backgroundColor: this.state.butonBarBG, flexDirection: 'row' }]}>
                    <View style={{ position: 'absolute', left: paddingHorizontal, top: offsetTop + 7 }}>
                        <Text style={styles.textNumber}>{this.state.currentIndex + 1 + " / " + this.state.images.length}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this.hide}>
                        <View style={[styles.closeicon, { position: 'absolute', right: paddingHorizontal - 3, top: offsetTop + 7, paddingHorizontal: 10, paddingRight: 0 }]}>
                            <MaterialCommunityIcons name="close" size={25} color={'#ffffff'} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        /> : null
    }
}

const styles = StyleSheet.create({
    butonBar: {
        position: "absolute",
        zIndex: 999999,
        top: 0,
        flexDirection: "row",

        height: 40 + offsetTop,
        alignItems: 'center'
    },
    shareicon: {
        position: "absolute",
        right: 48,
        top: offsetTop,
    },
    closeicon: {
        position: "absolute",
        right: 3,
        top: offsetTop,
    },
    textNumber: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textAlign: "center",
        textAlignVertical: "center",
    },
    text: {
        color: "#fff",
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        textAlign: "center"
    },
});
