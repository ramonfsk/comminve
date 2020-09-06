import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { useRoute, useIsFocused } from '@react-navigation/native';
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

interface Allocation {
  typeContract: boolean,
  value: string,
}

const MachineDetails = () => {
  const [machine, setMachine] = useState<Machine>();
  const [machines, setMachines] = useState<Machine[]>();
  const [allocation, setAllocation] = useState<Allocation>();
  const [valueAllocation, setValueAllocation] = useState(0);
  
  const isFocus = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;
  console.log(`params: ${routeParams}`);
  const STRGK_ALOCATIONS = `@comminve#machine${routeParams.idMachine}_allocations`;

  function _handleToggleStatusMachine() {
    alert(`Função ainda não disponível!`);
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then(data => {
        if (!data) {
          console.log(`There are no persistent Machines data in AsyncStorage!`);
        } else {
          setMachines(data);
          console.log(`loadData(MachineDetails)`);
          if (!machines) {
            setMachine(routeParams);
          } else {
            const machine = machines.find(machine => machine.idMachine === Number(routeParams.idMachine));
            setMachine(machine);
          }
        }
      })
    .catch(err => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
    _loadAllocation();
  }

  function _loadAllocation() {
    storage.get(STRGK_ALOCATIONS)
    .then(alloc => {
      if (!alloc) {
        console.log(`There are no persistent Allocation Values data in AsyncStorage!`);
      } else { 
        setAllocation(alloc);
        //console.log(`values: ${JSON.stringify(data)}`);
        console.log(`loadData(AllocationValues)!`);
        _calcAllocationValue();
      }
    })
  .catch(err => console.log(`Error to restore allocation value from AsyncStorage.\n${err}`));
  }

  function _calcAllocationValue() {
    if (!allocation.typeContract) {
      const percentual = Number(allocation.value.replace('%', ''));
      setValueAllocation((percentual / 100) * machine.cashValue);
    } else {
      setValueAllocation(Number(allocation.value));
    }
  }

  useEffect(() => {
    _loadData();
  }, [!isFocus]);


  return (
    <>
     {/* {storage.delete(STRGK_ALOCATIONS)} */}
    {/* {_loadData()} */}
      <PageHeader title="Detalhes" defaultBack={true} />

      <View style={styles.container}>
        <Text style={styles.title}>
          {`Máquina ${machine?.idMachine}`}
        </Text>

        <Text style={styles.detailsText}>{ 
          machine?.isActive ?
          `Ativa` : `Desativada`
        }</Text>
        <Text style={styles.detailsText}>{`Dinheiro em caixa: R$ ${machine?.cashValue.toFixed(2)}`}</Text>
        <Text style={styles.detailsText}>{`Quantidade de presentes: ${machine?.giftsQuantity}`}</Text>
        <Text style={styles.detailsText}>{`Custo de alocação: R$ ${allocation ? valueAllocation.toFixed(2) : 0}`}</Text>

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
    // fontFamily: 'Archivo_400Regular',
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