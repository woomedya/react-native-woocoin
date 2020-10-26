import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import i18n from '../locales';
import * as langStore from '../store/language';
import * as pageStore from '../store/page';
import WUPage from 'react-native-woomobileuser';
import * as userStore from '../store/user';
import WalletPage from '../components/WalletPage';

export default class WocPage extends Component {
    constructor(props) {
        super(props)
        this.props = props;

        this.state = {
            i18n: i18n(),
            page: pageStore.getPage(),
            user: userStore.getUser()
        };
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

    render() {
        return this.state.user ? <WalletPage /> : <WUPage
            wellcome={this.state.i18n.wellcome}
            description={this.state.i18n.description} />;
    }
}

const styles = StyleSheet.create({

});