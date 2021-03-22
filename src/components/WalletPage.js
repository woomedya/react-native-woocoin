import React, { Component } from 'react';
import { Modal, StyleSheet, Image, View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import i18n from '../locales';
import { userAction } from 'react-native-woomobileuser';
import * as userStore from '../store/user';
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as wocApi from '../apis/woc';
import { WooadsRewardContainer } from 'react-native-wooads';
import InfoModalContent from '../components/InfoModalContent';
import GoldModalContent from '../components/GoldModalContent';
import * as applicationApi from '../apis/application';
import * as wocAction from '../actions/woc';
import * as soundUtil from '../utilities/sound';

const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');

export default class WalletPage extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.generatingWoc = false;

        this.state = {
            i18n: i18n(),
            equationGold: 0,
            equationKey: 1,
            loading: 0,
            user: userStore.getUser(),
            equationWoc: 0,
            woc: 0,
            gold: 0,
            keys: 0,
            chestWeight: 0,
            giftChest: 0,
            showInfo: false,
            showHowEarmInfo: false,
            actions: []
        };
    }

    componentDidMount() {
        this.refresh();
        this.setActions();
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

    logout = () => {
        Alert.alert(this.state.i18n.wallet.logotTitle,
            this.state.i18n.wallet.logoutDesc,
            [
                { text: this.state.i18n.wallet.ok, onPress: userAction.logout },
                { text: this.state.i18n.wallet.cancel, style: "cancel" },
            ]);
    }

    refresh = async () => {
        this.settingsData();
        this.setUserData();
        this.setActions();
    }

    settingsData = async () => {
        this.increaseLoading();
        var settingsData = await wocApi.getSettingsData();
        this.setState({
            equationGold: settingsData.equationGold,
            equationWoc: settingsData.equationWoc,
            chestWeight: settingsData.chestWeight,
            giftChest: settingsData.giftChest,
        }, this.decreaseLoading);
    }

    setUserData = async () => {
        this.increaseLoading();
        var userData = await wocApi.getUserData();
        this.setState({
            keys: userData.keys,
            gold: userData.gold,
            woc: userData.woc,
        }, this.decreaseLoading);
    }

    setActions = async () => {
        this.increaseLoading();
        var actions = await applicationApi.getActions();
        this.setState({
            actions
        }, this.decreaseLoading);
    }

    getStoreLimit = () => {
        return this.state.chestWeight * (this.state.keys + this.state.giftChest);
    }

    increaseLoading = () => {
        this.state.loading += 1;
        this.setState({
            loading: this.state.loading
        });
    }

    decreaseLoading = () => {
        this.state.loading -= 1;
        this.setState({
            loading: this.state.loading
        });
    }

    generateWoc = async () => {
        if (this.generatingWoc == false) {
            this.generatingWoc = true;
            this.increaseLoading();
            var code = await wocAction.generateWoc();
            this.refresh();
            if (code == 'ok') {
                soundUtil.play(soundUtil.COINS);
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
            this.decreaseLoading();
            this.generatingWoc = false;
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

    renderEquation = () => {
        return <Text style={{ textAlign: 'center', fontSize: 14, color: '#4F4F4F', fontWeight: '200' }}>
            {this.state.equationGold + " " + this.state.i18n.wallet.gold + " + " + this.state.equationKey + " " + this.state.i18n.wallet.key + " = "}
            <Text style={{ fontWeight: 'bold' }}>
                {" " + this.state.equationWoc + " " + this.state.i18n.wallet.woc}
            </Text>
        </Text>;
    }

    render() {
        var wocFontLength = this.state.woc.toString().length;
        var wocFontSize = wocFontLength > 10 ? 28 : wocFontLength > 8 ? 38 : wocFontLength > 5 ? 48 : 58;

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
                                    <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 20, fontWeight: '500' }}>
                                        {this.state.user.username}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, alignItems: 'flex-end', padding: 5 }}>
                                    <TouchableOpacity
                                        onPress={this.logout}>
                                        <EntypoIcon
                                            name="log-out"
                                            style={{ color: "#4F4F4F", padding: 5 }}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ padding: 15, paddingTop: 0 }}>
                                <View style={{ backgroundColor: '#FFCD44', minHeight: 100, borderRadius: 15, flexDirection: 'row', justifyContent: 'center' }}>

                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: wocFontSize, fontWeight: 'bold', color: '#4F4F4F' }}>
                                            {this.state.woc.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', left: 10, alignItems: 'center' }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Image resizeMode="contain" source={wocPng} style={{ height: 27, width: 55 }} />
                                        </View>
                                        <Text style={{ fontSize: 20, fontWeight: '500', color: '#4F4F4F' }}>
                                            {this.state.i18n.wallet.woc}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{ position: 'absolute', left: 5, top: 5 }}
                                        onPress={this.showInfo}>
                                        <AntDesignIcon
                                            name="infocirlce"
                                            style={{ color: "#4F4F4F", padding: 5 }}
                                            size={23}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', minHeight: 200 }}>
                            <View style={{ padding: 15, paddingRight: 7.5, flex: 1, paddingBottom: 0 }}>
                                <TouchableOpacity
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
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 15, paddingLeft: 7.5, flex: 1, paddingBottom: 0 }}>
                                <TouchableOpacity
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

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View >
                            <TouchableOpacity onPress={this.showHowEarmInfo}
                                style={{ padding: 10, top: 5, alignSelf: 'center', alignItems: 'center' }}>
                                {this.renderEquation()}

                                <Text style={{ paddingTop: 5, textAlign: 'center', fontSize: 14, color: '#4F4F4F', fontWeight: 'bold' }}>
                                    {this.state.i18n.wallet.howGoldEarnTitle}
                                </Text>

                                <AntDesignIcon
                                    name="infocirlce"
                                    style={{ color: "#FFCD44", paddingTop: 7 }}
                                    size={23}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    transparent={false}
                    visible={this.state.showInfo}
                    onRequestClose={() => { }}>
                    <InfoModalContent onClose={this.hideInfo} />
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