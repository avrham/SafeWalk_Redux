import React, { Component } from 'react';
import {Text, View, SafeAreaView, Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';


export class Instruction extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    this.setState({visible: true});
    setTimeout(() => {
      this.setState({visible: false});
    }, 2000);
  }
  render() {
    const {visible} = this.state;

    return (
      <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
      <SafeAreaView style={{flex: 1}}>
       
        <View style={{top: 20}}>
          <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../../constans/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={styles.videoScreen}>
            <WebView
              style={{margin: 10}}
              source={{uri: 'https://www.youtube.com/embed/CdCClhtKH2Q'}}
              scalesPageToFit={false}
            />
          </View>
          <View>
            <View style={styles.videoInfo}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.videoTitle}>Instruction video</Text>
                <Text style={styles.videoTimes}>
                 please follow the instruction in this video!
                </Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 14, top: 20}}>
              <Text style={{color: 'black', opacity: 0.8, lineHeight: 20}}>
              Please follow the instructions in this video Those will let you know how you should properly locate the sensors on your body!
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
    width: 100,
    height: 100,
  },
  videoScreen: {
    width: '100%',
    height: 270,
  },
  videoInfo: {
    flexDirection: 'row',
    top: 16,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 14,
  },
  videoTitle: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  videoTimes: {
    paddingLeft: 14,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default Instruction
