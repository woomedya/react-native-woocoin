import React, { Component } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, Dimensions, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';


import { padding } from '../constants/theme';
import i18n from '../locales';
import * as userStore from '../store/user';
import { numeralFormat } from '../utilities/number';
import * as giftApi from '../apis/gift';
import * as langStore from '../store/language';
import * as wocAction from '../actions/woc';
import * as pageStore from '../store/page';


const { width, height } = Dimensions.get('window');
const paddingHorizontal = padding.paddingHorizontal.content;
const height94 = width / 9 * 5;



export default class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            i18n: i18n(),
            visible: false,
            giftItem: null,
            userInfo: null,
            loading: false
        }

        this.giftType = langStore.getGiftType();
    }

    componentDidMount() {
        userStore.default.addListener(userStore.USER_INFO, this.userInfoChanged);
    }

    componentWillUnmount() {
        userStore.default.removeListener(userStore.USER_INFO, this.userInfoChanged);
    }

    userInfoChanged = () => {
        let info = userStore.getUserInfo();
        this.setState({
            userInfo: info
        });
    }

    show = ({ giftItem, userInfo }) => {
        this.setState({
            visible: true,
            giftItem,
            userInfo: userInfo || this.state.userInfo
        });
    }

    hide = () => {
        this.setState({
            visible: false
        });
    }

    setLoading = async (loading) => {
        await new Promise(res => {
            this.setState({
                loading
            }, res);
        });
    }

    goEditUserInfo = async () => {
        this.hide();
        pageStore.setPage(pageStore.PAGE_EDIT_USER_INFO);
    }

    buyGift = async () => {
        let userId = userStore.getUserId();
        let item = this.state.giftItem;

        await this.setLoading(true);

        let hide = false;

        let code = await giftApi.checkGiftItemCount(item.key);
        let outcode = code == 'ok' && await wocAction.checkUserWoc(item.woc);

        if (outcode && await wocAction.useUserWoc(item.woc, outcode)) {
            code = await giftApi.buyGift({ userId, item, userInfo: this.state.userInfo, outcode });

            if (code == 'ok') {
                await new Promise(res => {
                    Alert.alert("", this.state.i18n.orderModal.orderDone, [{ text: this.state.i18n.gift.done, onPress: res, style: 'cancel' }]);
                });

                hide = true;
            } else {
                await giftApi.increaseGiftItemCount(item.key, outcode);

                await new Promise(res => {
                    Alert.alert("", this.state.i18n.orderModal.buyingError, [{ text: this.state.i18n.gift.done, onPress: res, style: "cancel" }]);
                });
            }
        } else if (code != 'ok') {
            await new Promise(res => {
                Alert.alert("", this.state.i18n.gift.notEnoughStock, [{ text: this.state.i18n.gift.done, onPress: res, style: "cancel" }]);
            });
        } else {
            await giftApi.increaseGiftItemCount(item.key);

            await new Promise(res => {
                Alert.alert("", this.state.i18n.gift.notEnoughWoc, [{ text: this.state.i18n.gift.done, onPress: res, style: "cancel" }]);
            });
        }

        await this.setLoading(false);

        if (hide) {
            this.hide();

            if (this.props.onOrdered)
                this.props.onOrdered();
        }
    }

    render() {
        let item = this.state.giftItem;
        let user = this.state.userInfo;

        return <Modal
            animationType="slide"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            transparent={true}
            visible={this.state.visible}
            onRequestClose={() => { }}
        >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent', width: '100%' }}>
                <TouchableWithoutFeedback onPress={this.hide}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height * 1 / 3, backgroundColor: 'transparent' }}></View>
                </TouchableWithoutFeedback>

                <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 2 / 3, backgroundColor: '#ffffff',
                    elevation: 10,
                    shadowColor: '#000000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowRadius: 10,
                    shadowOpacity: 0.8,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10
                }}>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        {
                            item ? <View style={{ padding: paddingHorizontal }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.i18n.orderModal.title}</Text>
                                </View>

                                <View style={{ padding: 5, width: '100%', alignItems: 'center', height: height94 * 0.6 }}>
                                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: item.image }} />
                                </View>

                                <View style={{ paddingTop: paddingHorizontal }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderModal.giftLabel}</Text>
                                    <Text style={{ paddingTop: 5 }}>{this.giftType[item.type]} - {item.messageLang}</Text>
                                </View>

                                <View style={{ paddingTop: paddingHorizontal }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderModal.deliveryLabel}</Text>

                                        <View style={{ alignSelf: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableWithoutFeedback onPress={this.goEditUserInfo}>
                                                <View style={{ backgroundColor: '#e74c3c', padding: 2, paddingHorizontal: 7, borderRadius: 5 }}>
                                                    <Text numberOfLines={2} style={{ textAlign: 'left', color: '#ffffff', fontWeight: 'bold', fontSize: 12 }}>{this.state.i18n.gift.goEditUserInfo}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </View>
                                    {
                                        item.requiredUserInfo.map(r => {
                                            return <Text style={{ paddingTop: 5 }}>{user[r]}</Text>
                                        })
                                    }
                                </View>

                                <View style={{ paddingTop: paddingHorizontal }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderModal.confirmLabel}</Text>
                                    <Text style={{ paddingTop: 5 }}>{this.state.i18n.orderModal.confirmText}</Text>
                                </View>

                                <TouchableWithoutFeedback onPress={this.buyGift}>
                                    <View style={{ width: '100%' }}>
                                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: paddingHorizontal }}>
                                            <Text style={{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }}>{numeralFormat(item.woc)} {this.state.i18n.gift.woc}</Text>
                                        </View>

                                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: 5 }}>

                                            <View style={{ backgroundColor: '#e74c3c', padding: 5, paddingHorizontal: 10, borderRadius: 5 }}>
                                                {
                                                    this.state.loading ? <ActivityIndicator size="small" color={'#ffffff'} /> : <Text numberOfLines={2} style={{ textAlign: 'left', color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.gift.order}</Text>
                                                }
                                            </View>

                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View> : null
                        }

                    </ScrollView>

                </View>
            </View >
        </Modal >
    }
}