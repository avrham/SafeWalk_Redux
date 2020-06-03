import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import CustomHeader from '../../components/CustomHeader'
import { IMAGE } from '../../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getVideoDetailes } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle'



const mapStateToProps = state => ({
    MergeArray: state.rehabPlan.MergeArray,
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
    rehabPlan: state.login.rehabPlan,
    rehabProgress: state.main.rehabProgress,
    rehabExsist: state.login.rehabExsist
});

export class RehabPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            videoStatusArray: [],
            videoIds: '',
            AllVideoDetails: [],
            mergeArray: []
        }
    }

    async componentDidMount() {
        if (this.props.rehabExsist) {
            try {
                this.setState({ visible: true });
                await this.props.getVideoDetailes(this.props.userToken, this.props.rehabPlan);
                this.setState({ visible: false });
            }
            catch (err) {
                console.log(err.message);
                Alert.alert('Alert',err.message, [{text:'OK' ,onPress:()=> this.setState({ visible: false })}])
            }
        }
    }
    renderItem = ({ item }) => {
        return item.timesLeft != 0 ? (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate('Exercise', {
                        id: item.id
                    })
                }
                style={styles.listItem}>
                    <View style={{padding:hp('2%'),justifyContent:'center', textAlign:'center'}}>
                    <Image source={IMAGE.ICOM_ALERT}
                        style={styles.itemImg}
                        resizeMode="contain" />
                </View>
                <View style={{justifyContent:'center', textAlign:'center', left:wp('2%')}}>
                    <Text style={styles.titleItem}>
                        {item.name}
                    </Text>
                    <Text style={styles.titleItem}>
                        {`Priority: ${item.priority}`}
                    </Text>
                    <Text style={styles.titleItem}>
                        {`Times left: ${item.timesLeft}`}
                    </Text>
                </View>
            </TouchableOpacity>
        ) : (
            <View
            style={styles.listItemDesable}>
                <View style={{padding:10,justifyContent:'center', textAlign:'center'}}>
                <Image source={IMAGE.ICONE_DONE} desabled
                    style={styles.itemImg}
                    resizeMode="contain" />
            </View>
            <View style={{justifyContent:'center', textAlign:'center', left:wp('2%')}}>
                <Text style={styles.titleItem}>
                    {item.name}
                </Text>
                <Text style={styles.titleItem}>
                    {`Priority: ${item.priority}`}
                </Text>
                <Text style={styles.titleItem}>
                    {`Times left: ${item.timesLeft}`}
                </Text>
            </View>
        </View>
        );
    };

    renderMessage() {
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                    <CustomHeader isRehabScreen={true} navigation={this.props.navigation} />
                    <View style={styles.background}>
                        <SafeAreaView>
                            <View style={styles.viewAlert}>
                                <Image
                                    source={IMAGE.ICOM_ALERT}
                                    style={styles.alertImg}
                                    resizeMode="contain"
                                />
                                <Text style={styles.message}>
                                    The system does not yet have a Rehabilitation program
                                </Text>
                                <Text style={styles.message}>
                                    If you made test already, Your program will appear as soon as
                                    possible
                                </Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </SafeAreaView>
            </LinearGradient>

        )
    }

    renderRehabPlan() {
        const { visible } = this.state
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                    <CustomHeader headerNormal={true} navigation={this.props.navigation} />
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
                                {this.props.rehabPlan.name}
                            </Text>
                        </View>
                        <View style={{ flex: 1, width:wp('90%'), paddingBottom:hp('2%'), paddingTop:hp('2%') }}>
                            <View style={{flexDirection: 'row', paddingBottom:hp('2%')}}>
                                <Text style={styles.staticSentence}>
                                    {'To be completed until: '}
                                    <Text style={styles.descriptionPlan}>
                                    {Moment(this.props.rehabPlan.executionTime).format('DD/MM/YYYY')}
                                    </Text>
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', paddingBottom:hp('2%')}}>
                                <Text style={styles.staticSentence}>
                                    {'Instructions: '}
                                    <Text style={styles.descriptionPlan}>
                                        {this.props.rehabPlan.instructions}
                                    </Text>
                                </Text>
                            </View>
                            <View style={styles.listContainer}>
                                <FlatList
                                    data={(this.props.MergeArray.sort((a, b) => a.priorityNumber.localeCompare(b.priorityNumber)))}
                                    renderItem={this.renderItem}
                                />
                            </View>
                            <View style={{justifyContent: 'flex-end'}}>
                                <View
                                    style={styles.ProgressBarAnimated}>
                                    <Text style={styles.label}>You've completed</Text>
                                    <ProgressCircle
                                    percent={this.props.rehabProgress}
                                    radius={25}
                                    borderWidth={4}
                                    color="#3399FF"
                                     >
                                    <Text style={{ fontSize: 16 }}>{this.props.rehabProgress}%</Text>
                                    </ProgressCircle>
                                    <Text style={styles.label}>of your rehab program</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient >

        )
    }

    render() {
        if (this.props.rehabExsist && !(this.props.MergeArray===null)) {
            return this.renderRehabPlan();
        }
        else {
            return this.renderMessage();
        }
    }
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
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
    viewAlert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertImg: {
        width: wp('20%'),
        height: hp('10%'),
        marginBottom: hp('8%'),
    },
    message: {
        fontSize: 20,
        //fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: hp('4%'),
    },
    descriptionTitleContainer:{
        borderBottomWidth:1,
        borderBottomColor:'#463F3A',
        padding:10,
        width:'100%'
    },
    descriptionTitle: {
        color: '#463F3A',
        //fontFamily: 'Lato-Bold',
        fontSize: 25,
        top: 0,
        textAlign: 'center',
    },
    staticSentence:{
        color:'#463F3A',
        fontSize:wp('4.4%'),
        fontWeight:'bold'
    },
    descriptionPlan: {
        color:'#463F3A',
        opacity:0.8,
        fontSize:wp('4%'),        
        //fontFamily: 'Lato-Bold',
    },
    listContainer:{
        width: wp('90%'), paddingTop:hp('1%'),
        flex:1
    },
    listItem: {
        flexDirection: 'row',
        height:hp('10%'),
        backgroundColor:'#8A817C',
        marginBottom:10,
        borderRadius:5,
    },
    listItemDesable:{
        flexDirection: 'row',
        height:hp('10%'),
        backgroundColor:'#8A817C',
        opacity:0.5,
        marginBottom:10,
        borderRadius:5,
    },
    titleItem: {
        color: '#F4F3EE',
        padding:hp('0.35%'),
        fontSize:wp('3.8%')
    },
    itemImg: {
        width: wp('8%'),
        height: hp('10%'),
    },
    ProgressBarAnimated: {
        width:'100%',
        top:hp('2%'),
        flexDirection: 'row',
        textAlign:'center',
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
    { getVideoDetailes }
)(RehabPlan);