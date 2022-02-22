import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import WUPage from 'react-native-woomobileuser';


import i18n from '../locales';
import * as langStore from '../store/language';
import * as pageStore from '../store/page';
import * as userStore from '../store/user';
import WalletPage from '../components/WalletPage';
import WocSenderPage from '../components/WocSender';
import InvitePage from '../components/InvitePage';
import Gift from '../components/Gift';
import MyOrders from '../components/MyOrders';
import EditUserInfo from '../components/EditUserInfo';



export default class WocPage extends Component {
    constructor(props) {
        super(props)
        this.props = props;

        this.state = {
            i18n: i18n(),
            page: pageStore.getPage(),
            user: userStore.getUser()
        };

        this.wallet = null;
    }

    componentDidMount() {
        userStore.default.addListener(userStore.USER, this.userChanged);
        langStore.default.addListener(langStore.LANG, this.langChanged);
        pageStore.default.addListener(pageStore.PAGE, this.pageChanged);
    }

    componentWillUnmount() {
        userStore.default.removeListener(userStore.USER, this.userChanged);
        langStore.default.removeListener(langStore.LANG, this.langChanged);
        pageStore.default.removeListener(pageStore.PAGE, this.pageChanged);
    }

    userChanged = () => {
        this.setState({
            user: userStore.getUser()
        });
    }

    pageChanged = (value) => {
        this.setState({
            page: pageStore.getPage()
        });
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    showInfo = () => {
        this.wallet && this.wallet.showInfo();
    }

    showMyOrders = () => {
        pageStore.setPage(pageStore.PAGE_MY_ORDERS);
    }

    render() {
        var page = this.state.page;
        return this.state.user ?
            (page == pageStore.PAGE_WALLET ? <WalletPage ref={r => this.wallet = r} /> :
                page == pageStore.PAGE_SENDER ? <WocSenderPage /> :
                    page == pageStore.PAGE_INVITE ? <InvitePage /> :
                        page == pageStore.PAGE_GIFT ? <Gift /> :
                            page == pageStore.PAGE_MY_ORDERS ? <MyOrders /> :
                                page == pageStore.PAGE_EDIT_USER_INFO ? <EditUserInfo /> : null)
            : <WUPage
                wellcome={this.state.i18n.wellcome}
                description={this.state.i18n.description} />
    }
}

const styles = StyleSheet.create({

});