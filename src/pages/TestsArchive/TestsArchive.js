import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    StyleSheet,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader'
import { IMAGE } from '../../constans/Image';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getTestArchive } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const mapStateToProps = state => ({
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
    getAllTests: state.testsArchive.getAllTests,
    errMessage:state.testsArchive.errMessage
});

export class TestsArchive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            testsArray: []
        }
    }

    async componentDidMount() {

        try {
            this.setState({ visible: true })
            await this.props.getTestArchive(this.props.userToken, this.props.patienDetailes.id);
            this.setState({ visible: false })
        }

        catch (err) {
            alert("Server Error, please try again!")
        }

    }

    conormalizeDate = (dateToNormalize, shouldDisplayWithTime = true) => {
        const addZeroPrefixIfNeeded = (strToModify) => (strToModify.length === 1 ? `0${strToModify}` : strToModify)

        const normalizedDate = new Date(dateToNormalize)
        let day = normalizedDate.getDate().toString()
        day = addZeroPrefixIfNeeded(day)
        let month = (normalizedDate.getMonth() + 1).toString()
        month = addZeroPrefixIfNeeded(month)
        const year = normalizedDate.getFullYear().toString()
        let hours = normalizedDate.getUTCHours().toString()
        hours = addZeroPrefixIfNeeded(hours)
        let minutes = normalizedDate.getUTCMinutes().toString()
        minutes = addZeroPrefixIfNeeded(minutes)
      
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hours) && !isNaN(minutes)) return shouldDisplayWithTime ? `${day}-${month}-${year}, ${hours}:${minutes}` : `${day}-${month}-${year}`
        return 'date is not valid'
      }

    renderItem = ({ item }) => {
        return item.abnormality === false ? (
            <View style={styles.listItem}>
                <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
                    <Image source={IMAGE.ICON_TESTOK}
                        style={styles.itemImg}
                        resizeMode="contain" />
                </View>
                <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('2%') }}>
                    <Text style={styles.titleItem}>
                        {`DATE: ${item.date}`}
                    </Text>
                </View>
            </View>
        ) : (
                <View
                    style={styles.listItem}>
                    <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
                        <Image source={IMAGE.ICOM_ALERT} 
                            style={styles.itemImg}
                            resizeMode="contain" />
                    </View>
                    <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('2%') }}>
                        <Text style={styles.titleItem}>
                            {`DATE: ${item.date}`}
                        </Text>
                    </View>
                </View>
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
                                    The system does not yet have a tests of your
                                </Text>
                                <Text style={styles.message}>
                                    Please come back to the main screen and start a test
                                </Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </SafeAreaView>
            </LinearGradient>

        )
    }
    renderTests() {
        const { visible } = this.state
        var sorted_meetings = this.props.getAllTests.sort((a,b) => {
            return new Date(a.date).getTime() - 
                new Date(b.date).getTime()
        }).reverse();
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
                        <View style={styles.TitleContainer}>
                            <Text style={styles.Title}>
                                {`TESTS ARCHIVE (${this.props.getAllTests.length})`}
                            </Text>
                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={sorted_meetings}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient >

        )
    }

    render() {
        if(this.props.errMessage){
            return alert(this.props.errMessage)
        }
        else{
            if (this.props.getAllTests) {
                return this.renderTests();
            }
            else {
                return this.renderMessage();
            }
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
    TitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#463F3A',
        padding: 10,
        width: '100%'
    },
    Title: {
        color: '#463F3A',
        //fontFamily: 'Lato-Bold',
        fontSize: 25,
        top: 0,
        textAlign: 'center',
    },
    listContainer: {
        width: wp('100%'),
        paddingTop: hp('2%'),
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        height: hp('8%'),
        backgroundColor: '#8A817C',
        marginBottom: 10,
        borderRadius: 5,
    },
    titleItem: {
        color: '#F4F3EE',
        fontSize:wp('5%')
    },
    itemImg: {
        width: wp('8%'),
        height: hp('10%'),
    },
});

export default connect(
    mapStateToProps,
    { getTestArchive }
)(TestsArchive);

