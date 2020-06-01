import React, { Component } from 'react';
import { Text, View, SafeAreaView, Dimensions,TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../components/CustomHeader'
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { handleClick, handleProgress } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';

const mapStateToProps = state => ({
    MergeArray: state.rehabPlan.MergeArray,
    rehabPlan: state.login.rehabPlan,
    userToken: state.login.userToken,
    rehabProgress: state.main.rehabProgress,
    timesOfAllVideo:state.main.timesOfAllVideo,
});

export class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            itemObj:{}
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({visible: false});
          }, 2000);
        let item = this.props.MergeArray.filter(element => element.id===this.props.navigation.getParam('id'))[0]
        this.setState(prevState => ({
            itemObj:{
            ...prevState.itemObj,
            item
        }
        }))
        console.log(this.props.rehabPlan.id)   
     }

     handleClick = async () => {
        this.setState({ visible: true });
        const userToken=this.props.userToken;
        const rehabPlanID=this.props.rehabPlan.id;
        const timesOfAllVideo=this.props.timesOfAllVideo
        const rehabProgress = this.props.rehabProgress;
        const videoId = this.props.navigation.getParam('id');
        try {
            await this.props.handleClick(userToken,rehabPlanID, videoId);
            await this.props.handleProgress(rehabProgress, timesOfAllVideo);
            this.setState({ visible: false });
        }
        catch (err) {
            Alert.alert('Please try again in a few minutes');
            this.setState({ visible: false });
        }
     }
     



     renderInProgress() {
        // this.props.navigation.navigate('Login')
        const { visible } = this.state
        const item = this.props.MergeArray.filter(element => element.id===this.props.navigation.getParam('id'))[0]
        
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
                                style={{ margin: 10 }}
                                source={{ uri: 'https://www.youtube.com/embed/CdCClhtKH2Q' }}
                                scalesPageToFit={false}
                            />
                        </View>
                        <View>
                            <View style={styles.videoInfo}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.videoTimes}>
                                    {`You’ve completed ${item.timesLeft} out of ${item.times} times of this exercise`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: wp('4%'), top: hp('3%') }}>
                                <Text style={{ color: 'black', opacity: 0.8, lineHeight: hp('2%') }}>
                                    To finish this mision yon need to watch this movie and press the button when you done!
                                </Text>
                            </View>
                            <View style={styles.ButtonContainer}>
                                <Button
                                    title="Done"
                                    style={styles.Button}
                                    onPress={this.handleClick}
                                />
                                <View style={{ justifyContent: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={styles.ProgressBarAnimated}>
                                        <Text style={styles.label}>You've completed</Text>
                                        <Progress.Circle size={40} progress={this.props.rehabProgress / 100} borderWidth={1} indeterminate={false} showsText={true} fontSize={50} />
                                        <Text style={styles.label}>of your rehab program</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    renderDone() {
        // this.props.navigation.navigate('Login')
        const { visible } = this.state
        const item = this.props.MergeArray.filter(element => element.id===this.props.navigation.getParam('id'))[0]
        
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
                                style={{ margin: 10 }}
                                source={{ uri: item.link }}
                                scalesPageToFit={false}
                            />
                        </View>
                        <View>
                            <View style={styles.videoInfo}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.videoTimes}>
                                    {`You’ve completed ${item.timesLeft} out of ${item.times} times of this exercise`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: wp('4%'), top: hp('3%') }}>
                                <Text style={{ color: 'black', opacity: 0.8, lineHeight: hp('2%') }}>
                                    You finish this mision!
                                </Text>
                            </View>
                            <View style={styles.ButtonContainer}>
                                <Button
                                    title="Done"
                                    style={styles.Button}
                                    disabled={true}
                                />
                                <View style={{ justifyContent: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={styles.ProgressBarAnimated}>
                                        <Text style={styles.label}>You've completed</Text>
                                        <Progress.Circle size={40} progress={this.props.rehabProgress / 100} borderWidth={1} indeterminate={false} showsText={true} fontSize={50} />
                                        <Text style={styles.label}>of your rehab program</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    render() {
        const item = this.props.MergeArray.filter(element => element.id===this.props.navigation.getParam('id'))[0]
        if (item.timesLeft>0) {
            return this.renderInProgress();
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
        width: wp('100%'),
        height:  hp('30%'),
    },
    videoInfo: {
        flexDirection: 'row',
        top:hp('2%'),
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
        top:hp('25%')
      },
      Button: {
        width: 200,
      },

    ProgressBarAnimated: {
        width:'100%',
        top:hp('5%'),
        flexDirection: 'row',
        textAlign:'center',
        justifyContent: 'center',
    },
    label: {
        color: 'black',
        opacity: 0.8,
        fontSize: wp('3.5%'),
        fontWeight: '500',
        marginBottom: wp('1%'),
        //fontFamily: 'Lato-Regular',
        padding:10,
        justifyContent:'center', 
        textAlign:'center' 
    },
});

export default connect(
    mapStateToProps,
    { handleClick, handleProgress }
)(Exercise);