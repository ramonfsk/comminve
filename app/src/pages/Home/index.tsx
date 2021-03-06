import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text ,Image, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MachineService, { Machine } from '../../services/machine.service';

import logo from '../../assets/imgs/logo6.png';

import { DatabaseConnection } from '../../database/database-connection';
const db = DatabaseConnection.getConnection();

const Home = () => {
  // machines
  const [machines, setMachines] = useState<Machine[]>([]);
  // informations
  const [liquidCash, setLiquidCash] = useState(0);
  const [partialCash, setPartialCash] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  // focus?
  const isFocused = useIsFocused();
  // navigation
  const navigation = useNavigation();

  function handleNavigateToMachineDetailsPage(machine: Machine) {
    navigation.navigate('MachineTabs', {
      machine: machine
    });
  }

  function handleNavigateToAddMachinePage() {
    navigation.navigate('FormAddMachine');
  }

  function _calcCash(data: Machine[]) {
    if (data.length > 0) {
      let sumTotalCash = 0.0;
      data.map(item => {
        sumTotalCash += item.cashValue;
      });
      setTotalCash(sumTotalCash);
      const partial = sumTotalCash * 0.2;
      setPartialCash(partial);
      setLiquidCash(sumTotalCash - partial);
    }
  }

  function _loadData() {
    MachineService.findAll()
      .then(data => {
        if (!data || data.length === 0) {
          console.log(`There are no persistent Machines data in SQLite!`);
        } else {
          console.log(`Load values in page: Home.tsx`);
          _calcCash(data);
          const machines = _sortMachines(data);
          setMachines(machines);
        }
      })
    .catch(err => console.log(`Error to restore Machines from SQLite.\n${err}`));
  }

  function _sortMachines(data: Machine[]) {
    if (data.length > 0) {
      const machs = data;
      machs.sort((a: Machine, b: Machine) => { return (a.id - b.id) });
      return machs;
    }
    return data;
  }

  useEffect(() => {
    _loadData();
  }, [isFocused]);
  
  const renderItem = ({item} : { item: Machine }) => {
    return (
      <RectButton
        onPress={() => handleNavigateToMachineDetailsPage(item)}
        style={styles.item}
      >
        <Text style={styles.itemText}>
          {`Máquina ` + item.id}
        </Text>
        <MaterialIcons style={styles.buttonIcon} name="navigate-next" />
      </RectButton>
    );
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.logo}
        source={logo} 
      />   
  
      <View style={styles.listItens}>
        <FlatList
          data={machines}
          extraData={machines}
          renderItem={renderItem}
          keyExtractor={(item: Machine) => item.id.toString()}
          refreshing={false}
          onRefresh={_loadData}
        />
      </View>

      <RectButton
        style={styles.button}
        onPress={handleNavigateToAddMachinePage}
      >
        <Text style={styles.buttonText}>Adicionar</Text>
        <MaterialIcons style={styles.buttonIcon} name="add" />
      </RectButton>

      <Text style={styles.cashItemText}>
        {`PARCIAL R$ ${partialCash.toFixed(2)}`}
      </Text>
      <Text style={styles.cashItemText}>
        {`LÍQUIDO R$ ${liquidCash.toFixed(2)}`}
      </Text>
      <Text style={styles.cashItemText}>
        {`TOTAL R$ ${totalCash.toFixed(2)}`}
      </Text>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  logo: {
    width: wp('18%'),
    height: hp('18%'),
    aspectRatio: 1,
    marginBottom: 12,
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
  listItens: {
    width: wp('90%'),
    height: hp('50%'),
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#C9C9CB',
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    height: hp('6.6%'),
    marginBottom: 10,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f1f1f1',
    borderRadius: 8,
    backgroundColor: '#8257e5'
  },
  itemText:{
    fontFamily: 'Archivo_400Regular',
    fontSize: hp('3%'),
    color: '#fff'
  },
  button: {
    flexDirection: 'row',
    width: wp('80%'),
    height: hp('6.6%'),
    marginVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#8257e5'
  },
  buttonText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: hp('4%'),
    color: '#fff'
  },
  buttonIcon: {
    fontSize: hp('4%'),
    color: '#fff'
  },
  cashItemText: {
    fontSize: hp('4%'),
    fontWeight: '700',
    textAlign: 'center',
    color: '#23B575'
  },
});