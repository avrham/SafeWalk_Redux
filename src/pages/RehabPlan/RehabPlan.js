import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import CustomHeader from '../../components/CustomHeader'
import config from '../../../config.json';
import axios from 'axios';
import { IMAGE } from '../../constans/Image';
import mergeByKey from 'array-merge-by-key';
import AnimatedLoader from 'react-native-animated-loader';
import { ListItem } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getVideoDetailes } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const mapStateToProps = state => ({
    MergeArray: state.rehabPlan.MergeArray,
    userToken: state.login.userToken,
    patienDetailes: state.login.patienDetailes,
    rehabPlan: state.login.rehabPlan,
    rehabProgress: state.main.rehabProgress,
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
        if (this.props.patienDetailes.rehabPlanID) {
            try {
                this.setState({ visible: true });
                await this.props.getVideoDetailes(this.props.userToken, this.props.rehabPlan);
                this.setState({ visible: false });
            }
            catch (err) {
                alert("Server Error, please try again")
            }
        }
    }

    FlatListItemSeparator = () => <View style={styles.line} />;

    renderItem = ({item}) => {
      console.log(item);
      return item.times != 0 ? (
        <ListItem
          onPress={() =>
            this.props.navigation.navigate('Exercise', {
              id: item.id,
              /*title: item.name,
              videoLink: item.link,
              videoStatus: item.Videostatus,
              times: item.times,*/
            })
          }
          friction={90}
          tension={100}
          activeScale={0.95}
          leftAvatar={{
            rounded: true,
            source: {
              uri:
                'https://c.static-nike.com/a/images/f_auto/dpr_1.0/h_700,c_limit/285d7865-7d0a-4b91-9267-56f5f85004d7/nike-training-club-app-home-workouts-more.jpg',
            },
          }}
          title={item.name}
          titleStyle={{color: 'white', fontWeight: 'bold'}}
          subtitleStyle={{color: 'white'}}
          subtitle={`you have ${item.times} more times to compleate this part!`}
          style={{height: 100}}
        />
      ) : (
        <ListItem
          onPress={() =>
            this.props.navigation.navigate('Exercise', {
              id: item.id,
              title: item.name,
              videoLink: item.link,
              videoStatus: item.Videostatus,
              times: item.times,
            })
          }
          friction={90}
          tension={100}
          activeScale={0.95}
          leftAvatar={{
            rounded: true,
            source: {
              uri:
                'https://c.static-nike.com/a/images/f_auto/dpr_1.0/h_700,c_limit/285d7865-7d0a-4b91-9267-56f5f85004d7/nike-training-club-app-home-workouts-more.jpg',
            },
          }}
          title={item.name}
          titleStyle={{color: 'white', fontWeight: 'bold'}}
          subtitleStyle={{color: 'white'}}
          subtitle={'Well done you finish this task!'}
        />
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
        const {visible} = this.state
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                    <CustomHeader isRehabScreen={true} navigation={this.props.navigation} />
                    <View style={styles.background}>
                        <AnimatedLoader
                            visible={visible}
                            overlayColor="rgba(255,255,255,0.75)"
                            source={require('../../constans/loader.json')}
                            animationStyle={styles.lottie}
                            speed={1}
                        />
                        <View style={{}}>
                            <Text style={styles.descriptionTitle}>
                            Joint strengthening program
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.descriptionPlan}>
                            To be completed until: {this.props.rehabPlan.executionTime}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.descriptionPlan}>
                            Instructions: In order to make your joint stronger please follow the exercises in this program and make another test on December 10
                            </Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width - 14 }}>
                            <FlatList
                                data={this.props.MergeArray}
                                renderItem={this.renderItem}
                                ItemSeparatorComponent={this.FlatListItemSeparator}
                                style={styles.FlatList}
                            />
                        </View>
                        <TouchableOpacity
                                style={styles.ProgressBarAnimated}
                                onPress={() => this.props.navigation.navigate('RehabPlan')}>
                                <Text style={styles.label}>You've completed</Text>
                                <Progress.Circle size={40} progress={this.props.rehabProgress / 100} borderWidth={1} indeterminate={false} showsText={true} fontSize={50} />
                                <Text style={styles.label}>of your rehab program</Text>
                            </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient >

        )
    }

    render() {
        if (this.props.patienDetailes.rehabPlanID) {
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
        height: '100%',
        flex: 1,
        alignItems: 'center',
    },
    viewAlert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertImg: {
        width: 50,
        height: 50,
        marginBottom: 50,
    },
    message: {
        fontSize: 20,
        fontFamily: 'ComicNeue-BoldItalic',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 20,
    },
    descriptionTitle:{
        color: '#C9BDBD',
        //fontFamily: 'Lato-Bold',
        fontSize: 25,
        top: 20,
        textAlign: 'center',
    },
    descriptionPlan:{
        color: '#C9BDBD',
        //fontFamily: 'Lato-Bold',
        fontSize: 25,
        top: 20,
        textAlign: 'center',
    },
    FlatList: {
        top: 30,
      },
    ProgressBarAnimated: {
        marginTop: hp('35%'),
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
    { getVideoDetailes }
)(RehabPlan);