import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import i18n from '../locales';
import * as userStore from '../store/user';
import * as wocAction from '../actions/woc';
import { numeralFormat } from '../utilities/number';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as wocStore from '../store/woc';
import * as cacheStore from '../store/cache';
import opts from '../../config';

const wocPng = require('../../assets/woc.png');

export default class UserWocCard extends Component {
    constructor(props) {
        super(props);

        let cache = cacheStore.getWocCard();

        this.state = {
            i18n: i18n(),
            user: userStore.getUser(),
            woc: cache.woc || 0,
            initial: cache.initial || false
        };
    }

    componentDidMount() {
        if (this.state.initial == false)
            this.refresh();

        userStore.default.addListener(userStore.USER, this.userChanged);
        wocStore.default.addListener(wocStore.WOC_CHANGED, this.wocChanged);
        cacheStore.default.addListener(cacheStore.WOC_CARD, this.cacheChanged);
    }

    componentWillUnmount() {
        userStore.default.removeListener(userStore.USER, this.userChanged);
        wocStore.default.removeListener(wocStore.WOC_CHANGED, this.wocChanged);
        cacheStore.default.removeListener(cacheStore.WOC_CARD, this.cacheChanged);
    }

    cacheChanged = () => {
        let cache = cacheStore.getWocCard();

        this.setState({
            woc: cache.woc || 0
        });
    }

    userChanged = () => {
        this.setState({
            user: userStore.getUser()
        }, this.refresh);
    }

    wocChanged = () => {
        this.refresh();
    }

    refresh = async () => {
        if (this.state.user) {
            let woc = await wocAction.getUserWoc();
            let initial = true;

            this.setState({
                woc,
                initial
            });

            cacheStore.setWocCard({
                woc,
                initial
            });
        }
    }

    openWooCoin = () => {
        this.props.navigation.navigate(opts.woocoinRouteName);
    }

    render() {
        return this.state.user ?
            <TouchableWithoutFeedback
                onPress={this.openWooCoin}>
                <View style={{ padding: 20, flexDirection: 'row', alignSelf: 'center' }}>
                    <View style={{ backgroundColor: '#FFCD44', minHeight: 40, borderRadius: 15, flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ justifyContent: 'center', paddingHorizontal: 5, paddingLeft: 20 }}>
                                <View style={{ alignSelf: 'center' }}>
                                    <Text numberOfLines={1} style={{ textAlign: 'center', color: '#4F4F4F', fontSize: 14, fontWeight: '500' }}>
                                        {this.state.user.username}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ justifyContent: 'center', paddingHorizontal: 5 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4F4F4F' }}>
                                    {numeralFormat(this.state.woc)}
                                </Text>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingRight: 20 }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Image resizeMode="contain" source={wocPng} style={{ height: 13.5, width: 22.5 }} />
                                </View>
                                <Text style={{ fontSize: 10, fontWeight: '500', color: '#4F4F4F' }}>
                                    {this.state.i18n.userWocCard.woc}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            : null
    }
}