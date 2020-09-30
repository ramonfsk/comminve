import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MachineDetails from '../pages/MachineDetails';
import Contracts from '../pages/Contracts';
import CashWithdrawal from '../pages/Readings';

interface Params {
  machine: object;
}

const { Navigator, Screen } = createBottomTabNavigator();

const MachineTabs = () => {
  const route = useRoute();
  const routeParams = route.params as Params;

  return (
    <Navigator
      tabBarOptions={{
        style: {
          elevation: 0,
          shadowOpacity: 0,
          height: hp('8.8%')
        },
        tabStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconStyle:{
          flex: 0,
          width: wp('4%'),
          height: hp('4%')
        },
        labelStyle: {
          fontFamily: 'Archivo_700Bold',
          fontSize: hp('2%'),
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
        initialParams={routeParams.machine}
      />
      <Screen 
        name="Contracts" 
        component={Contracts}
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
        initialParams={routeParams.machine}
      />
    </Navigator>
  );
};

export default MachineTabs;