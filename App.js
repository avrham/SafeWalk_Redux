import React, { useEffect, Fragment } from 'react';
import { StatusBar } from 'react-native';
import store from './src/store';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from './src/pages/Login/Login';
import Main from './src/pages/Main/Main';
import TestProcess from './src/pages/TestProcess/TestProcess';
import RehabPlan from './src/pages/RehabPlan/RehabPlan';
import Exercise from './src/pages/Exercise/Exercise';
import TestsArchive from './src/pages/TestsArchive/TestsArchive';
import Instruction from './src/pages/Instruction/Instruction'

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Main: Main,
    TestProcess: TestProcess,
    RehabPlan: RehabPlan,
    Exercise: Exercise,
    TestsArchive: TestsArchive,
    Instruction:Instruction
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
);

const Navigation = createAppContainer(AppNavigator);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <Fragment >
        <StatusBar barStyle="light-content" />
        <Navigation />
      </Fragment>
    </Provider>
  );
};

export default App;