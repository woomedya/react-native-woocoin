import React, { Component } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import i18n from '../locales';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FlatList } from 'react-native-gesture-handler';

const energyPng = require('../../assets/energy.png');
const goldPng = require('../../assets/gold.png');
const wocPng = require('../../assets/woc.png');

export default class InfoModalContent extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n()
        };
    }

    renderKey = item => {
        return item.key;
    }

    renderItem = ({ item }) => {
        var png = item.type == 'gold' ? goldPng : item.keyUsed ? wocPng : energyPng;
        return <View>
            <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                {item.descriptionLang}
            </Text>

            <View style={{ alignItems: 'center', paddingTop: 15 }}>
                <Image resizeMode="contain" source={png} style={{ height: 40, width: item.keyUsed ? 60 : 40 }} />
            </View>

            <Text style={{ fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: 'bold', paddingBottom: 20 }}>
                {item.value} {item.type == 'gold' ? this.state.i18n.wallet.gold : item.keyUsed ? this.state.i18n.wallet.woc : this.state.i18n.wallet.key}
            </Text>
        </View>
    }

    render() {
        return <View
            style={{ marginTop: 30, margin: 20, backgroundColor: "white", borderRadius: 20, paddingTop: 10, paddingBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, height: "90%" }}>
            <TouchableWithoutFeedback
                style={{ position: 'absolute', zIndex: 999, right: 10, top: 10 }}
                onPress={this.props.onClose}>
                <View style={{ padding: 5, right: 10, backgroundColor: '#e74c3c', alignSelf: 'flex-end', borderRadius: 16 }}>
                    <MaterialIcons
                        size={16}
                        name="close"
                        color="#FFFFFF"
                    />
                </View>
            </TouchableWithoutFeedback>

            <ScrollView
                style={{ backgroundColor: '#FFFFFF', borderRadius: 20, flex: 1, paddingHorizontal: 20 }}>
                <View style={{ alignSelf: 'center', paddingTop: 0 }}>
                    <Text style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.wallet.howEarnTitle}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.wallet.howGoldEarnDesc}
                </Text>

                <FlatList
                    data={this.props.actions}
                    renderItem={this.renderItem}
                    keyExtractor={this.renderKey}
                />
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({

});