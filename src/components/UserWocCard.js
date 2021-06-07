import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import i18n from '../locales';
import * as userStore from '../store/user';
import * as wocAction from '../actions/woc';
import { numeralFormat } from '../utilities/number';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as wocStore from '../store/woc';
import opts from '../../config';

const wocPng = require('../../assets/woc.png');

export default class UserWocCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            i18n: i18n(),
            user: userStore.getUser(),
            woc: 0
        };

        this.request = false;
    }

    componentDidMount() {
        this.refresh();
        userStore.default.addListener(userStore.USER, this.userChanged);
        wocStore.default.addListener(wocStore.WOC_CHANGED, this.wocChanged);
    }

    componentWillUnmount() {
        userStore.default.removeListener(userStore.USER, this.userChanged);
        wocStore.default.removeListener(wocStore.WOC_CHANGED, this.wocChanged);
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
        if (this.request)
            return;

        if (this.state.user) {
            this.request = true;
            this.setState({
                woc: await wocAction.getUserWoc()
            }, () => {
                this.request = false;
            });
        }
    }

    openWooCoin = () => {
        this.refresh();
        this.props.navigation.navigate(opts.woocoinRouteName);
    }

    render() {
        return this.state.user ?
            <TouchableOpacity
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
            </TouchableOpacity>
            : null
    }
}