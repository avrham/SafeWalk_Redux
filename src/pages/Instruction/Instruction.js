import React, { Component } from 'react';
import { Text, View, SafeAreaView, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../../components/CustomHeader'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


export class Instruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 2000);
  }
  render() {
    const { visible } = this.state;

    return (
      <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <CustomHeader navigation={this.props.navigation} instructionScreen={true} />

            <AnimatedLoader
              visible={visible}
              overlayColor="rgba(255,255,255,0.75)"
              source={require('../../constans/loader.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
            <View style={styles.descriptionTitleContainer}>
              <Text style={styles.descriptionTitle}>
                INSTRUCTIONS
              </Text>
            </View>
            <View style={{ top: hp('1%') }}>

            <View style={styles.videoScreen}>
              <WebView
                style={{ width: wp('100%') }}
                source={{ uri: 'https://www.youtube.com/embed/CdCClhtKH2Q' }}
                scalesPageToFit={false}
              />
            </View>
            <View>
              <View style={styles.videoInfo}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={styles.Sentence}>
                    please follow the instruction in this video !
                </Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: wp('4%'), top: hp('3%') }}>
                <Text style={{ color: 'black', opacity: 0.8, lineHeight: hp('2%') }}>
                  Please follow the instructions in this video, Those will let you know how you should properly locate the sensors on your body
              </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  lottie: {
    width: wp('10%'),
    height: hp('10%'),
  },
  descriptionTitleContainer:{
    borderBottomWidth:1,
    borderBottomColor:'#463F3A',
    width:'100%',
    padding:10,
},
descriptionTitle: {
    color: '#463F3A',
    //fontFamily: 'Lato-Bold',
    fontSize: 25,
    top: 0,
    textAlign: 'center',
},
  videoScreen: {
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
  Sentence: {
    paddingLeft: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
    opacity: 0.8,
  },
});

export default Instruction
