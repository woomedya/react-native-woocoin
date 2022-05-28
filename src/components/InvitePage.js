import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Share, Alert } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';

import i18n from '../locales';
import * as userStore from '../store/user';
import * as cacheStore from '../store/cache';
import * as wocAction from '../actions/woc';
import * as goldAction from '../actions/gold';
import opts from '../../config';
import * as soundUtil from '../utilities/sound';


const wocPng = require('../../assets/woc.png');
const ALREADY = 'already';
const OK = 'ok';
const KEY_TIMEOUT = 'earnWocTimeout';
const INVALID_INVITATION_CODE = 'invalidCode';
const FAIL = 'fail';
const MINE = 'mine';


export default class InvitePage extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        let cache = cacheStore.getWalletPage();

        this.state = {
            i18n: i18n(),
            user: userStore.getUser(),
            inviteWocGift: cache.inviteWocGift || 0,
            inviteConfirmWocGift: cache.inviteConfirmWocGift || 0,
            enterCodeError: false,
            confirmLoading: false,
            serverResultCode: ''
        };

        this.invitationCode = '';
    }

    componentDidMount() {
        cacheStore.default.addListener(cacheStore.WALLET_PAGE, this.cacheChanged);
    }

    componentWillUnmount() {
        cacheStore.default.removeListener(cacheStore.WALLET_PAGE, this.cacheChanged);
    }

    cacheChanged = () => {
        let cache = cacheStore.getWalletPage();

        this.setState({
            inviteWocGift: cache.inviteWocGift || 0
        });
    }

    copyInvitationCode = () => {
        Share.share({
            message: opts.invitationCodePrefix + this.state.user.id,
            title: this.state.i18n.invite.shareInvitationCode + ' '
        });
    }

    setLoading = async (value) => {
        await new Promise(res => {
            this.setState({
                confirmLoading: value
            }, res);
        });
    }

    formControl = () => {
        this.setState({
            enterCodeError: !((this.invitationCode || '').replace(opts.invitationCodePrefix, '')) || this.invitationCode.indexOf(opts.invitationCodePrefix) == -1
        });
    }

    invitationCodeChanged = (code) => {
        this.invitationCode = (code || '').trim();
        this.formControl();
    }

    confirmCode = async () => {
        if (this.state.confirmLoading)
            return;

        await this.setLoading(true);

        this.formControl();

        let invitationId = this.invitationCode.replace(opts.invitationCodePrefix, '');
        let serverResultCode = '';

        if (invitationId && this.invitationCode.indexOf(opts.invitationCodePrefix) > -1) {
            if (invitationId == this.state.user.id) {
                serverResultCode = MINE;
            } else {
                let giftWoc = this.state.inviteWocGift;

                let code = (await goldAction.checkInvitationConfirmWoc(opts.deviceId, invitationId)) ? (await goldAction.checkInvitationWoc(invitationId) ? (await wocAction.checkInvitationId(invitationId) ? OK : INVALID_INVITATION_CODE) : KEY_TIMEOUT) : ALREADY;

                if (code == OK) {
                    if (await goldAction.generateInvitationWoc(giftWoc)) {
                        if (await goldAction.generateInvitationConfirmWoc(this.state.inviteConfirmWocGift, opts.deviceId, invitationId)) {
                            let outcode = await wocAction.checkUserWoc(giftWoc);
                            await wocAction.sendUserWoc(invitationId, giftWoc, outcode);
                            await wocAction.useUserWoc(giftWoc, outcode);

                            soundUtil.play(soundUtil.COINS);

                            Alert.alert("", this.state.i18n.invitation.success);
                        } else {
                            serverResultCode = FAIL;
                        }
                    } else {
                        serverResultCode = KEY_TIMEOUT;
                    }
                } else {
                    serverResultCode = code;
                }
            }
        }

        this.setState({
            serverResultCode
        });

        await this.setLoading(false);
    }

    render() {
        return <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
                <View style={{ padding: 16 }}>

                    <View style={{ alignSelf: 'center', paddingTop: 0 }}>
                        <Text style={{ textAlign: 'center', color: '#353b48', fontSize: 24, fontWeight: '500' }}>
                            {this.state.i18n.invite.friendInvitation}
                        </Text>
                    </View>

                    <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                        {this.state.i18n.invite.inviteFriends}
                    </Text>

                    <TouchableWithoutFeedback onPress={this.copyInvitationCode}>
                        <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', width: '80%', color: '#f19066', fontWeight: 'bold', fontSize: 18 }}>{opts.invitationCodePrefix + this.state.user.id}</Text>
                            <View style={{ paddingLeft: 5, paddingTop: 2 }}>
                                <Icon
                                    name='send'
                                    type='feather'
                                    color='#f19066'
                                    size={20}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{ paddingTop: 15 }}>
                        <Input
                            containerStyle={{ paddingTop: 10 }}
                            inputStyle={{ left: 10, fontSize: 16, borderBottomWidth: 0, textAlign: 'center' }}
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, paddingVertical: 5, backgroundColor: '#F6F6F6' }}
                            placeholder={this.state.i18n.invitation.invitationCode}
                            onChangeText={this.invitationCodeChanged}
                            errorStyle={{ color: 'red', textAlign: 'center' }}
                            errorMessage={this.state.enterCodeError ? this.state.i18n.invitation.errorEnterInvitationCode : ''}
                        />
                    </View>

                    <Button
                        buttonStyle={{ backgroundColor: '#f19066', color: '#FFFFFF', borderColor: '#f19066', borderRadius: 10, paddingVertical: 13 }}
                        titleStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        containerStyle={{ paddingHorizontal: 10, flex: 1 }}
                        title={this.state.i18n.invitation.confirm}
                        type="outline"
                        loading={this.state.confirmLoading}
                        loadingProps={{ color: '#FFFFFF' }}
                        onPress={this.confirmCode}
                    />

                    {
                        this.state.serverResultCode ? <View style={{ paddingTop: 15 }}>
                            <Text style={{ fontSize: 13, textAlign: 'center', color: '#ff0000' }}>
                                {this.state.serverResultCode ? this.state.i18n.invitation[this.state.serverResultCode] : ''}
                            </Text>
                        </View> : null
                    }

                    <View>
                        <Text style={{ paddingTop: 30, fontSize: 14, textAlign: 'center', color: '#353b48' }}>
                            {this.state.i18n.invite.wocCount}
                        </Text>

                        <View style={{ alignItems: 'center', paddingTop: 10 }}>
                            <Image resizeMode="contain" source={wocPng} style={{ height: 40, width: 100 }} />
                        </View>

                        <Text style={{ fontSize: 18, textAlign: 'center', color: '#4F4F4F', paddingBottom: 20 }}>
                            {this.state.inviteWocGift} {this.state.i18n.wallet.woc}
                        </Text>
                    </View>


                    <View style={{ paddingTop: 0, flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ paddingTop: 0 }}>
                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#353b48' }}>
                                {this.state.i18n.invitation.wocCount}
                            </Text>

                            <View style={{ alignItems: 'center', paddingTop: 10 }}>
                                <Image resizeMode="contain" source={wocPng} style={{ height: 40, width: 100 }} />
                            </View>

                            <Text style={{ fontSize: 18, textAlign: 'center', color: '#4F4F4F', paddingBottom: 20 }}>
                                {this.state.inviteConfirmWocGift} {this.state.i18n.wallet.woc}
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    }
}

const styles = StyleSheet.create({

});