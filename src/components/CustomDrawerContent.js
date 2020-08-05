import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
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
             <View
                style={{padding: hp('2%'), paddingTop: hp('5%'), borderBottomColor:'#463F3A',borderBottomWidth:1}}>
                <Image
                    source={{uri: props.patienDetailes.picture}}
                    style={styles.sideMenuProfileIcon}
                />
                <Text style={styles.name}>{props.patienDetailes.name}</Text>
            </View>
            <DrawerContentScrollView {...props}>
                <Animated.View style={{transform: [{translateX}]}}>
                    <DrawerItemList activeTintColor='#3399ff' activeBackgroundColor='rgba(0, 0, 0, .04)' {...props}>
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
    borderWidth: 2,
    borderRadius: 40,
    borderColor: '#463F3A',
  },
  name: {
    color: '#463F3A',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default connect(
    mapStateToProps,
    {}
  )(CustomDrawerContent);
