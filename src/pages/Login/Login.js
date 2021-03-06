import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback, StyleSheet,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IMAGE } from '../../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import { connect } from 'react-redux';
import { authenticate, resetError,resetRehabFlag } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const mapStateToProps = state => ({
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
            visible: false
        }
    }

    componentDidMount(){
        this.props.resetError();
        this.props.resetRehabFlag();
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
        this.setState({ visible: true })
        try {
            await this.props.authenticate(this.state.email, this.state.password); 
                       
            this.props.navigation.navigate('Main')
            this.setState({ visible: false })
        }
        catch (err) {
            console.log(err.message)
            Alert.alert('Alert',err.message, [{text:'OK' ,onPress:()=> this.setState({ visible: false })}])
        }
    }

    render() {
        const { visible } = this.state
        return (
            <View style={styles.app}>
                <AnimatedLoader
                    visible={visible}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require('../../constans/loader.json')}
                    animationStyle={styles.lottie}
                    speed={2}
                />
                <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                    <KeyboardAvoidingView behavior="padding">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.container}>
                                <View>
                                    <Image source={IMAGE.ICON_LOGO} style={styles.logo} />
                                </View>
                                <View style={styles.infoContainer}>
                                    <TextInput
                                        onChangeText={this.onChangeMail}
                                        clearButtonMode={'always'}
                                        style={styles.input}
                                        placeholder={'Email'}
                                        placeholderTextColor={'#463F3A'}
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        autoCorrect={true}
                                        value={this.state.email}
                                        onSubmitEditing={() => this.refs.txtPassword.focus()}
                                    />
                                    <TextInput
                                        onChangeText={this.onChangePassword}
                                        clearButtonMode={'always'}
                                        style={styles.input}
                                        placeholder={'Password'}
                                        placeholderTextColor={'#463F3A'}
                                        returnKeyType="go"
                                        secureTextEntry
                                        autoCorrect={false}
                                        ref={'Go'}
                                        value={this.state.password}
                                        onSubmitEditing={this.login}
                                    />
                                    <TouchableOpacity
                                        style={styles.buttonContainer}
                                        ref={'Go'}
                                        onPress={this.login}>
                                        <Text style={styles.buttonText}>SIGN IN</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </LinearGradient>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        flexDirection: 'column',
    },
    gradient: {
        flex: 1
    },
    lottie: {
        width: wp('10%'),
        height: hp('10%'),
    },
    container: {
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
        top: hp('24%'),
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
        width: wp('80%'),
        height: hp('6%'),
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
    { authenticate, resetError,resetRehabFlag }
)(Login);