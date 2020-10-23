import React, { Component } from 'react';
import { Modal, StyleSheet, Image, View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import i18n from '../locales';
import * as langStore from '../store/language';
import { userAction } from 'react-native-woomobileuser';
import * as userStore from '../store/user';
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as wocApi from '../apis/woc';
import { WooadsRewardContainer } from 'react-native-wooads';

const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');

export default class Wallet extends Component {
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
            modalVisible: false
        };
    }

    componentDidMount() {
        langStore.default.addListener(langStore.LANG, this.langChanged);
        this.refresh();
    }

    componentWillUnmount() {
        langStore.default.removeListener(langStore.LANG, this.langChanged);
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    showInfo = () => {
        this.setState({
            modalVisible: true
        });
    }

    hideInfo = () => {
        this.setState({
            modalVisible: false
        });
    }

    logout = () => {
        userAction.logout();
    }

    refresh = async () => {
        this.settingsData();
        this.setUserData();
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
            var code = await wocApi.generateWoc();
            this.refresh();
            if (code == 'notEnoughGold') {
                Alert.alert(this.state.i18n.wallet.notEnoughGold,
                    this.state.i18n.wallet.requireGold + " " + this.state.equationGold,
                    [
                        { text: this.state.i18n.wallet.ok },
                    ]);
            } else if (code == 'notEnoughKey') {
                Alert.alert(this.state.i18n.wallet.notEnoughKey,
                    this.state.i18n.wallet.requireKey + " " + this.state.equationKey,
                    [
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
        return <Text style={{ textAlign: 'center', fontSize: 12, color: '#4F4F4F', fontWeight: '200' }}>
            {this.state.equationGold + " " + this.state.i18n.wallet.gold + " + " + this.state.equationKey + " " + this.state.i18n.wallet.key + " = "}
            <Text style={{ fontWeight: 'bold' }}>
                {" " + this.state.equationWoc + " " + this.state.i18n.wallet.woc}
            </Text>
        </Text>;
    }

    render() {
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

                    <View style={{ padding: 15, paddingTop: 65 }}>

                        <View style={{ backgroundColor: '#F6F6F6', minHeight: 200, borderRadius: 15 }}>
                            <View style={{
                                position: 'absolute',
                                padding: 20,
                                backgroundColor: '#E0E0E0',
                                borderRadius: 60,
                                alignSelf: 'center', top: -50
                            }}>
                                <FontAwesome5Icon
                                    name="user-alt"
                                    style={{ color: "#828282", padding: 5 }}
                                    size={60}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                                    <TouchableOpacity
                                        onPress={this.showInfo}>
                                        <FeatherIcon
                                            name="alert-circle"
                                            style={{ color: "#BDBDBD", padding: 5 }}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={this.logout}>
                                        <FeatherIcon
                                            name="log-out"
                                            style={{ color: "#BDBDBD", padding: 5 }}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ alignSelf: 'center', paddingTop: 30 }}>
                                <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 20, fontWeight: '500' }}>
                                    {this.state.user.username}
                                </Text>
                            </View>

                            <View style={{ padding: 15, paddingTop: 30 }}>
                                <View style={{ backgroundColor: '#FFCD44', minHeight: 100, borderRadius: 15, flexDirection: 'row' }}>
                                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Image resizeMode="contain" source={wocPng} style={{ height: 80, width: 80 }} />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 60, fontWeight: 'bold', color: '#4F4F4F' }}>
                                            {this.state.woc}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 3, justifyContent: 'center', left: 10 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '500', color: '#4F4F4F', paddingTop: 25 }}>
                                            {this.state.i18n.wallet.woc}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', minHeight: 200 }}>
                            <View style={{ padding: 15, paddingRight: 7.5, flex: 1, paddingBottom: 0 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={this.generateWoc}>
                                    <View style={{ flex: 1, borderRadius: 15, borderColor: '#F6F6F6', borderWidth: 2 }}>
                                        <View style={{ backgroundColor: '#F6F6F6', flex: 4, alignItems: 'center', justifyContent: 'center' }}>
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
                                        <View style={{ backgroundColor: '#F6F6F6', flex: 4, alignItems: 'center', justifyContent: 'center' }}>
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

                        <View style={{ padding: 10, alignSelf: 'center' }}>
                            {this.renderEquation()}
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}>
                    <View
                        style={{ marginTop: 40, margin: 20, backgroundColor: "white", borderRadius: 20, padding: 20, paddingBottom: 35, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, height: "90%" }}>
                        <TouchableOpacity
                            onPress={this.hideInfo}>
                            <View style={{ padding: 5, backgroundColor: '#e74c3c', alignSelf: 'flex-end', borderRadius: 16 }}>
                                <MaterialIcons
                                    size={16}
                                    name="close"
                                    color="#FFFFFF"
                                />
                            </View>
                        </TouchableOpacity>

                        <ScrollView
                            style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
                            <View style={{ alignSelf: 'center', paddingTop: 30 }}>
                                <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                                    {this.state.i18n.title}
                                </Text>
                            </View>

                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                                {this.state.i18n.wallet.description1}
                            </Text>

                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', flex: 1 }}>
                                {this.state.i18n.wallet.description11}
                            </Text>

                            <View style={{ alignItems: 'center', paddingTop: 15 }}>
                                <Image resizeMode="contain" source={goldPng} style={{ height: 40, width: 40 }} />
                            </View>

                            <Text style={{ paddingTop: 15, textAlign: 'center', fontSize: 14, color: '#4F4F4F', fontWeight: '300' }}>
                                {this.state.i18n.wallet.description2}
                            </Text>

                            <View style={{ alignItems: 'center', paddingTop: 15 }}>
                                <Image resizeMode="contain" source={energyPng} style={{ height: 40, width: 40 }} />
                            </View>

                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                                {this.state.i18n.wallet.description22}
                            </Text>

                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', flex: 1 }}>
                                {this.state.i18n.wallet.description3}
                            </Text>

                            <View style={{ alignItems: 'center', paddingTop: 15 }}>
                                <Image resizeMode="contain" source={wocPng} style={{ height: 40, width: 40 }} />
                            </View>

                            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                                {this.state.i18n.wallet.description4}
                            </Text>
                        </ScrollView>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </WooadsRewardContainer>
    }
}

const styles = StyleSheet.create({

});