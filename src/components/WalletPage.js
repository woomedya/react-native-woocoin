import React, { Component } from 'react';
import { Modal, StyleSheet, Image, View, Text, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, RefreshControl } from 'react-native';
import LogoutButton from 'react-native-woomobileuser/src/components/LogoutButton';
import EntypoIcon from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import i18n from '../locales';
import * as userStore from '../store/user';
import * as wocApi from '../apis/woc';
import { WooadsRewardContainer } from 'react-native-wooads';
import InfoModalContent from '../components/InfoModalContent';
import GoldModalContent from '../components/GoldModalContent';
import * as applicationApi from '../apis/application';
import * as wocAction from '../actions/woc';
import * as soundUtil from '../utilities/sound';
import * as pageStore from '../store/page';
import { Button } from 'react-native-elements';
import * as wocStore from '../store/woc';
import * as cacheStore from '../store/cache';
import * as numberUtil from '../utilities/number';


const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');



export default class WalletPage extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.generatingWoc = false;

        let user = userStore.getUser();
        let cache = user ? cacheStore.getWalletPage() : {};

        this.state = {
            i18n: i18n(),
            loading: 0,
            user,

            equationGold: cache.equationGold || 0,
            equationKey: cache.equationKey || 1,
            equationWoc: cache.equationWoc || 0,
            woc: cache.woc || 0,
            gold: cache.gold || 0,
            keys: cache.keys || 0,
            chestWeight: cache.chestWeight || 0,
            giftChest: cache.giftChest || 0,
            inviteWocGift: cache.inviteWocGift || 0,
            inviteConfirmWocGift: cache.inviteConfirmWocGift || 0,
            miningRequiredGold: cache.miningRequiredGold || 0,
            miningValue: cache.miningValue || 0,
            wocSendFee: cache.wocSendFee || 0,
            coinExchangeValue: cache.coinExchangeValue || 0,
            coinUnitValue: cache.coinUnitValue || '',
            coinUnitLocale: cache.coinUnitLocale || '',
            showCoinExchangeValue: cache.showCoinExchangeValue || false,

            showInfo: false,
            showHowEarmInfo: false,
            actions: cache.actions || [],
            initial: cache.initial || false
        };

        this.loading = 0;
    }

    componentDidMount() {
        if (this.state.initial == false)
            this.refresh();
    }

    showInfo = () => {
        this.setState({
            showInfo: true
        });
    }

    hideInfo = () => {
        this.setState({
            showInfo: false
        });
    }

    showHowEarmInfo = () => {
        this.setState({
            showHowEarmInfo: true
        });
    }

    hideHowEarmInfo = () => {
        this.setState({
            showHowEarmInfo: false
        });
    }

    refresh = async () => {
        await this.increaseLoading();
        await this.settingsData();
        await this.setUserData();
        await this.setActions();
        await this.decreaseLoading({
            initial: true
        });

        let cache = this.state;
        cacheStore.setWalletPage(cache);
    }

    settingsData = async () => {
        await this.increaseLoading();
        var settingsData = await wocApi.getSettingsData();
        wocStore.setSendFee(settingsData.wocSendFee);
        await this.decreaseLoading(settingsData);
    }

    setUserData = async () => {
        await this.increaseLoading();
        var userData = await wocApi.getUserData();
        await this.decreaseLoading({
            keys: userData.keys,
            gold: userData.gold,
            woc: userData.woc,
        });
    }

    setActions = async () => {
        await this.increaseLoading();
        var actions = await applicationApi.getActions();
        await this.decreaseLoading({
            actions
        });
    }

    getStoreLimit = () => {
        return this.state.chestWeight * (this.state.keys + this.state.giftChest);
    }

    increaseLoading = async () => {
        this.loading += 1;
        await new Promise(res => {
            this.setState({
                loading: this.loading
            }, res);
        });
    }

    decreaseLoading = async (state) => {
        this.loading -= 1;
        await new Promise(res => {
            this.setState({
                loading: this.loading,
                ...(state || {})
            }, res);
        });
    }

    generateWoc = async () => {
        if (this.generatingWoc == false) {
            this.generatingWoc = true;
            await this.increaseLoading();
            var code = await wocAction.generateWoc();
            if (code == 'ok') {
                soundUtil.play(soundUtil.COINS);
                await this.refresh();
            } else if (code == 'notEnoughGold') {
                Alert.alert(this.state.i18n.wallet.notEnoughGold,
                    this.state.i18n.wallet.requireGold + " " + this.state.equationGold,
                    [
                        { text: this.state.i18n.wallet.info, onPress: this.showHowEarmInfo },
                        { text: this.state.i18n.wallet.ok }
                    ]);
            } else if (code == 'notEnoughKey') {
                Alert.alert(this.state.i18n.wallet.notEnoughKey,
                    this.state.i18n.wallet.requireKey + " " + this.state.equationKey,
                    [
                        { text: this.state.i18n.wallet.info, onPress: this.showHowEarmInfo },
                        { text: this.state.i18n.wallet.ok },
                    ]);
            }
            this.generatingWoc = false;
            await this.decreaseLoading();
        }
    }

    generateKey = async () => {
        this.increaseLoading();
        await wocApi.generateKey();
        this.refresh();
        this.decreaseLoading();
    }

    showAdsNotify = () => {
        Alert.alert(this.state.i18n.wallet.awardAds,
            this.state.i18n.wallet.awardAdsDesc,
            [
                { text: this.state.i18n.wallet.ok, onPress: this.showAds },
                { text: this.state.i18n.wallet.cancel, style: "cancel" },
            ]);
    }

    showAds = async () => {
        this.increaseLoading();
        var code = await wocApi.getAdsLimit();

        if (code == 'notEnoughKeyRight') {
            Alert.alert(this.state.i18n.wallet.notEnoughKeyRight,
                this.state.i18n.wallet.requireKeyRight,
                [
                    { text: this.state.i18n.wallet.ok },
                ]);
        } else if (code == 'ok') {
            if (this.wooads)
                code = await this.wooads.refresh();

            if (code == 'ok') {
                this.generateKey();
            } else if (code != 'closed') {
                Alert.alert(this.state.i18n.wallet.notFoundRewardTitle,
                    this.state.i18n.wallet.notFoundRewardDesc,
                    [
                        { text: this.state.i18n.wallet.ok }
                    ]);
            }
        }
        this.decreaseLoading();
    }

    gotoWocSenderPage = () => {
        pageStore.setPage(pageStore.PAGE_SENDER);
    }

    gotoInvitePage = () => {
        pageStore.setPage(pageStore.PAGE_INVITE);
    }

    gotoGift = () => {
        pageStore.setPage(pageStore.PAGE_GIFT);
    }

    goEditUserInfo = async () => {
        pageStore.setPage(pageStore.PAGE_EDIT_USER_INFO);
    }

    renderEquation = () => {
        return <Text style={{ textAlign: 'center', fontSize: 14, color: '#4F4F4F', fontWeight: '200' }}>
            {this.state.equationGold + " " + this.state.i18n.wallet.gold + " + " + this.state.equationKey + " " + this.state.i18n.wallet.key + " = "}
            <Text style={{ fontWeight: 'bold' }}>
                {" " + this.state.equationWoc + " " + this.state.i18n.wallet.woc}
            </Text>
        </Text>;
    }

    render() {
        let woc = this.state.woc;
        let wocFontLength = woc.toString().length;
        let wocNumeral = wocFontLength > 9;
        let wocFontSize = wocNumeral ? 58 : wocFontLength > 10 ? 28 : wocFontLength > 8 ? 38 : wocFontLength > 6 ? 46 : 58;


        return <WooadsRewardContainer ref={e => this.wooads = e}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading > 0}
                            onRefresh={this.refresh}
                            colors={["#bdc3c7", "#ecf0f1"]} />
                    }
                    style={{ backgroundColor: '#FFFFFF', flex: 1 }}>

                    <View style={{ padding: 15 }}>
                        <View style={{ backgroundColor: '#F6F6F6', borderRadius: 15 }}>
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <View style={{ alignSelf: 'center', padding: 10 }}>
                                    <TouchableWithoutFeedback
                                        onPress={this.goEditUserInfo}>
                                        <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 20, fontWeight: '500' }}>
                                            {this.state.user.username}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                </View>

                                <View style={{ flex: 1, alignItems: 'flex-end', padding: 5 }}>
                                    <LogoutButton />
                                </View>
                            </View>

                            <View style={{ padding: 15, paddingTop: 0 }}>
                                <TouchableWithoutFeedback
                                    style={{}}
                                    onPress={this.showInfo}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: '#FFCD44', borderRadius: 15, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ fontSize: wocFontSize, fontWeight: 'bold', color: '#4F4F4F' }}>
                                                    {wocNumeral ? numberUtil.numeralFormat(woc) : woc.toLocaleString()}
                                                </Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <Image resizeMode="contain" source={wocPng} style={{ height: 27, width: 55 }} />
                                                </View>
                                                <Text style={{ fontSize: 20, fontWeight: '500', color: '#4F4F4F' }}>
                                                    {this.state.i18n.wallet.woc}
                                                </Text>
                                            </View>
                                        </View>

                                        {
                                            this.state.showCoinExchangeValue ?
                                                <View style={{ position: 'absolute', bottom: -15, alignSelf: 'center' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFCD44', borderBottomRightRadius: 15, borderBottomLeftRadius: 15, paddingBottom: 2, paddingHorizontal: 20 }}>
                                                        <View style={{ justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4F4F4F' }}>≈</Text>
                                                        </View>
                                                        <View style={{ justifyContent: 'center', paddingLeft: 2 }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4F4F4F', letterSpacing: 1 }}>
                                                                {wocNumeral ? numberUtil.numeralFormat(woc * this.state.coinExchangeValue) : numberUtil.concurencyFormat(woc * this.state.coinExchangeValue, this.state.coinUnitLocale)}
                                                            </Text>
                                                        </View>
                                                        <View style={{ justifyContent: 'center', paddingLeft: 0, paddingTop: 2 }}>
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4F4F4F' }}>
                                                                {this.state.coinUnitValue}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View> : null
                                        }
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', minHeight: 200 }}>
                            <View style={{ padding: 15, paddingRight: 7.5, flex: 1, paddingBottom: 0 }}>
                                <TouchableWithoutFeedback
                                    style={{ flex: 1 }}
                                    onPress={this.generateWoc}>
                                    <View style={{ flex: 1, borderRadius: 15, borderColor: '#F6F6F6', borderWidth: 2 }}>
                                        <View style={{ backgroundColor: '#F6F6F6', borderTopLeftRadius: 15, borderTopRightRadius: 15, flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image resizeMode="contain" source={goldPng} style={{ height: 40, width: 40 }} />
                                            <Text style={{ color: '#4F4F4F', fontSize: 22, fontWeight: 'bold' }}>
                                                {this.state.gold} {this.state.i18n.wallet.gold}
                                            </Text>
                                            <Text style={{ color: '#4F4F4F', fontSize: 10, fontWeight: '200' }}>
                                                {this.state.i18n.wallet.storeLimit} {this.getStoreLimit()}
                                            </Text>
                                        </View>
                                        <View style={{ alignSelf: 'center', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                                            <View style={{ padding: 7.5, backgroundColor: '#FFCD44', borderRadius: 20, top: -20 }}>
                                                <Ionicons
                                                    name="hammer"
                                                    style={{ color: "#464646" }}
                                                    size={15}
                                                />
                                            </View>
                                            <Text style={{ textAlign: 'center', bottom: 10, color: '#4F4F4F', fontSize: 12, fontWeight: '200' }}>
                                                {this.state.i18n.wallet.generateWoc}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ padding: 15, paddingLeft: 7.5, flex: 1, paddingBottom: 0 }}>
                                <TouchableWithoutFeedback
                                    style={{ flex: 1 }}
                                    onPress={this.showAdsNotify}>
                                    <View style={{ flex: 1, borderRadius: 15, borderColor: '#F6F6F6', borderWidth: 2 }}>
                                        <View style={{ backgroundColor: '#F6F6F6', borderTopLeftRadius: 15, borderTopRightRadius: 15, flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image resizeMode="contain" source={energyPng} style={{ height: 40, width: 40 }} />
                                            <Text style={{ color: '#4F4F4F', fontSize: 22, fontWeight: 'bold' }}>
                                                {this.state.keys} {this.state.i18n.wallet.key}
                                            </Text>
                                            <Text style={{ color: '#4F4F4F', fontSize: 10, fontWeight: '200' }}></Text>
                                        </View>
                                        <View style={{ alignSelf: 'center', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                                            <View style={{ padding: 5, backgroundColor: '#FFCD44', borderRadius: 20, top: -20 }}>
                                                <EntypoIcon
                                                    name="plus"
                                                    style={{ color: "#464646" }}
                                                    size={20}
                                                />
                                            </View>
                                            <Text style={{ textAlign: 'center', bottom: 10, color: '#4F4F4F', fontSize: 12, fontWeight: '200' }}>{this.state.i18n.wallet.giftKey}</Text>
                                        </View>
                                    </View>

                                </TouchableWithoutFeedback>
                            </View>
                        </View>

                        <View >
                            <TouchableWithoutFeedback onPress={this.showHowEarmInfo}
                                style={{ alignSelf: 'center', alignItems: 'center' }}>
                                <View style={{ padding: 10, top: 5, alignSelf: 'center', alignItems: 'center' }}>
                                    {this.renderEquation()}
                                    <Text style={{ paddingTop: 5, textAlign: 'center', fontSize: 14, color: '#4F4F4F', fontWeight: 'bold' }}>
                                        {this.state.i18n.wallet.howGoldEarnTitle}
                                    </Text>

                                    <FontAwesome
                                        name="question-circle"
                                        style={{ color: "#FFCD44", paddingTop: 7 }}
                                        size={30}
                                    />

                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            this.state.initial ? <View style={{ backgroundColor: '#F6F6F6', borderRadius: 15 }}>
                                <View style={{ padding: 15, paddingTop: 0 }}>

                                    <View style={{ paddingTop: 15, }}>
                                        <View style={{ borderRadius: 15 }}>
                                            <Button
                                                buttonStyle={{
                                                    backgroundColor: '#778beb',
                                                    borderRadius: 15, paddingVertical: 10,
                                                }}
                                                title={
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#f5f6fa', fontWeight: '500', fontSize: 22, textAlign: 'center' }}>{this.state.i18n.wallet.gift}</Text>
                                                        <Text style={{ color: '#f5f6fa', fontSize: 14, textAlign: 'center' }}>{this.state.i18n.wallet.giftText}</Text>
                                                    </View>
                                                }
                                                onPress={this.gotoGift}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 15, }}>
                                        <View style={{ borderRadius: 15 }}>
                                            <Button
                                                buttonStyle={{
                                                    backgroundColor: '#f19066',
                                                    borderRadius: 15, paddingVertical: 10,
                                                }}
                                                title={
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#f5f6fa', fontWeight: '500', fontSize: 22, textAlign: 'center' }}>{this.state.i18n.wallet.invite}</Text>
                                                        <Text style={{ color: '#f5f6fa', fontSize: 14, textAlign: 'center' }}>{this.state.i18n.wallet.inviteText}</Text>
                                                    </View>
                                                }
                                                onPress={this.gotoInvitePage}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 15, }}>
                                        <View style={{ borderRadius: 15 }}>
                                            <Button
                                                buttonStyle={{
                                                    backgroundColor: '#38ada9',
                                                    borderRadius: 15, paddingVertical: 10,
                                                }}
                                                title={
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#f5f6fa', fontWeight: '500', fontSize: 22, textAlign: 'center' }}>{this.state.i18n.wallet.send}</Text>
                                                        <Text style={{ color: '#f5f6fa', fontSize: 14, textAlign: 'center' }}>{this.state.i18n.wallet.sendFriends}</Text>
                                                    </View>
                                                }
                                                onPress={this.gotoWocSenderPage}
                                            />
                                        </View>
                                    </View>

                                </View>
                            </View> : null

                        }

                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    transparent={false}
                    visible={this.state.showInfo}
                    onRequestClose={() => { }}>
                    <InfoModalContent onClose={this.hideInfo} actions={this.state.actions}
                        equationGold={this.state.equationGold}
                        equationKey={this.state.equationKey}
                        equationWoc={this.state.equationWoc}
                    />
                </Modal>

                <Modal
                    animationType="slide"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    transparent={false}
                    visible={this.state.showHowEarmInfo}
                    onRequestClose={() => { }}>
                    <GoldModalContent onClose={this.hideHowEarmInfo} actions={this.state.actions} />
                </Modal>
            </KeyboardAvoidingView>
        </WooadsRewardContainer>
    }
}

const styles = StyleSheet.create({

});