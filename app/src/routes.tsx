import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import FormAddMachine from './pages/FormAddMachine';
import MachineDetails from './pages/MachineDetails';
import Contracts from './pages/Contracts';
import Readings from './pages/Readings';
import Withdraws from './pages/Withdraws';

const { Navigator, Screen } = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }} >
        <Screen name="Home" component={Home} />
        <Screen name="FormAddMachine" component={FormAddMachine} />
        <Screen name="MachineDetails" component={MachineDetails} />
        <Screen name="Contracts" component={Contracts} />
        <Screen name="Readings" component={Readings} />
        <Screen name="Withdraws" component={Withdraws} />
      </Navigator>
    </NavigationContainer>
  );
};

export default Routes;