import React, { Component } from 'react';
import { FlatList, View, Text, Dimensions, Alert, Image, ActivityIndicator, TouchableWithoutFeedback, ScrollView, RefreshControl } from 'react-native';


import i18n from '../locales';
import * as userStore from '../store/user';
import * as langStore from '../store/language';
import { padding } from '../constants/theme';
import * as giftApi from '../apis/gift';
import opts from '../../config';
import OrderModal from './OrderModal';
import { numeralFormat } from '../utilities/number';
import GallerySlider from './GallerySlider/index';
import * as userApi from '../apis/user';
import * as pageStore from '../store/page';
import * as applicationApi from '../apis/application';
import * as userAction from '../actions/user';


const { width } = Dimensions.get('window');
const paddingHorizontal = padding.paddingHorizontal.content;
const height94 = width / 9 * 5;


export default class Gift extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n(),
            refreshing: true,
            gifts: [],
            orderLoadingIndex: -1,
            selectedItemGallery: []
        };

        this.giftType = langStore.getGiftType();
        this.orderModal = null;
        this.selectedItemGalleryModal = null;
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({
            refreshing: true
        }, async () => {
            let gifts = await applicationApi.getGifts();

            this.setState({
                gifts,
                refreshing: false
            });
        });
    }

    getUserInfo = async () => {
        return await userAction.getUserInfo();
    }

    goEditUserInfo = async () => {
        pageStore.setPage(pageStore.PAGE_EDIT_USER_INFO);
    }

    showMyOrders = () => {
        pageStore.setPage(pageStore.PAGE_MY_ORDERS);
    }

    showItemGallery = (item) => {
        this.selectedItemGalleryModal.show(item.gallery.map(link => {
            return {
                source: { uri: link },
                title: ''
            };
        }))
    }

    setOrderLoading = async (index) => {
        await new Promise(res => {
            this.setState({
                orderLoadingIndex: this.state.orderLoadingIndex == index ? -1 : index
            }, res);
        });
    }

    buyGift = async (giftItem, index) => {
        await this.setOrderLoading(index);

        let userInfo = await this.getUserInfo();

        if (userInfo && Object.keys(userInfo).filter(k => giftItem.requiredUserInfo.some(r => r == k) && userInfo[k]).length == giftItem.requiredUserInfo.length) {
            this.orderModal.show({
                giftItem,
                userInfo
            });
        } else {
            await new Promise(res => {
                Alert.alert("", this.state.i18n.gift.missingUserInfo, [{
                    text: this.state.i18n.gift.goEditUserInfo, onPress: () => {
                        this.goEditUserInfo();
                        res();
                    }
                }, { text: this.state.i18n.gift.cancel, onPress: res, style: 'cancel' }]);
            });
        }

        await this.setOrderLoading(index);
    }

    giftKey = (item) => {
        return item.key;
    }

    renderGift = ({ item, index }) => {
        return <View style={{ padding: paddingHorizontal, paddingTop: index > 0 ? 0 : paddingHorizontal }}>
            <View style={{ backgroundColor: opts.giftBackgroudColor, height: height94 }}>
                <View style={{ position: 'absolute', zIndex: 100, top: 0, padding: 5, width: '100%', alignItems: 'center', height: height94 * 0.6 }}>
                    <TouchableWithoutFeedback onPress={() => this.showItemGallery(item)}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: item.image }} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ position: 'absolute', zIndex: 200, bottom: 0, width: '100%', height: height94 * 0.4 }}>
                    <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal, paddingBottom: paddingHorizontal }}>
                        <View style={{ flex: 2 }}>
                            <TouchableWithoutFeedback onPress={() => this.showItemGallery(item)}>
                                <View style={{ flex: 1, position: 'absolute', bottom: 0 }}>
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 18 }}>{this.giftType[item.type]}</Text>
                                    <Text numberOfLines={2} style={{ color: '#ffffff' }}>{item.messageLang}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableWithoutFeedback onPress={() => this.buyGift(item, index)}>
                                <View style={{ position: 'absolute', bottom: 0, right: 0, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <Text style={{ textAlign: 'left', color: '#ffffff', fontSize: 10 }}>{item.count} {this.state.i18n.gift.count}</Text>
                                    <Text numberOfLines={1} style={{ textAlign: 'left', color: '#ffffff', fontSize: 14, paddingBottom: 5 }}>{numeralFormat(item.woc)} {this.state.i18n.gift.woc}</Text>

                                    <View style={{ backgroundColor: '#ffffff', padding: 3, paddingHorizontal: 10, borderRadius: 5 }}>
                                        {
                                            this.state.orderLoadingIndex == index ? <ActivityIndicator size="small" color={opts.giftBackgroudColor} /> : <Text numberOfLines={1} style={{ textAlign: 'left', color: opts.giftBackgroudColor, fontWeight: 'bold', fontSize: 12 }}>{this.state.i18n.gift.order}</Text>
                                        }
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }

    render() {
        return <ScrollView
            style={{ backgroundColor: '#FFFFFF', flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                    colors={["#bdc3c7", "#ecf0f1"]} />
            }>
            <FlatList
                style={{ backgroundColor: '#ffffff', flex: 1 }}
                ListHeaderComponentStyle={{ paddingBottom: paddingHorizontal }}
                data={this.state.gifts}
                renderItem={this.renderGift}
                initialNumToRender={10}
                keyExtractor={this.giftKey}
                showsVerticalScrollIndicator={false}
            />

            <OrderModal ref={r => this.orderModal = r} onOrdered={this.showMyOrders} />

            <GallerySlider ref={r => this.selectedItemGalleryModal = r} />
        </ScrollView>
    }
}