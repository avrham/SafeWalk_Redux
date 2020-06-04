import React , {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  StyleSheet
} from 'react-native';
import { DrawerContentScrollView, DrawerItem,DrawerItemList } from "@react-navigation/drawer";
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



// export default class CustomDrawerContent extends React.Component{

//     constructor(props) {
//         super(props);
//         this.state = {
//           item: [
//             {
//               navOptionName: 'TestsArchive',
//               screenToNavigate: 'TestsArchive',
//               icon: IMAGE.ICON_LOGO,
//             },
//             {
//               navOptionName: 'Test',
//               screenToNavigate: 'Test',
//               icon: IMAGE.ICON_LOGO,
//             },
//             {
//               navOptionName: 'Rehab Plan',
//               screenToNavigate: 'RehabPlan',
//               icon: IMAGE.ICON_LOGO,
//             },
//           ],
//         };
//       }

//     render() {
//     return(
//         <View>
//             <Text>kkk</Text>
//         </View>
//     )
// }
// }
// import {} from 'react-native';
// import {IMAGE} from '../constans/Image';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';


//   render() {
//     return (
//       <ScrollView style={styles.container}>
//         <ImageBackground
//           source={IMAGE.BACKGRUND}
//           style={{padding: hp('2%'), paddingTop: hp('8%')}}>
//           <Text style={styles.name}>ryjg</Text>
//         </ImageBackground>
//         {this.state.item.map(item => (
//           <View
//             style={{
//               flex: 1,
//               flexDirection: 'row',
//               padding: hp('1.5%'),
//               top: hp('2.5%'),
//               marginBottom: hp('2%'),
//             }}>
//             <Image
//               source={item.icon}
//               style={{
//                 marginLeft: wp('3%'),
//                 width: wp('7%'),
//                 height: hp('3.5%'),
//               }}
//             />
//             <Text
//               style={{
//                 fontSize: wp('5%'),
//                 left: wp('7%'),
//               }}
//               onPress={() => {
//                 this.props.navigation.navigate(item.screenToNavigate);
//               }}>
//               {item.navOptionName}
//             </Text>
//           </View>
//         ))}
//         <TouchableOpacity
//           style={{marginTop: hp('36%'), marginLeft: wp('27%')}}
//           onPress={() => this.props.navigation.navigate('Login')}>
//           <Image
//             style={{width: 40, height: 40}}
//             source={IMAGE.ICON_LOGOUT}
//             resizeMode="contain"
//           />
//           <Text>LogOut</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
