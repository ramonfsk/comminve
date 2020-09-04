import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';

const STRGK_CONTRACTS = '@comminve#contracts';

const data = [
  {
    idContract: 1,
    isActive: false,
    typeContract: 0,
    idMachine: 1,
    placeName: 'padaria',
    address: 'QR BBBB',
    cep: '111',
    locatorName: 'Ramon',
    cpf: '000999999-22',
    signatureB64: 'ASDCW2',
    percentage: 0,
    rentValue: 10,
  },
  {
    idContract: 2,
    isActive: true,
    typeContract: 1,
    idMachine: 1,
    placeName: 'padaria',
    address: 'QR BBBB',
    cep: '111',
    locatorName: 'Edvaldo',
    cpf: '000999999-22',
    signatureB64: 'ASDCW2',
    percentage: 0,
    rentValue: 10,
  }
];

const Contract = () => {

  function handleNavigateToContractDetailsPage() {

  }

  function handleNavigateToAddNewContractPage() {

  }

  async function _load() {

  }

  useFocusEffect(() => {

  });

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
        onPress={() => handleNavigateToContractDetailsPage() }
        style={item.isActive ? styles.itemActive : styles.item}
      />
    );
  };

  return (
    <>
      <PageHeader title="Contratos" />

      <View style={styles.container}>
        <Text style={styles.title}>Lista de Contratos</Text>

        <View style={styles.listItens}>
          <FlatList
            data={data}
            extraData={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.idContract.toString()}
            refreshing={false}
            onRefresh={_load}
          />
        </View>

        <View style={styles.buttonGroup}>
          <RectButton
            onPress={() => {}}
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

export default Contract;

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