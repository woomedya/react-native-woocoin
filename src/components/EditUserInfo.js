import React, { Component } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';


import { padding } from '../constants/theme';
import * as userStore from '../store/user';
import i18n from '../locales';
import * as userApi from '../apis/user';
import opts from '../../config';
import * as pageStore from '../store/page';


const paddingHorizontal = padding.paddingHorizontal.content;



export default class EditUserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            i18n: i18n(),
            refreshing: false
        }

        this.userInfo = null;
    }

    saveUserInfo = async () => {
        this.setState({
            refreshing: true
        }, async () => {
            let userId = userStore.getUserId();
            let info = this.userInfo && this.userInfo.getUserInfo();

            if (info) {
                await userApi.setUserInfo(userId, info);
                userStore.setUserInfo(info);
            }

            this.setState({
                refreshing: false
            }, () => {
                if (info) {
                    pageStore.backPage();
                } else {
                    Alert.alert("", this.state.i18n.gift.missingUserInfo);
                }
            });
        });
    }

    render() {
        return <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', padding: paddingHorizontal, paddingTop: 0 }}>

                {
                    opts.UserInfoComponent ? <opts.UserInfoComponent ref={r => this.userInfo = r} /> : null
                }

                <View style={{ flexDirection: 'row', width: '100%', paddingTop: paddingHorizontal * 2 }}>
                    <Button
                        containerStyle={{ padding: 0, backgroundColor: '#e74c3c', width: '100%', paddingVertical: 0 }}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            borderRadius: 0, paddingVertical: 10, paddingHorizontal: 15,
                        }}
                        titleStyle={{ color: '#ffffff', fontSize: 14 }}
                        loading={this.state.refreshing}
                        title={this.state.i18n.editUserInfo.saveButtonTitle}
                        onPress={this.saveUserInfo}
                    />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    }
}