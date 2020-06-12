import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Button
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
import ProgressCircle from 'react-native-progress-circle';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';




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
            mergeArray: [],
            highCheck: false,
            mediumCheck: false,
            lowCheack: false,
            isModalVisible: false,

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

    renderItem = ({ item }) => {
        return item.timesLeft != 0 ? (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.navigate('Exercise', {
                        id: item.id
                    })
                }
                style={styles.listItem}>
                <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
                    <Image source={IMAGE.ICOM_ALERT}
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
        ) : (
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('Exercise', {
                            id: item.id
                        })
                    }
                    style={styles.listItemDesable}>
                    <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
                        <Image source={IMAGE.ICONE_DONE}
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
            );
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
                            <TouchableOpacity onPress={this.toggleModal} style={{flexDirection:'row-reverse',right:10}}>
                                 <Image
                                    source={IMAGE.FILTER}
                                    style={styles.filterImg}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity >
                                <Modal isVisible={this.state.isModalVisible}>
                                <View >
                                    <Text>Hello!</Text>
                                    <Button title="Applay Filter" onPress={this.toggleModal} />
                                </View>
                                </Modal>
                               
                            {/* <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.txtCheckBox}>H</Text>
                                    <CheckBox  disabled={false} value={this.state.highCheck} onChange={()=>this.highCheck()} lineWidth={3} tintColor={'#8A817C'}/>
                                </View>
                                <View style={{flexDirection: 'row', left:wp('3%')}}>
                                    <Text style={styles.txtCheckBox}>M</Text>
                                    <CheckBox  disabled={false} value={this.state.mediumCheck} onChange={()=>this.mediumCheck()} lineWidth={3} tintColor={'#8A817C'}/>
                                </View>
                                
                                <View style={{flexDirection: 'row', left:30}}>
                                     <Text style={styles.txtCheckBox}>L</Text>
                                    <CheckBox  disabled={false} value={this.state.lowCheack} onChange={()=>this.lowCheack()} lineWidth={3} tintColor={'#8A817C'}/>
                                </View>
                            </View> */}

                            <View style={styles.listContainer}>
                                <FlatList
                                    data={(this.props.MergeArray.sort((a, b) => a.priorityNumber.localeCompare(b.priorityNumber)))}
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
    txtCheckBox: {
        color: '#463F3A',
        top: hp('1%'),
        paddingRight: wp('2%'),
        fontSize: 14
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
    { getVideoDetailes }
)(RehabPlan);