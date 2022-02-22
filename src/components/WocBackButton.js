import React, { Component } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as pageStore from '../store/page';
import { WUBackButton } from 'react-native-woomobileuser';
import * as userStore from '../store/user';


export default class WocBackButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: userStore.getUser()
        }
    }

    componentDidMount() {
        userStore.default.addListener(userStore.USER, this.userChanged);
    }

    componentWillUnmount() {
        userStore.default.removeListener(userStore.USER, this.userChanged);
    }

    userChanged = () => {
        this.setState({
            user: userStore.getUser()
        });
    }

    goBack = () => {
        var page = pageStore.backPage();
        if (page == null)
            this.props.navigation.goBack();
    }

    render() {
        return this.state.user ? <MaterialIcon
            name="keyboard-backspace"
            size={this.props.size || 30}
            color={this.props.color || 'white'}
            height={30}
            onPress={this.goBack}
        /> : <WUBackButton size={this.props.size} color={this.props.color} navigation={this.props.navigation} />
    }
}