import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import storage from '../../database/offline/index.js';

import PageHeader from '../../components/PageHeader';

interface Params {
  machine: Machine;
  contract: Contract;
}

interface Machine {
  idMachine: number,
  clockValue: number,
  cashValue: number,
  giftsQuantity: number,
  maxGiftsQuantity: number
}

interface Contract {
  idContract: number,
  isActive: boolean,
  typeContract: boolean,
  dateSign: string,
  idMachine: number,
  placeName: string,
  address: string,
  cep: string,
  locatorName: string,
  cpf: string,
  signatureB64: string,
  percentage: number,
  rentValue: number,
}

const Contracts = () => {
  // contracts
  const [contracts, setContracts] = useState<Contract[]>([]);
  // navigation
  const navigation = useNavigation();
  // route params
  const route = useRoute();
  const routeParams = route.params as Params;
  if (typeof(routeParams.contract) !== 'undefined') {
    const index = contracts.findIndex(contract => contract.idContract === routeParams.contract.idContract)
    if (index === -1) {
        const contractsSwap = contracts;
        contractsSwap.push(routeParams.contract);
        setContracts(contractsSwap);
        // _loadData();
    }
  }

  const STRGK_CONTRACTS = `@comminve#machine${routeParams.machine.idMachine}_contracts`;

  function handleNavigateToContractDetailsPage(contract: Contract) {
    navigation.navigate('DetailsContract', { 
      contract: contract,
    });
  }

  function handleNavigateToAddNewContractPage() {
    navigation.navigate('FormAddContract', { machine: routeParams.machine });
  }

  function _sortContracts(data: Contract[]) {
    if (data.length > 0) {
      const cntrts = data;
      cntrts.sort((a: Contract, b: Contract) => { return (b.idContract - a.idContract ) });
      return cntrts;
    }
    return data;
  }

  function _loadData() {
    storage.get(STRGK_CONTRACTS)
    .then((data: Contract[]) => {
      if (!data) {
        console.log(`There are no persistent Contracts data in AsyncStorage!`);
      } else {
        const machines = _sortContracts(data);
        setContracts(machines);
        console.log(`loadData(Contract)`);
      }
    })
  .catch((err: Error) => console.log(`Error to restore contracts from AsyncStorage.\n${err}`));
  }

  useEffect(() => {
    _loadData();
  }, []);
  
  const renderItem = ({ item } : {item: Contract}) => {
    return (
      <RectButton
        onPress={() => handleNavigateToContractDetailsPage(item)}
        style={[styles.item, item.isActive ? { backgroundColor: '#04D361' } : { backgroundColor: '#8257e5' } ]}
      >
        <Text style={styles.itemText}>
          {`Contrato ${item.idContract} | ${item.locatorName}`}
        </Text>
        <MaterialIcons style={styles.buttonIcon} name="navigate-next" />
      </RectButton>
    );
  };

  return (
    <>
      {/* {storage.delete(STRGK_CONTRACTS)} */}
      <PageHeader title="Contratos" defaultBack={true} />

      <View style={styles.container}>
        <Text style={styles.title}>Lista de Contratos</Text>

        <View style={styles.listItens}>
          <FlatList
            data={contracts}
            extraData={contracts}
            renderItem={renderItem}
            keyExtractor={(item: Contract) => item.idContract.toString()}
            refreshing={false}
            onRefresh={_loadData}
          />
        </View>

        <View style={styles.buttonGroup}>
          <RectButton
            onPress={handleNavigateToAddNewContractPage}
            style={styles.buttonAdd}
          >
            <Text style={styles.buttonText}>
              Adicionar
            </Text>
            <MaterialIcons 
              style={styles.buttonIcon} 
              name={'receipt'} 
            />
          </RectButton>
        </View>
      </View>
    </>
  );
}

export default Contracts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  title: {
    fontFamily: 'Archivo_700Bold',
    fontSize: hp('4%'),
    textAlign: 'center',
  },
  buttonGroup: {
    width: wp('80%'),
  },
  buttonAdd: {
    flexDirection: 'row',
    height: hp('6.6%'),
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#04D361'
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
  listItens: {
    //flex: 1,
    width: wp('90%'),
    height: hp('52%'),
    paddingHorizontal: 8,
    paddingVertical: 8,
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
    fontSize: hp('2.2%'),
    color: '#fff'
  },
});