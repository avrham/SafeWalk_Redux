import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { calculateProgress } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import config from '../../../config.json'

const mapStateToProps = state => ({
    patienDetailes: state.login.patienDetailes,
    rehabPlan: state.login.rehabPlan,
    userToken: state.login.userToken,
    rehabProgress: state.main.rehabProgress,
    errMessage: state.main.errMessage,
    
});


export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            errorMessage:''
        }
    }

    async componentDidMount() {
        if (this.props.patienDetailes.rehabPlanID) {
            await this.props.calculateProgress(this.props.rehabPlan);
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
                this.patienDetailes.sensorsKitID
              }`,
              options,
            );
            return resolve(response.data);
          } catch (ex) {
            return reject(new Error(ex.response.data.message));
          }
        });
      }
    
      createTest(token) {
        return new Promise(async (resolve, reject) => {
          try {
            const options = {
              headers: {'x-auth-token': token},
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

    StartTestHandler = async () => {
        let testID, timeout;
        const token = this.props.userToken;
        try {
          this.setState({visible: true, errorMessage: ''});
          const {IPs} = await this.getKitDetails(token);
          const test = await this.createTest(token);
          testID = test.id;
          let promise1; // promise2, promise3, promise4, promise5, promise6, promise7;
          this.setState({visible: false, shouldRenderTestProcessPage: true});
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
            this.props.store.userDetails.id,
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
            abnormality: false,
            testFinished: false,
            shouldStand: true,
            shouldWalk: false,
            errorMessage: err.message,
          });
          // alert(err.message);
          if (testID) this.removeTest(token, testID);
        }
      };

    render() {
        const { visible } = this.state
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
                        <Text style={styles.title}>
                            Hey {this.props.patienDetailes.name} !
                        </Text>
                        <Text style={styles.sentence}>
                            Before starting, please turn on your kit
                         </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.StartTestHandler}>
                            <Text style={styles.buttonText}>Start Test</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.instructionButton}
                            onPress={() => this.props.navigation.navigate('Instruction')}>
                            <Text style={styles.instructionTitle}>INSTRUCTIONS</Text>
                        </TouchableOpacity>
                        {this.props.patienDetailes.rehabPlanID && (
                            <TouchableOpacity
                                style={styles.ProgressBarAnimated}
                                onPress={() => this.props.navigation.navigate('RehabPlan')}>
                                <Text style={styles.label}>You've completed</Text>
                                <Progress.Circle size={40} progress={this.props.rehabProgress / 100} borderWidth={1} indeterminate={false} showsText={true} fontSize={50} />
                                <Text style={styles.label}>of your rehab program</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </SafeAreaView >
            </LinearGradient>

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

    background: {
        flex: 1,
        alignItems: 'center',
    },

    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('7%'),
        marginBottom: wp('3%'),
        top: hp('15%'),
        color: '#463F3A'
    },
    sentence: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
        opacity: 0.8,
        top: hp('15%'),
        color: '#463F3A'

    },

    button: {
        backgroundColor: '#8A817C',
        height: hp('23%'),
        width: wp('50%'),
        padding: 5,
        borderRadius: hp('23%'),
        top: hp('25%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#BCB8B1',
    },

    buttonText: {
        color: '#FAFAFA',
        //fontFamily: 'Lato-Bold',
        fontSize: wp('6%'),
    },

    instructionButton: {
        top: hp('34%'),
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#8A817C',
        borderRadius: 5,
        width: wp('60%'),
        height: hp('4.5%'),
        alignItems: 'center',
        borderColor: '#BCB8B1'
    },

    instructionTitle: {
        fontSize: wp('4.5%'),
        //fontFamily: 'Lato-Regular',
        color: '#F4F3EE',
    },
    ProgressBarAnimated: {
        marginTop: hp('50%'),
        borderColor: 'black',
        borderWidth: 2,
        borderColor: '#8A817C',
        padding: 5,
        borderRadius: 5,
        flexDirection: 'row',
    },

    label: {
        color: 'black',
        opacity: 0.8,
        fontSize: wp('3.5%'),
        fontWeight: '500',
        marginBottom: wp('1%'),
        textAlign: 'center',
        //fontFamily: 'Lato-Regular',
        borderColor: '#8A817C',
        padding: 10
    },



});

export default connect(
    mapStateToProps,
    { calculateProgress }
)(Main);