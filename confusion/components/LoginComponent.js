import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Icon, Input, CheckBox, Button } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker, Asset, ImageManipulator } from 'expo';

import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';

// class Login extends Component {
class LoginTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {

        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true });
                }
            })

    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='sign-in'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            )
                .catch((error) => console.log('Could not save user info', error));
        }
        else {
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error));

        }
    }

    render() {
        return (
            <ScrollView>
                <View style={style.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={style.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={style.formInput}
                    />
                    <CheckBox
                        title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={style.formCheckbox}
                    />
                    <View style={style.formButton}>
                        <Button
                            onPress={() => this.handleLogin()}
                            title='Login'
                            size={24}
                            icon={<Icon name='sign-in' type='font-awesome' color='white' />}
                            buttonStyle={{ backgroundColor: "#521DA8" }}
                        />
                    </View>
                    <View style={style.formButton}>
                        <Button
                            onPress={() => this.props.navigation.navigate('Register')}
                            title='Register'
                            clear
                            size={24}
                            icon={<Icon name='user-plus' type='font-awesome' color='white' />}
                            titleStyle={{ color: 'blue' }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    };

}

class RegisterTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        }
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted'){
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing:true,
                aspect:[4,3]
            });

            if(!capturedImage.cancelled){
                // this.setState({ imageUrl: capturedImage.uri })
                this.processImage(capturedImage.uri)
            }
        }
    }

    getImageFromGallery = async () => {
        const galleryPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(galleryPermission.status === 'granted' && cameraRollPermission.status === 'granted'){
            let pickedImage = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:'All',
                allowsEditing:true,
                aspect:[4,3],
                base64 : true
            });

            if(!pickedImage.cancelled){
                // this.setState({ imageUrl: capturedImage.uri })
                this.processImage(pickedImage.uri)
            }
        }
    }


    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulate(
            imageUri,
            [
                {
                    resize: { width:400 }
                }
            ],
            { format: 'png' }
        );
        this.setState({ imageUrl: processedImage.uri })
    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='user-plus'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    handleRegister(){
        console.log(JSON.stringify(this.state));
        if(this.state.remember){
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            )
                .catch((error) => console.log('Could not save user info', error));
        }
    }


    render() {
        return (
            <ScrollView>
                <View style={style.container}>

                <View style={style.imageContainer}>
                    <Image
                        source={{uri: this.state.imageUrl}}
                        loadingIndicatorSource={require('./images/logo.png')}
                        style={style.image}
                        />
                        <Button
                        title='Camera'
                        onPress={this.getImageFromCamera}
                        />
                         <Button
                        title='Gallery'
                        onPress={this.getImageFromGallery}
                        />
                </View>

                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={style.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={style.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={style.formInput}
                    />

                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={style.formInput}
                    />

                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={style.formInput}
                    />

                    <CheckBox
                        title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={style.formCheckbox}
                    />
                    <View style={style.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title='Register'
                            size={24}
                            icon={<Icon name='user-plus' type='font-awesome' color='white' />}
                            buttonStyle={{ backgroundColor: "#521DA8" }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    };

};

const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
}, {
        tabBarOptions: {
            activeBackgroundColor: '#9575CD',
            inactiveBackgroundColor: '#D1C4E9',
            activeTintColor: 'white',
            inactiveTintColor: 'gray'
        }
    })

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    imageContainer: {
        flex:1,
        flexDirection:'row',
        margin:20,
        justifyContent: 'space-between',
    },
    image: {
        margin:10,
        width:80,
        height:60
    },
    formInput: {
        margin: 20
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: null
    },
    formButton: {
        margin: 60
    }
});

export default Login;