import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';

import i18n from '../locales';
import * as langStore from '../store/language';
import * as wocStore from '../store/woc';
import * as userApi from '../apis/user';
import { color } from '../../../../woo/react-native-woogame/src/constants/ThemeStyle';
import { Alert } from 'react-native';
import * as wocAction from '../actions/woc';


export default class WocSender extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            i18n: i18n(),
            userId: '',
            username: '',
            usernameError: false,
            woc: '',
            wocError: false,
            serverErrorMessage: '',
            loading: false,
        };

        this.loading = false;
    }

    componentDidMount() {
        langStore.default.addListener(langStore.LANG, this.langChanged);
    }

    componentWillUnmount() {
        langStore.default.removeListener(langStore.LANG, this.langChanged);
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    setUsername = (username) => {
        this.setState({
            serverErrorMessage: '',
            userId: '',
            username: (username || '').trim()
        }, this.formControl);
    }

    setWoc = (woc) => {
        this.setState({
            woc: Number((woc || '').trim().replace(/[^0-9]/g, ''))
        }, this.formControl);
    }

    buttonPress = () => {
        if (this.loading)
            return;

        if (this.state.userId)
            this.send();
        else
            this.searchUser();
    }

    searchUser = async () => {
        let state = { userId: '' };
        this.formControl();

        if (this.state.username && this.state.woc) {
            this.setLoading(true, state);

            let user = await userApi.searchByUsername(this.state.username);
            if (user) {
                state.userId = user.id;
            } else {
                state.serverErrorMessage = this.state.i18n.wocSender.notFoundUser;
            }
            this.setLoading(false, state);
        }
    }

    send = async () => {
        this.formControl();

        if (this.state.userId && this.state.woc) {
            let fee = wocStore.getSendFee(this.state.woc);
            let woc = this.state.woc + fee;

            Alert.alert(this.state.i18n.wocSender.sendTitle, this.state.i18n.wocSender.sendMessage
                .replace('$username', this.state.username)
                .replace('$woc', this.state.woc)
                .replace('$fee', fee), [
                {
                    text: woc.toString() + ' woc',
                    onPress: async () => {
                        this.setLoading(true);

                        let outcode = await wocAction.checkUserWoc(woc);

                        if (outcode) {
                            await wocAction.sendUserWoc(this.state.userId, this.state.woc, outcode);
                            await wocAction.useUserWoc(woc, outcode);

                            Alert.alert('', this.state.i18n.wocSender.sentSuccess.replace('$username', this.state.username).replace('$woc', this.state.woc));
                        } else {
                            Alert.alert('', this.state.i18n.wocSender.notEnoughWoc);
                        }

                        this.setLoading(false);
                    }
                },
                {
                    text: 'Cancel'
                }
            ]);
        }
    }

    setLoading = (loading, state) => {
        this.loading = loading;
        this.setState({
            loading,
            ...(state || {})
        });
    }

    formControl = () => {
        this.setState({
            serverErrorMessage: '',
            usernameError: !this.state.username,
            wocError: !this.state.woc,
        });
    }

    render() {
        return <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>


                <View style={{ padding: 16 }}>

                    <Text style={{ textAlign: 'left', fontSize: 14, color: '#636e72', fontWeight: '500', left: 10 }}>{this.state.i18n.wocSender.wocTitle}</Text>
                    <Input
                        containerStyle={{ paddingTop: 10 }}
                        inputStyle={{ left: 10, fontSize: 16, borderBottomWidth: 0 }}
                        inputContainerStyle={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, paddingVertical: 5, backgroundColor: '#F6F6F6' }}
                        placeholder={this.state.i18n.wocSender.woc}
                        keyboardType="numeric"
                        value={this.state.woc.toString()}
                        onChangeText={this.setWoc}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.wocError ? this.state.i18n.wocSender.enterWoc : ''}
                        onSubmitEditing={this.searchUser}
                    />
                    {
                        this.state.wocError || !this.state.woc ? null :
                            <Text style={{ textAlign: 'center', fontSize: 13, top: -15, color: '#ff7979', fontWeight: '500', left: 10 }}>
                                {this.state.i18n.wocSender.wocSendFee.replace('$woc', wocStore.getSendFee(this.state.woc))}
                            </Text>
                    }

                    <Text style={{ textAlign: 'left', fontSize: 14, color: '#636e72', fontWeight: '500', left: 10 }}>{this.state.i18n.wocSender.usernameTitle}</Text>
                    <Input
                        containerStyle={{ paddingTop: 10 }}
                        inputStyle={{ left: 10, fontSize: 16, borderBottomWidth: 0 }}
                        inputContainerStyle={{ borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, paddingVertical: 5, backgroundColor: '#F6F6F6' }}
                        placeholder={this.state.i18n.wocSender.username}
                        onChangeText={this.setUsername}
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.usernameError ? this.state.i18n.wocSender.enterUsername : ''}
                        onSubmitEditing={this.searchUser}
                    />

                    {
                        this.state.serverErrorMessage ? <Text
                            style={{ textAlign: 'center', fontSize: 14, fontWeight: '300', padding: 14, color: 'red' }}
                        >{this.state.serverErrorMessage}</Text> : null
                    }

                    <Button
                        buttonStyle={{ backgroundColor: '#38ada9', color: '#FFFFFF', borderRadius: 10, paddingVertical: 13 }}
                        titleStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        containerStyle={{ paddingHorizontal: 10, flex: 1 }}
                        title={this.state.userId ? this.state.i18n.wocSender.send : this.state.i18n.wocSender.search}
                        type="outline"
                        loading={this.state.loading}
                        loadingProps={{ color: '#FFFFFF' }}
                        onPress={this.buttonPress}
                    />

                    {
                        this.state.userId ? <View style={{ padding: 10, paddingTop: 25 }}>
                            <ListItem containerStyle={{ backgroundColor: '#dfe6e9', borderRadius: 10, flexDirection: 'column', alignItems: 'flex-start' }} >
                                <ListItem.Title style={{ color: '#636e72', fontSize: 14, fontWeight: '400', textAlign: 'left' }}>
                                    {this.state.i18n.wocSender.sendingToUsername}
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold' }}> {this.state.username}</Text>
                                </ListItem.Title>
                                <ListItem.Subtitle Title style={{ color: '#636e72', fontSize: 14, fontWeight: '400' }}>
                                    {this.state.i18n.wocSender.payValue}
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold' }}> {this.state.woc}</Text>
                                </ListItem.Subtitle>
                            </ListItem>
                        </View> : null
                    }


                </View>
            </ScrollView>

        </KeyboardAvoidingView>;
    }
}

const styles = StyleSheet.create({

});