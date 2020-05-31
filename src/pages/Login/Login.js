import React, { Component } from 'react';
import {  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IMAGE} from '../../constans/Image';

import { connect } from 'react-redux';
import { authenticate, resetError } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const mapStateToProps = state => ({
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
    errMessage: state.login.errMessage
});

export class Login extends Component {
    constructor(props) {
        super(props);
        this.onChangeMail = this.onChangeMail.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.login = this.login.bind(this)
        this.state = {
            email: '',
            password: '',
            visible:false
        }
    }


    componentDidUpdate() {
        this.props.resetError();
    }

    onChangeMail = (email) => {
        this.setState({ email: email })
    }

    onChangePassword = (password) => {
        this.setState({ password: password })
    }

    login = async () => {
        this.setState({ visible: true})
        try{
            await this.props.authenticate(this.state.email, this.state.password);
            this.props.navigation.navigate('Main')
            this.setState({ visible: false})
        }
        catch{
            alert('Error server');
        }
    }

    render() {
        this.props.errMessage ? alert(this.props.errMessage) : null;
        return (
            <View style={styles.app}>
                <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                    <View style={styles.infoContainer}>
                        <TextInput
                            onChangeText={this.onChangeMail}
                            clearButtonMode={'always'}
                            style={styles.input}
                            placeholder={'Enter Email'}
                            placeholderTextColor={'rgba(255,255,255,0.8)'}
                            keyboardType="email-address"
                            returnKeyType="next"
                            autoCorrect={true}
                            value={this.state.email}
                        />
                        <TextInput
                            onChangeText={this.onChangePassword}
                            clearButtonMode={'always'}
                            style={styles.input}
                            placeholder={'Enter Password'}
                            placeholderTextColor={'rgba(255,255,255,0.8)'}
                            returnKeyType="go"
                            secureTextEntry
                            autoCorrect={false}
                            value={this.state.password}
                        />
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={this.login}>
                            <Text style={styles.buttonText}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    app_background: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    app: {
        flex: 1,
        backgroundColor: '#BBBBBB',
        flexDirection: 'column',
    },
    lottie: {
        width: wp('10%'),
        height: hp('10%'),
    },
    loader: {
        position: 'absolute',
        top: Dimensions.get('window').height * 0.565,
        width: 50,
        height: 50,
        opacity: 0.5,
    },

    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        top: hp('20%'),
        width: wp('55%'),
        height: hp('10%'),
    },
    infoContainer: {
        left: 0,
        right: 0,
        bottom: 0,
        top: hp('30%'),
        padding: 20,
    },
    input: {
        height: hp('5%'),
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 6,
        borderWidth: 0.5,
        fontSize: wp('4%'),
    },

    buttonContainer: {
        backgroundColor: '#8A817C',
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').height * 0.058,
        borderRadius: 9,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#F4F3EE',
        fontSize: 19,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default connect(
    mapStateToProps,
    { authenticate, resetError }
)(Login);