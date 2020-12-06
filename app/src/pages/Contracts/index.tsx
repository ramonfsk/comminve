import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import ContractService, { Contract } from '../../services/contract.service';
import { Machine } from '../../services/machine.service';

const Contracts = () => {
  // contracts
  const [contracts, setContracts] = useState<Contract[]>([]);
  // navigation
  const navigation = useNavigation();
  // route params
  const route = useRoute();
  const routeParams = route.params as Machine;

  const isFocused = useIsFocused();


  function handleNavigateToContractDetailsPage(contract: Contract) {
    navigation.navigate('DetailsContract', { 
      contract: contract,
    });
  }

  function handleNavigateToAddNewContractPage() {
    navigation.navigate('FormAddContract', { machine: routeParams });
  }

  function _sortContracts(data: Contract[]) {
    if (data.length > 0) {
      const cntrts = data;
      cntrts.sort((a: Contract, b: Contract) => { return ((b.id as number) - (a.id as number)) });
      return cntrts;
    }
    return data;
  }

  function _loadData() {
    ContractService.findAllByMachine(routeParams.id)
      .then(data => {
        if (!data || data.length === 0) {
          console.log(`There are no persistent Contracts data in SQLite!`);
        } else {
          console.log(`Load values in page: Contracts.tsx`);
          const contracts = _sortContracts(data);
          setContracts(contracts);
        }
      })
    .catch((err: any) => console.log(`Error to restore Contracts from SQLite.\n${err}`));
  }

  useEffect(() => {
    _loadData();
  }, [isFocused]);
  
  const renderItem = ({ item } : {item: Contract}) => {
    return (
      <RectButton
        onPress={() => handleNavigateToContractDetailsPage(item)}
        style={[styles.item, item.isActive ? { backgroundColor: '#04D361' } : { backgroundColor: '#8257e5' } ]}
      >
        <Text style={styles.itemText}>
          {`Contrato ${item.id} | ${item.locatorName}`}
        </Text>
        <MaterialIcons style={styles.buttonIcon} name="navigate-next" />
      </RectButton>
    );
  };

  // const _keyExtractor = (item: Contract) => String(item.id);

  return (
    <>
      <PageHeader title="Contratos" defaultBack={true} />

      <View style={styles.container}>
        <Text style={styles.title}>Lista de Contratos</Text>

        <View style={styles.listItens}>
          <FlatList
            data={contracts}
            extraData={contracts}
            renderItem={renderItem}
            keyExtractor={(item: Contract) => item.id.toString()}
            // keyExtractor={_keyExtractor}
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