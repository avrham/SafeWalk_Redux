import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { calculateProgress } from './actions';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import CustomHeader from '../../components/CustomHeader'

const mapStateToProps = state => ({
    patienDetailes: state.login.patienDetailes,
    rehabPlan: state.login.rehabPlan,
    rehabProgress: state.main.rehabProgress,
});

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        }
    }

    async componentDidMount() {
        if (this.props.patienDetailes.rehabPlanID) {
            await this.props.calculateProgress(this.props.rehabPlan);
        }
    }
    render() {
        return (
            <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
                <SafeAreaView style={styles.app}>
                <CustomHeader navigation={this.props.navigation} isTestScreen={true} />
                    <View style={styles.background}>
                        <Text style={styles.title}>
                            Hey {this.props.patienDetailes.name} !
                        </Text>
                        <Text style={styles.sentence}>
                            Before starting, please turn on your kit
                         </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('TestProcess')}>
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

    background: {
        flex: 1,
        alignItems: 'center',
    },

    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('7%'),
        marginBottom: wp('3%'),
        top: hp('10%'),
        color: '#463F3A'
    },
    sentence: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
        opacity: 0.8,
        top: hp('10%'),
        color: '#463F3A'

    },

    button: {
        backgroundColor: '#8A817C',
        height: hp('23%'),
        width: wp('50%'),
        padding: 5,
        borderRadius: hp('23%'),
        top: hp('20%'),
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
        top: hp('30%'),
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
    { calculateProgress }
)(Main);