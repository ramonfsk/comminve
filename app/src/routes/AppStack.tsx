import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../pages/Home';
import FormAddMachine from '../pages/FormAddMachine';
import MachineTabs from './MachineTabs';
import FormAddContract from '../pages/FormAddContract';
import DetailsContract from '../pages/DetailsContract';

const { Navigator, Screen } = createStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }} >
        <Screen name="Home" component={Home} />
        <Screen name="FormAddMachine" component={FormAddMachine} />
        <Screen name="MachineTabs" component={MachineTabs} />
        <Screen name="FormAddContract" component={FormAddContract} />
        <Screen name="DetailsContract" component={DetailsContract} />
      </Navigator>
    </NavigationContainer>
  );
};

export default AppStack;