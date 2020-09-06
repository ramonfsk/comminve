import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text ,Image, FlatList } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import storage from '../../database/offline/';

import logo from '../../assets/imgs/logo6.png';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

const Home = () => {
  const [machines, setMachines] = useState<Machine[]>([]);

  const [liquidCash, setLiquidCash] = useState(0);
  const [partialCash, setPartialCash] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  
  const isFocus = useIsFocused();
  // navigation
  const navigation = useNavigation();
  // check params
  const route = useRoute();
  const routeParams = route.params as Machine[];
  //console.log(`params: ${JSON.stringify(routeParams)}`);
  if (
    typeof(routeParams) !== 'undefined'
    // || machines.length > 0
    && JSON.stringify(routeParams) !== JSON.stringify(machines)
  ) {
    setMachines(routeParams);
  }


  function handleNavigateToMachineDetailsPage(machine: Machine) {
    navigation.navigate('MachineTabs', {
      machine: machine
    });
  }

  function handleNavigateToAddMachinePage() {
    navigation.navigate('FormAddMachine');
  }

  function _sortMachines(data) {
    if (data.length > 0) {
      const machs = data;
      machs.sort((a: Machine, b: Machine) => { return (a.idMachine - b.idMachine) });
      setMachines(machs);
    }
  }

  function _calcCash(data) {
    if (data.length > 0) {
      let sumTotalCash = 0.0;
      data.map(item => {
        sumTotalCash += item.cashValue;
      });
      setTotalCash(sumTotalCash);
      const partial = sumTotalCash * 0.2;
      setPartialCash(partial);
      setLiquidCash(totalCash - partial);
    }
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then(data => {
        if (!data) {
          console.log(`There are no persistent Machines data in AsyncStorage!`);
        } else {
          setMachines(data);
          console.log(`loadData(Home)`);
          _sortMachines(data);
          _calcCash(data);
        }
      })
    .catch(err => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
  }

  useEffect(() => {
    _loadData();
  }, [isFocus]);
  
  const renderItem = ({ item }) => {
    return (
      <RectButton
        onPress={() => handleNavigateToMachineDetailsPage(item)}
        style={styles.item}
      >
        <Text style={styles.itemText}>
          {`Máquina ` + item.idMachine}
        </Text>
        <MaterialIcons style={styles.buttonIcon} name="navigate-next" />
      </RectButton>
    );
  };

  return (
    <View style={styles.container}>
      {/* {storage.delete(STRGK_MACHINES)} */}
      <Image 
        style={styles.logo}
        source={logo} 
      />   
  
      <View style={styles.listItens}>
        <FlatList
          data={machines}
          extraData={machines}
          renderItem={renderItem}
          keyExtractor={(item: Machine) => item.idMachine.toString()}
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

      <View style={styles.cashItem}>
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
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    flex: 0.15,
    width: '40%',
    marginBottom: 20,
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
  emptyList: {
    fontSize: 22,
    textAlign: 'center'
  },
  listItens: {
    flex: .70,
    width: '90%',
    //height: '30%',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#C9C9CB',
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    height: 60,
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
    fontSize: 30,
    //textAlign: 'center',
    color: '#fff'
  },
  button: {
    flexDirection: 'row',
    width: '80%',
    height: 46,
    marginVertical: 8,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#8257e5'
  },
  buttonText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: 30,
    color: '#fff'
  },
  buttonIcon: {
    fontSize: 42,
    color: '#fff'
  },
  cashItem: {
    flex: 0.16,
    width: '100%',
    height: 44,
    marginBottom: 39,
    //borderTopWidth: 2.6,
    //borderColor: '#000',
  },
  cashItemText: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#23B575'
  },
});