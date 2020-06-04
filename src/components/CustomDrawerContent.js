import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import {IMAGE} from '../constans/Image'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import  Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    patienDetailes: state.login.patienDetailes,
  });


function CustomDrawerContent({progress,...props}){
    const translateX = Animated.interpolate(progress,{
        inputRange:[0,1],
        outputRange:[-100,0]
    })
    return(
        <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>
             <ImageBackground
                source={IMAGE.BACKGRUND}
                style={{padding: hp('2%'), paddingTop: hp('8%')}}>
                <Image
                    source={{uri: props.patienDetailes.picture}}
                    style={styles.sideMenuProfileIcon}
                />
                <Text style={styles.name}>{props.patienDetailes.name}</Text>
            </ImageBackground>
            <DrawerContentScrollView {...props}>
                <Animated.View style={{transform: [{translateX}]}}>
                    <DrawerItemList activeTintColor='#463F3A' {...props}>
                    </DrawerItemList>
                    <TouchableOpacity
                    style={{marginTop: hp('36%'), marginLeft: wp('27%')}}
                    onPress={() => props.navigation.navigate('Login')}>
                        <Image
                            style={{width: 40, height: 40}}
                            source={IMAGE.ICON_LOGOUT}
                            resizeMode="contain"
                        />
                        <Text style={{color:'#463F3A'}}>LogOut</Text>
                </TouchableOpacity>
                </Animated.View>
        </DrawerContentScrollView>
    </LinearGradient>
    )
}


const styles = StyleSheet.create({
  gradient: {
    flex: 1
},
  sideMenuProfileIcon: {
    height: hp('9%'),
    width: wp('20%'),
    borderWidth: 3,
    borderRadius: 40,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default connect(
    mapStateToProps,
    {}
  )(CustomDrawerContent);
