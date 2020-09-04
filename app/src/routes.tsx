import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import FormAddMachine from './pages/FormAddMachine';
import MachineDetails from './pages/MachineDetails';
import Historic from './pages/Contract';
import CashWithdrawal from './pages/Readings';

const { Navigator, Screen } = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }} >
        <Screen name="Home" component={Home} />
        <Screen name="FormAddMachine" component={FormAddMachine} />
        <Screen name="MachineDetails" component={MachineDetails} />
        <Screen name="Historic" component={Historic} />
        <Screen name="CashWithdrawal" component={CashWithdrawal} />
      </Navigator>
    </NavigationContainer>
  );
};

export default Routes;