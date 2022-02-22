import React, { Component } from "react";
import { View, Modal } from "react-native";
import FastImage from "react-native-fast-image";


import GallerySwiper from "./GallerySwiper";


export default class GallerySwiperHandler extends Component {

    constructor(props) {
        super(props)
        this.props = props;
    }

    render() {
        return (
            <Modal
                transparent
                animationType={'fade'}
                visible={this.props.isVisible}
                supportedOrientations={['portrait']}
                onRequestClose={this.props.onBackPress}
            >
                {this.props.header}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#000000',
                        paddingTop: this.props.offsetTop
                    }}
                >
                    <GallerySwiper
                        onSingleTapConfirmed={() => { if (this.props.onTap) this.props.onTap(); }}
                        onDoubleTapConfirmed={() => { return true; }}
                        onPageSelected={(index) => {
                            if (this.props.onImageChange) this.props.onImageChange(index);
                            if (this.props.onImageLoad) this.props.onImageLoad(index);

                            return true;
                        }}
                        maxScale={5}
                        sensitiveScroll={true}
                        resizeMode={"stretch"}
                        initialPage={this.props.imageIndex || 0}
                        images={this.props.images}
                        enableTransform={true}
                        enableScale={true}
                        enableTranslate={true}
                        initialNumToRender={this.props.images.length}
                        imageComponent={(imageProps, imageDimensions, index) => {
                            let props = JSON.parse(JSON.stringify({ ...imageProps }));
                            props.source = props.source || {};
                            props.source.cache = FastImage.cacheControl.web;
                            props.resizeMode = FastImage.resizeMode.stretch;
                            props.priority = FastImage.priority.high;

                            return (
                                <View>
                                    <FastImage
                                        {...imageProps}
                                        resizeMode='contain'
                                        style={{
                                            height: "100%"
                                        }}
                                    />
                                </View>
                            )
                        }}
                    />
                </View>
            </Modal>
        );
    }
}
