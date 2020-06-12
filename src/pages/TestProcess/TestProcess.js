import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    Image,
    StyleSheet,
    Animated,
    Alert
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
import CustomHeader from '../../components/CustomHeader'
import {IMAGE} from '../../constans/Image'


const mapStateToProps = state => ({
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
});

export class TestProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            waiting:true,
            inProcess:false,
            result:false,
            shouldStand: true,
            shouldWalk: false,
            abnormality: false,
            errorMessage: ''
        }
    }

    async componentDidMount() {
        let testID, timeout;
        const token = this.props.userToken;
        try {
            const { IPs } = await this.getKitDetails(token);
            const test = await this.createTest(token);
            testID = test.id;
            let promise1, promise2; // promise3, promise4, promise5, promise6, promise7;
            this.setState({ visible: false, waiting: false, inProcess: true });
            timeout = setTimeout(() => {
                this.setState({
                    shouldStand: false,
                    shouldWalk: true,
                });
            }, 5000);
            promise1 = this.scanGaitAndAnalyze(IPs.sensor1, 'sensor1', token, testID);
            //promise2 = this.scanGaitAndAnalyze(IPs.sensor2, 'sensor2', token, testID);
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
            let overview = `Patient's gait cycle has been tested and found to be ok.`;
            if (abnormality) {
                overview = `Deviation in patient's walk has been detected in the following sensors: `;
                for (let index = 0; index < conclusions.length; index++)
                    if (conclusions[index].failureObserved)
                        overview += `Sensor ${index + 1}, `;
                overview = overview.substring(0, overview.length - 2);
            }
            await this.updateTest(token, testID, abnormality, overview);
            await this.updatePatient(
                token,
                this.props.patienDetailes.id,
                waitingStatus,
            );
            this.setState({
                visible: false,
                inProcess: false,
                result: true,
                abnormality: abnormality,
            });
        } catch (err) {
            if (testID)
                await this.removeTest(token, testID);
            clearTimeout(timeout);
            this.setState({
                errorMessage: err.message,
            });
            Alert.alert('Alert', err.message, [{ text: 'Cancel', onPress: () => this.props.navigation.navigate('Main') }])
            console.log(err.message);
        }
    }

    async removeTest(token, testID) {
        try {
          const options = {
            headers: {'x-auth-token': token},
          };
          await axios.delete(`${config.SERVER_URL}/test/${testID}`, options);
          return;
        } catch (ex) {
          return;
        }
      }

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
                this.setState({ visible: true });
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
                const body = { abnormality, overview };
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

    renderWaiting() {
        const { visible } = this.state;
        //this.state.errorMessage ? alert(this.state.errorMessage) : null;
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                <CustomHeader navigation={this.props.navigation} isTestProcess={true} />
                    <AnimatedLoader
                        visible={visible}
                        overlayColor="rgba(255,255,255,0.75)"
                        source={require('../../constans/loader.json')}
                        animationStyle={styles.lottie}
                        speed={2}
                    />
                    <View style={styles.background}>
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
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    renderTestProcess() {
        const { visible } = this.state;
        //this.state.errorMessage ? alert(this.state.errorMessage) : null;
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                <CustomHeader navigation={this.props.navigation} isTestProcess={true} />
                    <AnimatedLoader
                        visible={visible}
                        overlayColor="rgba(255,255,255,0.75)"
                        source={require('../../constans/loader.json')}
                        animationStyle={styles.lottie}
                        speed={2}
                    />
                    <View style={styles.background}>
                        {this.state.shouldStand && (
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
                        {this.state.shouldWalk && (
                            <View>
                                <Text style={styles.processTitle}>
                                    Walk in a straight line for 15 seconds
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
                <CustomHeader navigation={this.props.navigation} testResult={true} />
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
                                    We’ve noticed that you might have some problems with your gait pattern
                                    </Text>
                                    <Text style={styles.message}>
                                    We are currently sending your data to the main lab
                                    </Text>
                                    <Text style={styles.message}>
                                    A rehabilitation program will be sent ASAP
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
                                            We're happy to let you know that Your gait pattern was checked and found to be OK
                                        </Text>
                                        <Text style={styles.message}>
                                        Please repeat this test from time to time
                                        </Text>
                                    </View>
                                </SafeAreaView>
                            )}
                    <View style={styles.ButtonContainer}>
                        <Button
                            title="BACK HOME"
                            style={styles.Button}
                            onPress={() => this.props.navigation.navigate('Main')}
                            buttonStyle={{ backgroundColor: '#8A817C' }}
                        />
                    </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    render() {
        if (this.state.waiting)
            return this.renderWaiting();
        if(this.state.inProcess)
            return this.renderTestProcess();
        else
            return this.renderTestResults();
    }
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    app: {
        flex: 1,
    },
    viewAlert: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    processTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5.5%'),
        marginBottom: wp('3%'),
        top: hp('10%'),
        textAlign: 'center',
      },
    message: {
        fontSize: wp('6%'),
        //fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: wp('2%'),
    },
    alertImg: {
        width: wp('15%'),
        height: hp('10%'),
        marginBottom: hp('7%'),
    },
    SafeAreaAlert: {
        top: hp('18%'),
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
    ButtonContainer: {
        flex:1,
        top:hp('25%'),
        alignItems: 'center',
    },
    Button: {
        width: 200,
        backgroundColor: 'black'
    },

});


export default connect(
    mapStateToProps,
    {  }
)(TestProcess);