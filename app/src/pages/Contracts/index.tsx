import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import storage from '../../database/offline/';

import PageHeader from '../../components/PageHeader';

interface Params {
  machine: Machine;
  contracts: Contract[];
}

interface Machine {
  idMachine: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
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
  const [contracts, setContracts] = useState<Contract[]>([]);

  const isFocus = useIsFocused();
  
  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as Params;
  if (
    typeof(routeParams.contracts) !== 'undefined'
    // || routeParams.contracts.length > 0
    && JSON.stringify(routeParams.contracts) !== JSON.stringify(contracts)
  ) {
    setContracts(routeParams.contracts);
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

  function _sortContracts(data) {
    if (data.length > 0) {
      const cntrts = data;
      cntrts.sort((a: Contract, b: Contract) => { return (b.idContract - a.idContract) });
      setContracts(cntrts);
    }
  }

  function _loadData() {
    storage.get(STRGK_CONTRACTS)
    .then(data => {
      if (!data) {
        console.log(`There are no persistent Contracts data in AsyncStorage!`);
      } else {
        setContracts(data);
        console.log(`loadData(Contract)`);
        // _sortContracts(data);
      }
    })
  .catch(err => console.log(`Error to restore contracts from AsyncStorage.\n${err}`));
  }

  useEffect(() => {
    // console.log(`params: ${JSON.stringify(routeParams)}`);
    _loadData();
  }, [isFocus]);

  const Item = ({ item, onPress, style }) => (
    <RectButton
    onPress={onPress}
    style={style}
    >
      <Text style={styles.itemText}>
        {`Contrato ${item.idContract} | ${item.locatorName}`}
      </Text>
      <MaterialIcons style={styles.buttonIcon} name="navigate-next" />
    </RectButton>
  );
  
  const renderItem = ({ item }) => {
    return (
      <Item 
        item={item}
        onPress={() => handleNavigateToContractDetailsPage(item)}
        style={item.isActive ? styles.itemActive : styles.item}
      />
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
    backgroundColor: '#fff'
  },
  title: {
    fontFamily: 'Archivo_700Bold',
    fontSize: 26,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 46,
  },
  detailsText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 26
  },
  buttonGroup: {
    position: 'absolute',
    width: '76%',
    bottom: 12,
    alignItems: 'center',
  },
  buttonAdd: {
    flexDirection: 'row',
    width: '80%',
    height: 46,
    marginTop: '20%',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#04D361'
  },
  buttonText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: 30,
    color: '#fff'
  },
  buttonIcon: {
    fontSize: 38,
    color: '#fff'
  },
  listItens: {
    //flex: 1,
    width: '90%',
    height: '70%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C9C9CB',
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f1f1f1',
    borderRadius: 8,
    backgroundColor: '#8257e5'
  },
  itemActive: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f1f1f1',
    borderRadius: 8,
    backgroundColor: '#04D361'
  },
  itemText:{
    fontFamily: 'Archivo_400Regular',
    fontSize: 20,
    //textAlign: 'center',
    color: '#fff'
  },
});