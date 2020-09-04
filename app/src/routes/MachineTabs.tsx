import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import MachineDetails from '../pages/MachineDetails';
import Historic from '../pages/Contract';
import CashWithdrawal from '../pages/Readings';

interface Machine {
  machineNumber: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

const { Navigator, Screen } = createBottomTabNavigator();

const MachineTabs = () => {
  const route = useRoute();
  const routeParams = route.params?.machine as Machine;

  return (
    <Navigator
      tabBarOptions={{
        style: {
          elevation: 0,
          shadowOpacity: 0,
          height: 64
        },
        tabStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          //borderTopWidth: 2.6,
          //borderColor: '#000'
        },
        iconStyle:{
          flex: 0,
          width: 24,
          height: 24
        },
        labelStyle: {
          fontFamily: 'Archivo_700Bold',
          fontSize: 14,
          marginHorizontal: 12
        },
        inactiveBackgroundColor: '#fafafc',
        activeBackgroundColor: '#ebebf5',
        inactiveTintColor: '#c1bccc',
        activeTintColor: '#32264d'
      }}
    >
      <Screen 
        name="MachineDetails" 
        component={MachineDetails}
        options={{
          tabBarLabel: 'Detalhes',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="assignment" size={size} color={color} />
            );
          }
        }}
        initialParams={routeParams}
      />
      <Screen 
        name="Contract" 
        component={Historic}
        options={{
          tabBarLabel: 'Contrato',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="receipt" size={size} color={color} />
            );
          }
        }}
        initialParams={routeParams}
      />
      <Screen 
        name="Readings" 
        component={CashWithdrawal} 
        options={{
          tabBarLabel: 'Leituras',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcons name="attach-money" size={size} color={color} />
            );
          }
        }}
        initialParams={routeParams}
      />
    </Navigator>
  );
};

export default MachineTabs;