import React, { Component } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import i18n from '../locales';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import config from '../../config';

const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');

export default class InfoModalContent extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n(),
        };
    }

    goWooCoinWebSite() {
        Linking.openURL(config.siteUrl);
    }

    render() {
        return <View
            style={{ marginTop: 30, margin: 20, backgroundColor: "white", borderRadius: 20, paddingTop: 10, paddingBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, height: "90%" }}>
            <TouchableOpacity
                style={{ position: 'absolute', zIndex: 999, right: 10, top: 10 }}
                onPress={this.props.onClose}>
                <View style={{ padding: 5, backgroundColor: '#e74c3c', alignSelf: 'flex-end', borderRadius: 16 }}>
                    <MaterialIcons
                        size={16}
                        name="close"
                        color="#FFFFFF"
                    />
                </View>
            </TouchableOpacity>

            <ScrollView
                style={{ backgroundColor: '#FFFFFF', borderRadius: 20, flex: 1, paddingHorizontal: 15 }}>
                <View style={{ alignSelf: 'center', paddingTop: 0 }}>
                    <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.wallet.whatWooCoin}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.wallet.description4}
                </Text>

                <View style={{ alignSelf: 'center', paddingTop: 15 }}>
                    <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.wallet.howEarnTitle}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.wallet.description1}
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

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300', flex: 1 }}>
                    {this.state.i18n.wallet.description3}
                </Text>

                <View style={{ alignItems: 'center', paddingTop: 15 }}>
                    <Image resizeMode="contain" source={wocPng} style={{ height: 40, width: 60 }} />
                </View>

                <View style={{ alignSelf: 'center', paddingTop: 15 }}>
                    <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.wallet.whatDoesItDo}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.wallet.whatDoesItDoDesc}
                </Text>

                <TouchableOpacity
                    onPress={this.goWooCoinWebSite}>
                    <Text style={{ paddingTop: 3, fontSize: 14, textAlign: 'center', color: '#3498db', fontWeight: '300' }}>
                        {this.state.i18n.wallet.woocoincom}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({

});