import React, { Component } from 'react';
import { FlatList, View, Text, Dimensions, Image, TouchableWithoutFeedback, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';


import { padding } from '../constants/theme';
import * as userStore from '../store/user';
import * as langStore from '../store/language';
import i18n from '../locales';
import { numeralFormat } from '../utilities/number';
import * as giftApi from '../apis/gift';
import opts from '../../config';
import MyOrderDetailModal from './MyOrderDetailModal';
import { ORDER_STATUS } from '../constants/gift';


const { width } = Dimensions.get('window');
const paddingHorizontal = padding.paddingHorizontal.content;
const height94 = width / 9 * 5;



export default class MyOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            i18n: i18n(),
            refreshing: true,
            orders: []
        }

        this.giftType = langStore.getGiftType();
        this.orderModal = null;
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({
            refreshing: true
        }, async () => {
            let userId = userStore.getUserId();
            let orders = await giftApi.getMyOrders(userId);

            this.setState({
                orders,
                refreshing: false
            });
        });
    }

    showMyOrderDetail = (item) => {
        this.orderModal.show({ orderItem: item });
    }

    orderKey = (item) => {
        return item.key;
    }

    renderOrder = ({ item, index }) => {
        let statusColor = item.status == ORDER_STATUS.PREPARE ? '#778beb' : item.status == ORDER_STATUS.SHIP ? '#f19066' : '#38ada9';

        return <View style={{ padding: paddingHorizontal, paddingTop: index > 0 ? 0 : paddingHorizontal }}>
            <TouchableWithoutFeedback onPress={() => this.showMyOrderDetail(item)}>
                <View style={{ borderWidth: 1, borderColor: '#ecf0f1', backgroundColor: '#ecf0f1', height: height94 }}>
                    <View style={{ position: 'absolute', zIndex: 100, top: 0, padding: 5, width: '100%', alignItems: 'center', height: height94 * 0.6 }}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: item.image }} />
                    </View>
                    <View style={{ position: 'absolute', zIndex: 200, bottom: 0, width: '100%', height: height94 * 0.4, justifyContent: 'flex-end' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, padding: paddingHorizontal }}>
                                <Text style={{ color: opts.giftBackgroudColor, fontWeight: 'bold', fontSize: 18 }}>{this.giftType[item.type]}</Text>
                                <Text numberOfLines={2} style={{}}>{item.messageLang}</Text>
                            </View>
                            <View style={{ flex: 1, padding: paddingHorizontal, paddingLeft: 0, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text numberOfLines={1} style={{ textAlign: 'left', fontSize: 12 }}>{numeralFormat(item.woc)} {this.state.i18n.gift.woc}</Text>
                                <Text numberOfLines={1} style={{ textAlign: 'left', fontSize: 12 }}>{moment(item.updatedDate).format('DD.MM.YY HH:mm')}</Text>
                                <Text numberOfLines={2} style={{ textAlign: 'left', color: statusColor, fontWeight: 'bold', fontSize: 12 }}>{this.state.i18n.orderStatus[item.status]}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    }

    renderEmptyOrders = () => {
        return this.state.refreshing ? null : <View style={{ alignItems: 'center', paddingHorizontal, paddingTop: paddingHorizontal }}>
            <Text style={{ color: '#636e72', fontSize: 14 }}>{this.state.i18n.myOrders.noOrders}</Text>
        </View>
    }

    render() {
        return <ScrollView
            style={{ backgroundColor: '#FFFFFF', flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                    colors={["#bdc3c7", "#ecf0f1"]} />
            }>
            <FlatList
                style={{ backgroundColor: '#ffffff', flex: 1 }}
                ListHeaderComponentStyle={{ paddingBottom: paddingHorizontal }}
                data={this.state.orders}
                renderItem={this.renderOrder}
                initialNumToRender={10}
                keyExtractor={this.orderKey}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={this.renderEmptyOrders()}
            />

            <MyOrderDetailModal ref={r => this.orderModal = r} />
        </ScrollView>
    }
}