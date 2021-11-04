import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { request, PERMISSIONS } from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import i18n from '../locales';
import * as wocAction from '../actions/woc';
import * as cacheStore from '../store/cache';
import * as goldAction from '../actions/gold';
import opts from '../../config';
import * as userStore from '../store/user';
import * as soundUtil from '../utilities/sound';


const wocPng = require('../../assets/woc.png');

const ALREADY = 'already';
const OK = 'ok';
const KEY_TIMEOUT = 'earnWocTimeout';
const FAIL = 'fail';

export default class ScanQRPage extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        let walletCache = cacheStore.getWalletPage();
        let scanCache = cacheStore.getScanQRPage();

        this.state = {
            i18n: i18n(),
            user: userStore.getUser(),
            qrAvailable: scanCache.qrAvailable == null ? true : scanCache.qrAvailable,
            waiting: false,
            resultCode: scanCache.resultCode || '',
            inviteWocGift: walletCache.inviteWocGift || 0,
            inviteConfirmWocGift: walletCache.inviteConfirmWocGift || 0,
        };
    }

    componentDidMount() {
        request(PERMISSIONS.IOS.CAMERA);

        cacheStore.default.addListener(cacheStore.WALLET_PAGE, this.cacheChanged);
    }

    componentWillUnmount() {
        cacheStore.default.removeListener(cacheStore.WALLET_PAGE, this.cacheChanged);
    }

    cacheChanged = () => {
        let cache = cacheStore.getWalletPage();

        this.setState({
            inviteWocGift: cache.inviteWocGift || 0,
            inviteConfirmWocGift: cache.inviteConfirmWocGift || 0
        });
    }

    onReadQR = e => {
        this.setState({
            qrAvailable: false,
            waiting: true
        }, async () => {
            let invitationId = (e.data || '');
            let resultCode = FAIL;

            if (invitationId) {
                let giftWoc = this.state.inviteWocGift;

                let code = (await goldAction.checkInvitationConfirmWoc(opts.deviceId, invitationId)) ? (await goldAction.checkInvitationWoc(invitationId) ? OK : KEY_TIMEOUT) : ALREADY;

                if (code == OK) {
                    if (await goldAction.generateInvitationWoc(giftWoc)) {
                        if (await goldAction.generateInvitationConfirmWoc(this.state.inviteConfirmWocGift, opts.deviceId, invitationId)) {
                            resultCode = OK;

                            let outcode = await wocAction.checkUserWoc(giftWoc);
                            await wocAction.sendUserWoc(invitationId, giftWoc, outcode);
                            await wocAction.useUserWoc(giftWoc, outcode);

                            soundUtil.play(soundUtil.COINS);
                        } else {
                            resultCode = FAIL;
                        }
                    } else {
                        resultCode = KEY_TIMEOUT;
                    }
                } else {
                    resultCode = code;
                }
            }

            this.setState({
                waiting: false,
                resultCode
            });

            if (resultCode == ALREADY || resultCode == OK)
                cacheStore.setScanQRPage({
                    qrAvailable: false,
                    resultCode
                });
        });
    };

    refresQr = () => {
        if (this.state.waiting == false) {
            this.setState({
                qrAvailable: true
            });
        }
    }

    render() {
        return <ScrollView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <View style={{ padding: 16 }}>
                <View style={{ alignSelf: 'center', paddingTop: 0, }}>
                    <Text style={{ textAlign: 'center', color: '#353b48', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.scanQRPage.scanInvitationQR}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.scanQRPage.scanFriendsQR}
                </Text>
            </View>

            {
                this.state.qrAvailable ? <View style={{ paddingTop: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ paddingTop: 0 }}>
                        <QRCodeScanner
                            onRead={this.onReadQR}

                            containerStyle={{ flexDirection: 'row', justifyContent: 'center' }}
                            cameraStyle={{ height: 250, width: 250 }}
                            cameraProps={{ ratio: '1:1' }}
                        />
                    </View>
                </View> :
                    <View style={{ padding: 16 }}>
                        {this.state.waiting ? <View>
                            <Icon
                                name='cloud-download'
                                type='simple-line-icon'
                                color='#f39c12'
                                size={50}
                            />
                            <Text style={{ fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', paddingBottom: 20 }}>{this.state.i18n.scanQRPage.waiting}</Text>
                        </View>
                            :
                            this.state.resultCode == OK ? <View>
                                <Icon
                                    name='check'
                                    type='material'
                                    color='#2ecc71'
                                    size={50}
                                />
                                <Text style={{ fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', paddingBottom: 20 }}>{this.state.i18n.scanQRPage.success}</Text>
                            </View> :
                                this.state.resultCode == ALREADY ? <View>
                                    <Icon
                                        name='stop'
                                        type='octicon'
                                        color='#e74c3c'
                                        size={50}
                                    />
                                    <Text style={{ fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', paddingBottom: 20 }}>{this.state.i18n.scanQRPage.already}</Text>
                                </View> : <TouchableWithoutFeedback onPress={this.refresQr}>
                                    <View>
                                        <Ionicons
                                            name='camera-reverse'
                                            color='#778beb'
                                            size={50}
                                            style={{ alignSelf: 'center' }}
                                        />
                                        <Text style={{ fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', paddingBottom: 20 }}>{this.state.i18n.scanQRPage[this.state.resultCode]}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                        }
                    </View>
            }

            <View style={{ paddingTop: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ paddingTop: 0 }}>
                    <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#353b48' }}>
                        {this.state.i18n.invite.wocCount}
                    </Text>

                    <View style={{ alignItems: 'center', paddingTop: 10 }}>
                        <Image resizeMode="contain" source={wocPng} style={{ height: 40, width: 100 }} />
                    </View>

                    <Text style={{ fontSize: 18, textAlign: 'center', color: '#4F4F4F', paddingBottom: 20 }}>
                        {this.state.inviteConfirmWocGift} {this.state.i18n.wallet.woc}
                    </Text>
                </View>
            </View>

        </ScrollView>
    }
}

const styles = StyleSheet.create({

});