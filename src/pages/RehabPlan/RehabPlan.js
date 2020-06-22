import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Button } from 'react-native-elements';
import CustomHeader from '../../components/CustomHeader'
import { IMAGE } from '../../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getVideoDetailes, filterData } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';


const mapStateToProps = state => ({
    MergeArray: state.rehabPlan.MergeArray,
    FilterArray:state.rehabPlan.FilterArray,
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
            mergeArray: [],
            isModalVisible: false,
            filterOptions: {
                highCheck: false,
                mediumCheck: false,
                lowCheack: false,
                showDone:false,
                showNotDone:false
            }

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
                Alert.alert('Alert', err.message, [{ text: 'OK', onPress: () => this.setState({ visible: false }) }])
            }
        }
    }


    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
      };
    
    applayFilter =  () =>{
        this.props.filterData(this.props.MergeArray, this.state.filterOptions);
        this.toggleModal();
 }

 navigateAndReswtParams = (item)=>{

    this.setState({filterOptions:{
        ...this.state.filterOptions,
            highCheck: false,
            mediumCheck: false,
            lowCheack: false,
            showDone:false,
            showNotDone:false
    }})
    this.props.navigation.navigate('Exercise', {
        id: item.id
    })

 }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.navigateAndReswtParams(item)}
                style={styles.listItem}>
                <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
                    <Image source={item.timesLeft != 0 ?IMAGE.ICOM_ALERT:IMAGE.ICONE_DONE}
                        style={styles.itemImg}
                        resizeMode="contain" />
                </View>
                <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('2%') }}>
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
        )
    };

    renderMessage() {
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                    <CustomHeader headerNormal={true} navigation={this.props.navigation} />
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
        const { visible } = this.state;
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
                        <View style={{ flex: 1, width: wp('90%'), paddingBottom: hp('2%'), paddingTop: hp('2%') }}>
                            <View style={{ flexDirection: 'row', paddingBottom: hp('2%') }}>
                                <Text style={styles.staticSentence}>
                                    {'To be completed until: '}
                                    <Text style={styles.descriptionPlan}>
                                        {Moment(this.props.rehabPlan.executionTime).format('DD/MM/YYYY')}
                                    </Text>
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: hp('0%') }}>
                                <Text style={styles.staticSentence}>
                                    {'Instructions: '}
                                    <Text style={styles.descriptionPlan}>
                                        {this.props.rehabPlan.instructions}
                                    </Text>
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.toggleModal} style={{flexDirection:'row-reverse'}}>
                                 <Image
                                    source={IMAGE.FILTER}
                                    style={styles.filterImg}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity >
                                <Modal isVisible={this.state.isModalVisible} backdropColor={'#373a42'} backdropOpacity={0.85}>
                                    <View style={styles.modelContainer}>
                                        <TouchableOpacity style={{ justifyContent: 'center', paddingTop:hp('3%') }} onPress={this.toggleModal}>
                                            <Image source={IMAGE.EXIT}
                                                style={styles.itemImg}
                                                resizeMode="contain" />
                                        </TouchableOpacity>
                                    <Text style={{color:'#e2e0e5', fontSize:18, textAlign:'center'}}>
                                        Filters
                                        </Text> 
                                        <Text style={{color:'#a1a3a9', paddingBottom:hp('2%'), paddingTop:hp('5%')}}>PRIORITY</Text>
                                        <View style={{flexDirection: 'row', backgroundColor:'#595961',opacity:0.9, borderRadius:4, width:wp('90%'), height:hp('8%')}}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({filterOptions:{
                                                        ...this.state.filterOptions,
                                                        highCheck:!this.state.filterOptions.highCheck
                                                    }})
                                                }
                                                style={styles.filterBoxWithBorder}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <CheckBox disabled={true} value={this.state.filterOptions.highCheck} lineWidth={1} tintColor={'#8A817C'}/>
                                                    <Text style={styles.txtCheckBox}>HIGH</Text>
                                                </View>
                                            
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({filterOptions:{
                                                        ...this.state.filterOptions,
                                                        mediumCheck:!this.state.filterOptions.mediumCheck
                                                    }})
                                                }
                                                style={styles.filterBoxWithBorder}>
                                             <View style={{flexDirection: 'row'}}>
                                                    <CheckBox disabled={true} value={this.state.filterOptions.mediumCheck} lineWidth={1} tintColor={'#8A817C'}/>
                                                    <Text style={styles.txtCheckBox}>MEDIUM</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({filterOptions:{
                                                        ...this.state.filterOptions,
                                                        lowCheack:!this.state.filterOptions.lowCheack
                                                    }})
                                                }
                                                style={styles.filterBox}>
                                             <View style={{flexDirection: 'row'}}>
                                                    <CheckBox disabled={true} value={this.state.filterOptions.lowCheack} lineWidth={1} tintColor={'#8A817C'}/>
                                                    <Text style={styles.txtCheckBox}>LOW</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{color:'#a1a3a9', paddingBottom:hp('2%'), paddingTop:hp('5%')}}>VIDEO STATUS</Text>
                                        <View style={{flexDirection: 'row', backgroundColor:'#595961',opacity:0.9, borderRadius:4, width:wp('90%'), height:hp('8%')}}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({filterOptions:{
                                                        ...this.state.filterOptions,
                                                        showDone:!this.state.filterOptions.showDone
                                                    }})
                                                }
                                                style={styles.filterBoxWB}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <CheckBox disabled={true} value={this.state.filterOptions.showDone} lineWidth={1} tintColor={'#8A817C'}/>
                                                    <Text style={styles.txtCheckBox}>DONE</Text>
                                                </View>
                                            
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({filterOptions:{
                                                        ...this.state.filterOptions,
                                                        showNotDone:!this.state.filterOptions.showNotDone
                                                    }})
                                                }
                                                style={styles.filterB}>
                                                <View style={{flexDirection: 'row'}}>
                                                        <CheckBox disabled={true} value={this.state.filterOptions.showNotDone} lineWidth={1} tintColor={'#8A817C'}/>
                                                        <Text style={styles.txtCheckBox}>IN PROGRESS</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                            <View style={styles.Button}>
                                                <Button title="Applay Filter" style={styles.ApplayButton} onPress={this.applayFilter} color="#f3e5da" buttonStyle={{ backgroundColor: '#d36c64'}}/>
                                            </View>
                                    </View>
                                </Modal>

                            <View style={styles.listContainer}>
                                <FlatList
                                    data={(this.props.FilterArray.sort((a, b) => a.priorityNumber.localeCompare(b.priorityNumber)))}
                                    renderItem={this.renderItem}
                                />
                            </View>
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
                </SafeAreaView>
            </LinearGradient >

        )
    }

    render() {
        if (this.props.rehabExsist && !(this.props.MergeArray === null)) {
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
        top: hp('18%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertImg: {
        width: wp('15%'),
        height: hp('10%'),
        marginBottom: hp('8%'),
    },
    message: {
        fontSize: 20,
        //fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: hp('2%'),
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
        top: 0,
        textAlign: 'center',
    },
    staticSentence: {
        color: '#463F3A',
        fontSize: wp('4.4%'),
        fontWeight: 'bold'
    },
    descriptionPlan: {
        color: '#463F3A',
        opacity: 0.8,
        fontSize: wp('4%'),
        //fontFamily: 'Lato-Bold',
    },
    filterImg:{
        width: wp('8%'),
        height: hp('6%'),
    },
    modelContainer:{     
        flex:1,   
    },
    filterBoxWithBorder:{
        textAlign:'center',
        justifyContent:'center',
        width:wp('30%'),
        borderRightWidth:2,
        borderRightColor:'#3f4346',
        paddingLeft:8
    },
    filterBox:{
        textAlign:'center',
        justifyContent:'center',
        width:wp('30%'),
        paddingLeft:8
    },
    filterBoxWB:{
        textAlign:'center',
        justifyContent:'center',
        width:wp('45%'),
        borderRightWidth:2,
        borderRightColor:'#3f4346',
        paddingLeft:8
    },
    filterB:{
        textAlign:'center',
        justifyContent:'center',
        width:wp('45%'),
        paddingLeft:8
    },
    txtCheckBox: {
        color: '#eaedef',
        top: hp('1%'),
        left:7,
        fontSize: 14,
    },
    Button:{
        paddingTop:hp('8%'),
        alignItems:'center'
    },
    ApplayButton:{
        width:wp('40%'),
        height:hp('8%'),
        textAlign:'center',
        justifyContent:'center',
        backgroundColor:'#d36c64',
        borderRadius:5,

    },
    listContainer: {
        width: wp('90%'), paddingTop: hp('0%'),
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        height: hp('10%'),
        backgroundColor: '#8A817C',
        marginBottom: 10,
        borderRadius: 5,
    },
    listItemDesable: {
        flexDirection: 'row',
        height: hp('10%'),
        backgroundColor: '#8A817C',
        marginBottom: 10,
        borderRadius: 5,
    },
    titleItem: {
        color: '#F4F3EE',
        padding: hp('0.35%'),
        fontSize: wp('3.8%')
    },
    itemImg: {
        width: wp('8%'),
        height: hp('10%'),
    },
    ProgressBarAnimated: {
        width: '100%',
        top: hp('2%'),
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
        padding: wp('2%'),
        top: hp('0.6%')
    },
});

export default connect(
    mapStateToProps,
    { getVideoDetailes, filterData }
)(RehabPlan);