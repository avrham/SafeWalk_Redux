import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { IMAGE } from '../constans/Image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  patienDetailes: state.login.patienDetailes,
});

export class CustomHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      navigation,
      headerNormal,
      isTestProcess,
      testResult,
      videoDetailes,
      instructionScreen,

    } = this.props;
    return (
      <View
        style={styles.headerContainer}>
        {headerNormal && (
          <View style={styles.rowContainer}>
            <View style={{ padding: hp('2%'), justifyContent: 'center', textAlign: 'center' }}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  style={{
                    width: wp('8%'),
                    height: hp('10%'),
                  }}
                  source={IMAGE.ICON_MENU}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('17%') }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Main')}>
                <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1, justifyContent: 'center', left: wp('32%')
              }}>
              <Image
                source={{ uri: this.props.patienDetailes.picture }}
                style={styles.sideMenuProfileIcon}
              />
            </View>
          </View>
        )}
        {instructionScreen && (
          <View style={styles.rowContainer}>
            <View style={{ padding: hp('1%'), justifyContent: 'center', textAlign: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: wp('6%'), height: hp('5%') }}
                  source={IMAGE.ICON_RETURN}
                  resizeMode="contain"
                />
                <Text style={{ width: wp('9%'), color: '#463F3A', top: hp('1.5%') }}>Back</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('14%') }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Main')}>
                <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1, justifyContent: 'center', left: wp('30%')
              }}>
              <Image
                source={{ uri: this.props.patienDetailes.picture }}
                style={styles.sideMenuProfileIcon}
              />
            </View>
          </View>

        )}
        {isTestProcess && (
          <View style={styles.rowContainer}>
            <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('33%') }}>
              <TouchableOpacity>
                <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1, justifyContent: 'center', left: wp('49%')
              }}>
              <Image
                source={{ uri: this.props.patienDetailes.picture }}
                style={styles.sideMenuProfileIcon}
              />
            </View>
          </View>
        )}
        {testResult && (
          <View style={styles.rowContainer}>
            <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('33%') }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Main')}>
                <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1, justifyContent: 'center', left: wp('49%')
              }}>
              <Image
                source={{ uri: this.props.patienDetailes.picture }}
                style={styles.sideMenuProfileIcon}
              />
            </View>
          </View>
        )}
        {videoDetailes && (
          <View style={styles.rowContainer}>
            <View style={{ padding: hp('1%'), justifyContent: 'center', textAlign: 'center' }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RehabPlan')}
                style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: wp('6%'), height: hp('5%') }}
                  source={IMAGE.ICON_RETURN}
                  resizeMode="contain"
                />
                <Text style={{ width: wp('9%'), color: '#463F3A', top: hp('1.5%') }}>Back</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', textAlign: 'center', left: wp('14%') }}>
              <View>
                <Image style={styles.logoIcon} source={IMAGE.ICON_LOGO} />
              </View>
            </View>
            <View
              style={{
                flex: 1, justifyContent: 'center', left: wp('30%')
              }}>
              <Image
                source={{ uri: this.props.patienDetailes.picture }}
                style={styles.sideMenuProfileIcon}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomColor: '#463F3A',
    borderBottomWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    height: hp('10%'),
    borderRadius: 5,

  },
  sideMenuProfileIcon: {
    height: hp('6%'),
    width: wp('13%'),
    borderWidth: 1,
    borderRadius: 75,
  },
  logoIcon: {
    width: wp('34%'),
    height: hp('6%'),
  },
});

export default connect(
  mapStateToProps,
  {}
)(CustomHeader);
