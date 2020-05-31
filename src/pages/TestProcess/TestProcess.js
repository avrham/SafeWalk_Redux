import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    Image,
    StyleSheet,
    Animated,
} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import config from '../../../config.json';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';

const mapStateToProps = state => ({
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
});

export class TestProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            shouldRenderTestProcessPage: true,
            shouldStand: true,
            shouldWalk: false,
            testFinished: false,
            abnormality: false,
            errMessage: ''
        }
    }

    componentDidMount() {
        this.StartTestHandler();
    }

    StartTestHandler = async () => {
        let testID, timeout;
        const token = this.props.userToken;
        try {
            const { IPs } = await this.getKitDetails(token);
            const test = await this.createTest(token);
            testID = test.id;
            let promise1; // promise2, promise3, promise4, promise5, promise6, promise7;
            this.setState({ visible: false });
            timeout = setTimeout(() => {
                this.setState({
                    shouldStand: false,
                    shouldWalk: true,
                });
            }, 5000);
            promise1 = this.scanGaitAndAnalyze(IPs.sensor1, 'sensor1', token, testID);
            // promise2 = this.scanGaitAndAnalyze(IPs.sensor2, 'sensor2', token, testID);
            // promise3 = this.scanGaitAndAnalyze(IPs.sensor3, 'sensor3', token, testID);
            // promise4 = this.scanGaitAndAnalyze(IPs.sensor4, 'sensor4', token, testID);
            // promise5 = this.scanGaitAndAnalyze(IPs.sensor5, 'sensor5', token, testID);
            // promise6 = this.scanGaitAndAnalyze(IPs.sensor6, 'sensor6', token, testID);
            // promise7 = this.scanGaitAndAnalyze(IPs.sensor7, 'sensor7', token, testID);
            // const conclusions = await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]);
            const conclusions = await Promise.all([promise1]);
            let abnormality = false,
                waitingStatus = false;
            for (let conclusion of conclusions)
                if (conclusion.failureObserved) {
                    abnormality = true;
                    waitingStatus = true;
                    break;
                }
            await this.updateTest(token, testID, abnormality);
            await this.updatePatient(
                token,
                this.props.patienDetailes.id,
                waitingStatus,
            );
            this.setState({
                visible: false,
                testFinished: true,
                abnormality: abnormality,
            });
        } catch (err) {
            clearTimeout(timeout);
            this.setState({
                visible: false,
                shouldRenderTestProcessPage: false,
                testFinished: true,
                errorMessage: err.message,
            });
            // alert(err.message);
            if (testID) this.removeTest(token, testID);
        }
    };

    getKitDetails(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                };
                const response = await axios.get(
                    `${config.SERVER_URL}/sensorsKit/${
                    this.props.patienDetailes.sensorsKitID
                    }`,
                    options,
                );
                
                return resolve(response.data);
            } catch (ex) {
                console.log(ex)
                return reject(new Error(ex.response.data.message));
            }
        });
    }

    createTest(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const options = {
                    headers: { 'x-auth-token': token },
                };
                const response = await axios.post(
                    `${config.SERVER_URL}/test`,
                    null,
                    options,
                );
                return resolve(response.data);
            } catch (ex) {
                return reject(new Error(ex.response.data.message));
            }
        });
    }

    scanGaitAndAnalyze(ip, sensorName, token, testID) {
        return new Promise(async (resolve, reject) => {
            try {
                const options = { timeout: 1500 };
                const response = await axios.get(`http://${ip}`, options);
                try {
                    const stringLength = response.data.length;
                    let output;
                    if (response.data[stringLength - 2] === ',')
                        output =
                            response.data.slice(0, stringLength - 2) +
                            response.data.slice(stringLength - 1, stringLength);
                    output = JSON.parse(output);
                    return resolve(this.analayseData(token, output, sensorName, testID));
                } catch (ex) {
                    return reject(
                        new Error(
                            `${sensorName} has failed during the sample, please make another test`,
                        ),
                    );
                }
            } catch (ex) {
                return reject(
                    new Error(
                        `${sensorName} has failed during the sample, please make another test`,
                    ),
                );
            }
        });
    }

    analayseData(token, rawData, sensorName, testID) {
        return new Promise(async (resolve, reject) => {
            if (!this.state.visible) this.setState({ visible: true });
            try {
                const body = {
                    sensorName: sensorName,
                    rawData: rawData,
                    testID: testID,
                };
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                };
                const response = await axios.post(
                    `${config.SERVER_URL}/sensorsKit/${this.props.patienDetailes.sensorsKitID}/analyzeRawData`,
                    body,
                    options,
                );
                return resolve(response.data);
            } catch (ex) {
                return reject(new Error(ex.response.data.message));
            }
        });
    }

    updateTest(token, testID, abnormality) {
        return new Promise(async (resolve, reject) => {
            try {
                const body = { abnormality: abnormality };
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                };
                const response = await axios.put(
                    `${config.SERVER_URL}/test/${testID}`,
                    body,
                    options,
                );
                return resolve(response.data);
            } catch (ex) {
                return reject(new Error(ex.response.data.message));
            }
        });
    }

    updatePatient(token, patientID, waitingStatus) {
        return new Promise(async (resolve, reject) => {
            try {
                const body = { waitForPlan: waitingStatus };
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                };
                const response = await axios.put(
                    `${config.SERVER_URL}/patient/${patientID}`,
                    body,
                    options,
                );
                return resolve(response.data);
            } catch (ex) {
                return reject(new Error(ex.response.data.message));
            }
        });
    }

    renderTestProcess() {
        const { visible } = this.state;
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                    <AnimatedLoader
                        visible={visible}
                        overlayColor="rgba(255,255,255,0.75)"
                        source={require('../../constans/loader.json')}
                        animationStyle={styles.lottie}
                        speed={2}
                    />
                    <View style={styles.background}>
                        {this.state.shouldStand && this.state.visible && (
                            <View>
                                <Text style={styles.processTitle}>
                                    Please stand in place for 5 seconds
                                </Text>
                                <View style={styles.CircleTimer}>
                                    <CountdownCircleTimer
                                        isPlaying={false}
                                        duration={5}
                                        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                                        {({ remainingTime, animatedColor }) => (
                                            <Animated.Text
                                                style={{
                                                    ...styles.remainingTime,
                                                    color: animatedColor,
                                                    fontSize: wp('25%'),
                                                }}>
                                                {remainingTime}
                                            </Animated.Text>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                            </View>
                        )}
                        {this.state.shouldStand && !this.state.visible && (
                            <View>
                                <Text style={styles.processTitle}>
                                    Please stand in place for 5 seconds
                                </Text>
                                <View style={styles.CircleTimer}>
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={5}
                                        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                                        {({ remainingTime, animatedColor }) => (
                                            <Animated.Text
                                                style={{
                                                    ...styles.remainingTime,
                                                    color: animatedColor,
                                                    fontSize: wp('25%'),
                                                }}>
                                                {remainingTime}
                                            </Animated.Text>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                            </View>
                        )}
                        {this.state.shouldWalk && !this.state.visible && (
                            <View>
                                <Text style={styles.processTitle}>
                                    Pleast start walking in a straight line for 15 seconds
                                </Text>
                                <View style={styles.CircleTimer}>
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={15}
                                        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                                        {({ remainingTime, animatedColor }) => (
                                            <Animated.Text
                                                style={{
                                                    ...styles.remainingTime,
                                                    color: animatedColor,
                                                    fontSize: wp('25%'),
                                                }}>
                                                {remainingTime}
                                            </Animated.Text>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    renderTestResults() {
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>

                <SafeAreaView style={styles.app}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {this.state.abnormality ? (
                            <SafeAreaView style={styles.SafeAreaAlert}>
                                <View style={styles.viewAlert}>
                                    <Image
                                        source={IMAGE.ICOM_ALERT}
                                        style={styles.alertImg}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.message}>
                                        Walking model might have problem !
                                    </Text>
                                    <Text style={styles.message}>
                                        Your test results were sent to the main lab
                                    </Text>
                                    <Text style={styles.message}>
                                        Rehabilitation program will be sent as soon as possible
                                    </Text>
                                </View>
                            </SafeAreaView>
                        ) : (
                                <SafeAreaView style={styles.SafeAreaAlert}>
                                    <View style={styles.viewAlert}>
                                        <Image
                                            source={IMAGE.ICON_TESTOK}
                                            style={styles.alertImg}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.message}>
                                            We're happy to let you know that your Walking model is ok and
                                            not might have problem !
                                        </Text>
                                    </View>
                                </SafeAreaView>
                            )}

                        <Button
                            style={styles.BackButton}
                            onPress={() => this.setState({ shouldRenderTestProcessPage: false })}
                            title="Back Home"
                            type="outline"
                        //containerStyle={{color: 'black'}}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    render() {
        if (this.state.shouldRenderTestProcessPage && !this.state.testFinished)
            return this.renderTestProcess();

        if (this.state.shouldRenderTestProcessPage && this.state.testFinished)
            return this.renderTestResults();

        if (this.state.errMessage)
            return Alert.alert(this, state.errMessage);
    }
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    app: {
        flex: 1,
        backgroundColor: '#BBBBBB',
    },
    viewAlert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: wp('6%'),
        fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: wp('5%'),
    },
    alertImg: {
        width: wp('10%'),
        height: hp('10%'),
        marginBottom: hp('7%'),
    },
    SafeAreaAlert: {
        flex: 1,
    },
    lottie: {
        width: wp('55%'),
        height: hp('10%'),
    },
    CircleTimer: {
        top: hp('30%'),
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#8A817C'
    },
    BackButton: {
        marginBottom: hp('5%'),
        textAlign: 'center',
        justifyContent: 'center',
        borderColor: '#5D8B91',
        borderRadius: 5,
        width: wp('63%'),
        height: hp('6%'),
        alignItems: 'center',
    },
    BackBtnTitle: {
        fontSize: wp('5.5%'),
        color: '#5D8B91',
        backgroundColor: '#5D8B91',
    },

});


export default connect(
    mapStateToProps,
    {  }
)(TestProcess);