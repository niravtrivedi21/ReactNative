import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert, ToastAndroid } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

import * as Animatable from 'react-native-animatable';

import { Permissions, Notifications, Calendar } from 'expo'


class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {

        title: 'Reserve Table'

    }

    toggaleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    obtainCalendarPermission = async () => {
        // const calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);

        // if (calendarPermission.status === 'granted') {
        //     return true;
        // }
        // else {
        //     return false;
        // }
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if(permission.status !== "granted") {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert("Permission not granted to add event to calendar");
            }
        }
        return permission;

    }

    addReservationToCalendar = async () => {
        //const calendarPer = 
        await this.obtainCalendarPermission();
        // ToastAndroid.show('CalendarPermission!' + calendarPer,ToastAndroid.LONG);
       // if (calendarPer) {
            // setTimeout(() => {
            //     const startDate = new Date(Date.parse(this.state.date));
            //     ToastAndroid.show('CalendarPermission! start' + startDate, ToastAndroid.LONG);

            // }, 1000);

            // setTimeout(() => {
            //     const endDate = new Date(Date.parse(startDate) + Date.parse(2 * 60 * 60 * 1000));
            //     ToastAndroid.show('CalendarPermission! end' + endDate, ToastAndroid.LONG);

            // }, 3000);


           Calendar.createEventAsync(Calendar.DEFAULT, {
                title: 'Con Fusion Table Reservation',
                startDate: new Date(Date.parse(this.state.date)),
                endDate: new Date(Date.parse(this.state.date) + 2 * 60 * 60 * 1000),
                timeZone: 'Asia/Hong_Kong',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'

            })
            .then(event => {
                this.resetForm();
                console.log('success', event);
            })
            .catch(error => {
                console.log('failure', error);
            });
           
            

        // }
        // else {
        //     ToastAndroid.show('CalendarPermission! else' + calendarPer, ToastAndroid.LONG);
        // }
    }

    handleReservation() {
        // console.log(JSON.stringify(this.state));
        // this.toggaleModal();
        // this.setState({
        //     guests:1,
        //     smoking:false,
        //     date:''

        // });

        Alert.alert(
            'Your Reservation OK?',
            'Number Of Guests:' + this.state.guests + '\n'
            + 'Smoking?' + this.state.smoking + '\n' +
            'Date and Time :' + this.state.date,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => this.addReservationToCalendar(),
                    // {
                    //     this.presentLocalNotification(this.state.date);
                    //     this.resetForm();
                    // },
                    style: 'cancel'
                }

            ],
            { cancelable: false }
        );

    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''

        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    render() {

        return (
            <ScrollView>

                <Animatable.View animation="zoomIn" duration={2000}>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Number of Guests
                    </Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />

                        </Picker>

                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Smoking/Non-Smoking?
                        </Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({ smoking: value })}
                        >

                        </Switch>
                    </View>

                    <View style={styles.formRow}>

                        <Text style={styles.formLabel}>
                            Date and Time
                        </Text>
                        <DatePicker
                            style={{ flex: 2, marginRight: 20 }}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='select date and time'
                            minDate='2017-01-01'
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>

                    <View style={styles.formRow}>
                        <Button
                            title='Reserve'
                            color='#512DA8'
                            onPress={() => this.handleReservation()}
                            accessibilityLabel='Learn more about this purple button'

                        />
                    </View>

                </Animatable.View>

                {/* <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        onDismiss={() => { this.toggaleModal(); this.resetForm() }}
                        onRequestClose={() => { this.toggaleModal(); this.resetForm() }} >
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Your Reservation</Text>
                            <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style={styles.modalText}>Smoking? : {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>
                            <Button
                                onPress={() => { this.toggaleModal(); this.resetForm() }}
                                color='#512DA8'
                                title='Close'
                            />
                        </View>
                    </Modal> */}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default Reservation;
