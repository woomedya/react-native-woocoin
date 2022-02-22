import React, { Component } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, Dimensions, Image, ScrollView } from 'react-native';
import moment from 'moment';


import { padding } from '../constants/theme';
import i18n from '../locales';
import { numeralFormat } from '../utilities/number';
import opts from '../../config';
import * as langStore from '../store/language';


const { width, height } = Dimensions.get('window');
const paddingHorizontal = padding.paddingHorizontal.content;
const height94 = width / 9 * 5;



export default class MyOrderDetailModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            i18n: i18n(),
            visible: false,
            orderItem: null
        }

        this.giftType = langStore.getGiftType();
    }

    show = ({ orderItem }) => {
        this.setState({
            visible: true,
            orderItem
        });
    }

    hide = () => {
        this.setState({
            visible: false
        });
    }

    render() {
        let item = this.state.orderItem;

        return <Modal
            animationType="slide"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            transparent={true}
            visible={this.state.visible}
            onRequestClose={() => { }}
        >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent', width: '100%' }}>
                <TouchableWithoutFeedback onPress={this.hide}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height * 1 / 3, backgroundColor: 'transparent' }}></View>
                </TouchableWithoutFeedback>

                <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 2 / 3, backgroundColor: '#ffffff',
                    elevation: 10,
                    shadowColor: '#000000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowRadius: 10,
                    shadowOpacity: 0.8,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10
                }}>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        {
                            item ? <View style={{ padding: paddingHorizontal }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.i18n.orderModal.title}</Text>
                                </View>

                                <View style={{ padding: 5, width: '100%', alignItems: 'center', height: height94 * 0.6 }}>
                                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: item.image }} />
                                </View>

                                <View style={{ paddingTop: paddingHorizontal }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderModal.giftLabel}</Text>
                                    <Text style={{ paddingTop: 5 }}>{this.giftType[item.type]} - {item.messageLang}</Text>
                                </View>

                                <View style={{ paddingTop: paddingHorizontal }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderModal.deliveryLabel}</Text>
                                    {
                                        Object.keys(item.userInfo).map(k => {
                                            return <Text style={{ paddingTop: 5 }}>{item.userInfo[k]}</Text>
                                        })
                                    }
                                </View>

                                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: paddingHorizontal }}>
                                    <Text style={{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }}>{numeralFormat(item.woc)} {this.state.i18n.gift.woc}</Text>
                                </View>

                                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <Text style={{ paddingTop: 5 }}>{moment(item.updatedDate).format('DD.MM.YY HH:mm')}</Text>
                                </View>

                                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <Text numberOfLines={2} style={{ textAlign: 'left', color: opts.giftBackgroudColor, fontWeight: 'bold', fontSize: 16 }}>{this.state.i18n.orderStatus[item.status]}</Text>
                                </View>
                            </View> : null
                        }

                    </ScrollView>

                </View>
            </View >
        </Modal >
    }
}