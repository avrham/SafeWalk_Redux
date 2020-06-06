import React, { useEffect, Fragment } from 'react';
import { StatusBar } from 'react-native';
import store from './src/store';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/pages/Login/Login';
import Main from './src/pages/Main/Main';
import TestProcess from './src/pages/TestProcess/TestProcess';
import RehabPlan from './src/pages/RehabPlan/RehabPlan';
import Exercise from './src/pages/Exercise/Exercise';
import TestsArchive from './src/pages/TestsArchive/TestsArchive';
import Instruction from './src/pages/Instruction/Instruction';
import CustomDrawerContent from './src/components/CustomDrawerContent';


const navOptionHandler = () => ({
  headerShown: false,
});

const StackTest = createStackNavigator();

const TestStack = () => (
   <StackTest.Navigator initialRouteName="Main">
      <StackTest.Screen
        name="Main"
        component={Main}
        options={navOptionHandler}

      />
      <StackTest.Screen
        name="Instruction"
        component={Instruction}
        options={navOptionHandler}

      />
      <StackTest.Screen
        name="TestProcess"
        component={TestProcess}
        options={navOptionHandler}

      />
    </StackTest.Navigator>
)

const StackestsArchive = createStackNavigator();

const TestsArchiveStack = () => (
    <StackestsArchive.Navigator>
      <StackestsArchive.Screen
        name="TestsArchive"
        component={TestsArchive}
        options={navOptionHandler}
      />
    </StackestsArchive.Navigator>
  );

const StackRehabPlan = createStackNavigator();

const RehabPlanStack = () => (
    <StackRehabPlan.Navigator initialRouteName="RehabPlan">
      <StackRehabPlan.Screen
        name="RehabPlan"
        component={RehabPlan}
        options={navOptionHandler}
      />
      <StackRehabPlan.Screen
        name="Exercise"
        component={Exercise}
        options={navOptionHandler}
      />
    </StackRehabPlan.Navigator>
  );

const Drawer = createDrawerNavigator();

function DrawerNavigator({navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent= {props => <CustomDrawerContent {...props}/>}>
      <Drawer.Screen name="Main" component={TestStack} />
      <Drawer.Screen name="Rehabilitation Program" component={RehabPlanStack} />
      <Drawer.Screen name="Tests Archive" component={TestsArchiveStack} />
    </Drawer.Navigator>
  );
}

const StackApp = createStackNavigator();

export default function App(){
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <Fragment >
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
        <StackApp.Navigator initialRouteName="Login">
          <StackApp.Screen
            name="HomeApp"
            component={DrawerNavigator}
            options={navOptionHandler}
          />
          <StackApp.Screen
            name="Login"
            component={Login}
            options={navOptionHandler}
          />
        </StackApp.Navigator>
      </NavigationContainer>
      </Fragment>
    </Provider>
  );
};