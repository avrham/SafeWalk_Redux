import React, { Component } from 'react';
import { Text, View, SafeAreaView, Image, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../components/CustomHeader'
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { markVideoExecution, handleProgress } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IMAGE} from '../../constans/Image'
import ProgressCircle from 'react-native-progress-circle'


const mapStateToProps = state => ({
    MergeArray: state.rehabPlan.MergeArray,
    rehabPlan: state.login.rehabPlan,
    userToken: state.login.userToken,
    rehabProgress: state.main.rehabProgress,
    timesOfAllVideo: state.main.timesOfAllVideo,
    errMessage: state.exercise.errMessage,
    rehabExsist: state.login.rehabExsist
});

export class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            disable: false
        }
    }

    componentDidMount() {
        if (this.props.rehabExsist) {
            const item = this.props.MergeArray.filter(element => element.id === this.props.route.params.id)[0]
            item.timesLeft > 0 ? null : this.setState({ disable: true })
        }
        setTimeout(() => {
            this.setState({ visible: false });
        }, 2000);
    }

    handleClick = async () => {
        this.setState({ visible: true });
        const userToken = this.props.userToken;
        const rehabPlanID = this.props.rehabPlan.id;
        const videoId =this.props.route.params.id;
        try {
            await this.props.markVideoExecution(userToken, rehabPlanID, videoId);
            if (this.props.rehabExsist) {
                const item = this.props.MergeArray.filter(element => element.id === this.props.route.params.id)[0]
                item.timesLeft > 0 ? null : this.setState({ disable: true })
            }
            this.setState({ visible: false });
        }
        catch (err) {
            console.log(err.message);
            Alert.alert('Alert',err.message, [{text:'OK' ,onPress:()=> this.setState({ visible: false })}])
        }
    }


    renderInProgress(item) {
        const { visible } = this.state;
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={{ flex: 1 }}>
                    <CustomHeader navigation={this.props.navigation} videoDetailes={true} />
                    <View style={styles.background}>
                        <AnimatedLoader
                            visible={visible}
                            overlayColor="rgba(255,255,255,0.75)"
                            source={require('../../constans/loader.json')}
                            animationStyle={styles.lottie}
                            speed={1}
                        />
                        <View style={styles.descriptionTitleContainer}>
                            <Text style={styles.descriptionTitle}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={styles.videoScreen}>
                            <WebView
                                style={{ width: wp('100%') }}
                                source={{ uri: item.link }}
                                scalesPageToFit={false}
                            />
                        </View>
                        <View>
                            <View style={styles.videoInfo}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.videoTimes}>
                                        {`You’ve completed ${item.times - item.timesLeft} out of ${item.times} times of this exercise`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: wp('4%'), top: hp('3%') }}>
                                <Text style={{ color: 'black', opacity: 0.8, lineHeight: hp('2%') }}>
                                    In order to finish this mission you'll need to follow the instructions inside the exercise movie and press done when you finish
                                </Text>
                            </View>
                            <View style={styles.ButtonContainer}>
                                <Button
                                    title="Done"
                                    style={styles.Button}
                                    onPress={this.handleClick}
                                    disabled={this.state.disable}
                                    buttonStyle={{ backgroundColor: '#6cd194' }}

                                />
                                <View style={{ justifyContent: 'flex-end' }}>
                                    <View
                                        style={styles.ProgressBarAnimated}>
                                        <Text style={styles.label}>You've completed</Text>
                                        <ProgressCircle
                                        percent={this.props.rehabProgress}
                                        radius={27}
                                        borderWidth={4}
                                        color="#3399FF"
                                        bgColor="#edece7"
                                        >
                                        <Text style={{ fontSize: 14 }}>{this.props.rehabProgress}%</Text>
                                        </ProgressCircle>
                                        <Text style={styles.label}>of your rehab program</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    renderDone() {
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={{ flex: 1 }}>
                    <CustomHeader navigation={this.props.navigation} testResult={true} />
                    <View style={styles.background}>
                                <View style={styles.viewAlert}>
                                    <Image
                                        source={IMAGE.ICON_TESTOK}
                                        style={styles.alertImg}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.message}>
                                        Well done, you have finished your rehabilition program !
                                    </Text>
                                </View>
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
        if (this.props.rehabExsist) {
            const item = this.props.MergeArray.filter(element => element.id === this.props.route.params.id)[0]
            return this.renderInProgress(item)
        }
        else {
            return this.renderDone();
        }
    }
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    lottie: {
        width: 100,
        height: 100,
    },
    background: {
        flex: 1,
        alignItems: 'center',
    },
    viewAlert: {
        top: hp('9%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: wp('6%'),
        //fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: wp('5%'),
    },
    alertImg: {
        width: wp('15%'),
        height: hp('10%'),
        marginBottom: hp('7%'),
    },
    descriptionTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#463F3A',
        padding: 10,
        width: '100%'
    },
    descriptionTitle: {
        color: '#463F3A',
        //fontFamily: 'Lato-Bold',
        fontSize: 25,
        textAlign: 'center',
    },
    videoScreen: {
        marginTop: 10,
        width: wp('100%'),
        height: hp('30%'),
    },
    videoInfo: {
        flexDirection: 'row',
        top: hp('2%'),
        justifyContent: 'space-between',
        width: wp('90%'),
    },
    videoTitle: {
        paddingLeft: wp('4%'),
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 6,
    },
    videoTimes: {
        paddingLeft: wp('4%'),
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
        opacity: 0.8,
    },
    ButtonContainer: {
        alignItems: 'center',
        top: hp('20%')
    },
    Button: {
        width: 200,
    },

    ProgressBarAnimated: {
        width: '100%',
        top: hp('5%'),
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
    },
    label: {
        color: 'black',
        opacity: 0.8,
        fontSize: wp('3%'),
        fontWeight: '500',
        marginBottom: wp('1%'),
        textAlign: 'center',
        //fontFamily: 'Lato-Regular',
        borderColor: '#8A817C',
        padding: wp('3%'),
        top:hp('0.6%')
    },
});

export default connect(
    mapStateToProps,
    { markVideoExecution, handleProgress }
)(Exercise);