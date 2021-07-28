import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import i18n from '../locales';
import * as userStore from '../store/user';
import * as cacheStore from '../store/cache';


const wocPng = require('../../assets/woc.png');

export default class InvitePage extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        let cache = cacheStore.getWalletPage();

        this.state = {
            i18n: i18n(),
            user: userStore.getUser(),
            inviteWocGift: cache.inviteWocGift || 0
        };
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

    render() {
        return <ScrollView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            <View style={{ padding: 16 }}>

                <View style={{ alignSelf: 'center', paddingTop: 0 }}>
                    <Text style={{ textAlign: 'center', color: '#353b48', fontSize: 24, fontWeight: '500' }}>
                        {this.state.i18n.invite.invitationQR}
                    </Text>
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.invite.inviteFriends}
                </Text>

                <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'center' }}>
                    <QRCode
                        value={this.state.user.id}
                        size={Dimensions.get('window').width - 150}
                        color='#f19066'
                    />
                </View>

                <Text style={{ paddingTop: 15, fontSize: 14, textAlign: 'center', color: '#4F4F4F', fontWeight: '300' }}>
                    {this.state.i18n.invite.howToWork}
                </Text>

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
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({

});