import React, { Component } from 'react';
import { Modal, StyleSheet, Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import i18n from '../locales';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import opts from '../../config';
import * as applicationApi from '../apis/application';
import EntypoIcon from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as userStore from '../store/user';

const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');

export default class DailyInfoModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n(),
            showInfo: false,
            gold: 0,
            coinKey: 0
        };
    }

    showInfo = async (keys) => {
        let gold = 0, coinKey = 0;
        let user = userStore.getUser();

        if (user == null) {
            await new Promise(res => {
                const userChanged = () => {
                    if (userStore.getUser()) {
                        userStore.default.removeListener(userStore.USER, userChanged);
                        res();
                    }
                }

                userStore.default.addListener(userStore.USER, userChanged);
            });
        }

        var actions = await applicationApi.getActions();
        actions.forEach(x => {
            if (keys.indexOf(x.key) > -1) {
                gold += x.gold || 0;
                coinKey += x.coinKey || 0;
            }
        });

        this.setState({
            showInfo: true,
            gold,
            coinKey
        });
    }

    hideInfo = () => {
        this.setState({
            showInfo: false
        });
    }

    openWooCoin = () => {
        this.hideInfo();
        this.props.navigation.navigate(opts.woocoinRouteName);
    }

    render() {
        return <Modal
            animationType="fade"
            style={{ flex: 1, justifyContent: 'center' }}
            transparent={true}
            visible={this.state.showInfo}
            onRequestClose={() => { }}>

            <View style={{
                flex: 1, justifyContent: 'center', backgroundColor: '#ffffff70',
                paddingHorizontal: 20
            }}>
                <View
                    style={{
                        padding: 30, paddingHorizontal: 20,
                        backgroundColor: "white", borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5
                    }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', zIndex: 999, right: 10, top: 10 }}
                        onPress={this.hideInfo}>
                        <View style={{ padding: 5, backgroundColor: '#e74c3c', alignSelf: 'flex-end', borderRadius: 16 }}>
                            <MaterialIcons
                                size={16}
                                name="close"
                                color="#FFFFFF"
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{ alignSelf: 'center', paddingTop: 0 }}>
                        <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                            {this.state.i18n.dailyInfo.title}
                        </Text>
                    </View>

                    <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                        {this.state.i18n.dailyInfo.text}
                    </Text>

                    <View style={{ flexDirection: 'row', minHeight: 200 }}>
                        <View style={{ padding: 10, paddingRight: 7.5, flex: 1, paddingBottom: 0 }}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.openWooCoin}>
                                <View style={{ flex: 1, borderRadius: 15, borderColor: '#F6F6F6', borderWidth: 2 }}>
                                    <View style={{ backgroundColor: '#F6F6F6', borderTopLeftRadius: 15, borderTopRightRadius: 15, flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="contain" source={goldPng} style={{ height: 40, width: 40 }} />
                                        <Text style={{ color: '#4F4F4F', fontSize: 22, fontWeight: 'bold' }}>
                                            {this.state.gold} {this.state.i18n.wallet.gold}
                                        </Text>
                                        <Text style={{ color: '#4F4F4F', fontSize: 10, fontWeight: '200' }}></Text>
                                    </View>
                                    <View style={{ alignSelf: 'center', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                                        <View style={{ padding: 7.5, backgroundColor: '#FFCD44', borderRadius: 20, top: -20 }}>
                                            <Ionicons
                                                name="hammer"
                                                style={{ color: "#464646" }}
                                                size={15}
                                            />
                                        </View>
                                        <Text style={{ textAlign: 'center', bottom: 10, color: '#4F4F4F', fontSize: 12, fontWeight: '200' }}>{this.state.i18n.dailyInfo.wallet}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 10, paddingLeft: 7.5, flex: 1, paddingBottom: 0 }}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.openWooCoin}>
                                <View style={{ flex: 1, borderRadius: 15, borderColor: '#F6F6F6', borderWidth: 2 }}>
                                    <View style={{ backgroundColor: '#F6F6F6', borderTopLeftRadius: 15, borderTopRightRadius: 15, flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="contain" source={energyPng} style={{ height: 40, width: 40 }} />
                                        <Text style={{ color: '#4F4F4F', fontSize: 22, fontWeight: 'bold' }}>
                                            {this.state.coinKey} {this.state.i18n.wallet.key}
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
                                        <Text style={{ textAlign: 'center', bottom: 10, color: '#4F4F4F', fontSize: 12, fontWeight: '200' }}>{this.state.i18n.dailyInfo.wallet}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

        </Modal>
    }
}

const styles = StyleSheet.create({

});