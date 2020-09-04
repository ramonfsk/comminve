import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import storage from '../../database/offline/';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

const MachineDetails = () => {
  const [machine, setMachine] = useState<Machine>();
  const [machines, setMachines] = useState<Machine[]>();

  const route = useRoute();
  const routeParams = route.params as Machine;

  function _handleToggleStatusMachine() {
    Alert.alert(`Função ainda não disponível!`);
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
    .then((machines: Machine[]) => {
      setMachines(machines);
      console.log(`loadData(MachineDetails)`);
    })
    .catch((err: Error) => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
  }

  useFocusEffect(() => {
    setMachine(routeParams);
  });


  return (
    <>
      <PageHeader title="Detalhes" />

      <View style={styles.container}>
        <Text style={styles.title}>
          {`Máquina ${machine?.idMachine}`}
        </Text>

        <Text style={styles.detailsText}>{ 
          machine?.isActive ?
          `Ativa` : `Desativada`
        }</Text>
        <Text style={styles.detailsText}>{`Dinheiro em caixa: ${machine?.cashValue}`}</Text>
        <Text style={styles.detailsText}>{`Quantidade de presentes: ${machine?.giftsQuantity}`}</Text>

        <View style={styles.buttons}>
          <RectButton
            onPress={_handleToggleStatusMachine}
            style={machine?.isActive ? styles.buttonDeactivate : styles.buttonActivate}
          >
            <Text style={styles.buttonText}>{
              machine?.isActive ?
              `Desativar ?` : `Ativar ?`
            }</Text>
            <MaterialIcons 
              style={styles.buttonIcon} 
              name={machine?.isActive ? 'sync-disabled' : 'sync'} 
            />
          </RectButton>

          {/* <RectButton
            onPress={_handleDeleteMachine}
            style={styles.buttonRemove}
          >
            <Text style={styles.buttonText}>
              Remover ?
            </Text>
            <MaterialIcons 
              style={styles.buttonIcon} 
              name={'delete'} 
            />
          </RectButton> */}
        </View>
      </View>
    </>
  );
}

export default MachineDetails;

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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 26
  },
  buttons: {
    position: 'absolute',
    width: '76%',
    bottom: 12
  },
  buttonActivate: {
    flexDirection: 'row',
    height: 46,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#04D361'
  },
  buttonDeactivate: {
    flexDirection: 'row',
    width: '100%',
    height: 46,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E33D3D'
  },
  buttonRemove: {
    flexDirection: 'row',
    width: '100%',
    height: 46,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E33D3D'
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
});