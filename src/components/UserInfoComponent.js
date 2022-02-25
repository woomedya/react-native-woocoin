import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Input } from 'react-native-elements';


import { padding } from '../constants/theme';
import * as userStore from '../store/user';
import i18n from '../locales';
import * as userAction from '../actions/user';


const paddingHorizontal = padding.paddingHorizontal.content;


export default class EditUserInfo extends Component {
    constructor(props) {
        super(props);

        let info = userStore.getUserInfo() || {};

        this.state = {
            i18n: i18n(),
            fullname: info.fullname || '',
            tcno: info.tcno || '',
            iban: info.iban || '',
            refreshing: false
        }
    }

    componentDidMount() {
        userStore.userInfoStore.addListener(userStore.USER_INFO, this.userInfoChanged);

        userAction.getUserInfo();
    }

    componentWillUnmount() {
        userStore.userInfoStore.removeListener(userStore.USER_INFO, this.userInfoChanged);
    }

    userInfoChanged = () => {
        let info = userStore.getUserInfo() || {};

        this.setState({
            fullname: info.fullname || '',
            tcno: info.tcno || '',
            iban: info.iban || '',
        });
    }

    fullnameChanged = (fullname) => {
        this.setState({
            fullname
        });
    }

    tcnoChanged = (tcno) => {
        this.setState({
            tcno
        });
    }

    ibanChanged = (iban) => {
        this.setState({
            iban
        });
    }

    getUserInfo = () => {
        let info = {
            fullname: (this.state.fullname || '').trim(),
            tcno: (this.state.tcno || '').trim(),
            iban: (this.state.iban || '').trim()
        };

        return info.fullname && info.tcno && info.iban ? info : null;
    }

    render() {

        return <View>
            <View style={{ flexDirection: 'row', width: '100%', paddingTop: paddingHorizontal * 2 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingLeft: paddingHorizontal / 2, paddingBottom: 5, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14 }}>{this.state.i18n.editUserInfo.fullname}</Text><Text style={{ fontSize: 14, color: '#e74c3c' }}>*</Text>
                    </View>
                    <Input
                        style={{ fontSize: 14 }}
                        containerStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: '#e74c3c', height: 35 }}
                        inputContainerStyle={{ paddingLeft: paddingHorizontal / 2, borderBottomColor: 'transparent', backgroundColor: '#dfe6e9', height: 35 }}
                        placeholder={this.state.i18n.editUserInfo.fullnamePlaceholder}
                        value={this.state.fullname}
                        onChangeText={this.fullnameChanged}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', paddingTop: paddingHorizontal * 2 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingLeft: paddingHorizontal / 2, paddingBottom: 5, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14 }}>{this.state.i18n.editUserInfo.tcno}</Text><Text style={{ fontSize: 14, color: '#e74c3c' }}>*</Text>
                    </View>
                    <Input
                        style={{ fontSize: 14 }}
                        containerStyle={{ paddingLeft: 0, paddingRight: 0, height: 35, backgroundColor: '#e74c3c' }}
                        inputContainerStyle={{ paddingLeft: paddingHorizontal / 2, borderBottomColor: 'transparent', backgroundColor: '#dfe6e9', height: 35 }}
                        placeholder={this.state.i18n.editUserInfo.tcnoPlaceholder}
                        value={this.state.tcno}
                        onChangeText={this.tcnoChanged}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', paddingTop: paddingHorizontal * 2 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingLeft: paddingHorizontal / 2, paddingBottom: 5, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14 }}>{this.state.i18n.editUserInfo.iban}</Text><Text style={{ fontSize: 14, color: '#e74c3c' }}>*</Text>
                    </View>
                    <Input
                        style={{ fontSize: 14 }}
                        containerStyle={{ paddingLeft: 0, paddingRight: 0, height: 35, backgroundColor: '#e74c3c' }}
                        inputContainerStyle={{ paddingLeft: paddingHorizontal / 2, borderBottomColor: 'transparent', backgroundColor: '#dfe6e9', height: 35 }}
                        placeholder={this.state.i18n.editUserInfo.ibanPlaceholder}
                        value={this.state.iban}
                        onChangeText={this.ibanChanged}
                    />
                </View>
            </View>
        </View>
    }
}