import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Modal, TouchableHighlight, Keyboard } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { useRoute, useIsFocused, useNavigation } from '@react-navigation/native';
import { RectButton, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import storage from '../../database/offline/index.js';
import { TextInputMask } from 'react-native-masked-text';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  clockValue: number,
  cashValue: number,
  giftsQuantity: number,
  maxGiftsQuantity: number
}

interface Allocation {
  typeContract: boolean,
  value: string,
}

const MachineDetails = () => {
  // machine props
  const [machine, setMachine] = useState<Machine>();
  // machines
  const [machines, setMachines] = useState<Machine[]>([]);
  // allocation cost
  const [allocation, setAllocation] = useState<Allocation>();
  const [valueAllocation, setValueAllocation] = useState(0);
  // quantity gifts
  const [giftsQuantity, setGiftsQuantity] = useState('');

  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Machine;
  const STRGK_ALOCATIONS = `@comminve#machine${routeParams.idMachine}_allocations`;

  if (!machine) {
    _loadData();
  }

  function handleAddGifts() {
    if (!giftsQuantity) {
      alert(`Quantidade de ursos inválida!`);
    } else if (Number(giftsQuantity) > (machine.maxGiftsQuantity - machine.giftsQuantity)) {
      alert(`Quantidade de ursos supera a máxima!`);
    } else {
      _updateMachineValues(Number(giftsQuantity));
      // const mach = machine;
      // mach.giftsQuantity += Number(giftsQuantity);
      // setMachine(mach);
      setGiftsQuantity('');
    }
  }

  function _updateMachineValues(giftsQuantity: number) {
    let mach = machine;
    mach.giftsQuantity += giftsQuantity;

    const machinesSwap = machines;
    machinesSwap.splice((mach.idMachine - 1), 1, machine);
    setMachines(machinesSwap);
    console.log(`subsSave: ${JSON.stringify(machines)}`);
    storage.save(STRGK_MACHINES, machines)
    .catch(err => console.log(`Failed to update machines data!\nDetails: ${err}`));
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then((data: Machine[]) => {
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
    .catch((err: Error) => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
    _loadAllocation();
  }

  function _loadAllocation() {
    storage.get(STRGK_ALOCATIONS)
    .then((alloc: Allocation) => {
      if (!alloc) {
        console.log(`There are no persistent Allocation Values data in AsyncStorage!`);
      } else { 
        setAllocation(alloc);
        //console.log(`values: ${JSON.stringify(data)}`);
        console.log(`loadData(AllocationValues)!`);
        _calcAllocationValue();
      }
    })
  .catch((err: Error) => console.log(`Error to restore allocation value from AsyncStorage.\n${err}`));
  }

  function _calcAllocationValue() {
    if (allocation) {
      if (!allocation.typeContract) {
        const percentual = Number(allocation.value.replace('%', ''));
        if (machine){
          setValueAllocation((percentual / 100) * machine.cashValue);
        }
      } else {
        setValueAllocation(Number(allocation.value));
      }
    }
  }

  // useEffect(() => {
  //   return () => _loadData();
  // }, [isFocused]);

  useEffect(() => {
    navigation.addListener('focus', () => _loadData());
  }, [isFocused]);

  return (
    <>
     {/* {storage.delete(STRGK_ALOCATIONS)} */}
      <PageHeader title="Detalhes" defaultBack={true} />

      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.title}>
            {`Máquina ${machine?.idMachine}`}
          </Text>
          
          <Text style={styles.detailsText}>{`Relógio:  ${machine?.clockValue}`}</Text>
          <Text style={styles.detailsText}>{`Dinheiro em caixa: R$ ${machine?.cashValue.toFixed(2)}`}</Text>
          <Text style={styles.detailsText}>{`Quantidade de presentes: ${machine?.giftsQuantity}`}</Text>
          <Text style={styles.detailsText}>{`Quantidade de máxima: ${machine?.maxGiftsQuantity}`}</Text>
          <Text style={styles.detailsText}>{`Alocação: R$ ${allocation ? valueAllocation.toFixed(2) : 0}`}</Text>

          <View style={styles.form}>
            <TextInputMask
              style={styles.input}
              type={'only-numbers'}
              includeRawValueInChangeText={true}
              placeholder='10 Ursos'
              value={giftsQuantity}
              onChangeText={(_, rawValue) => setGiftsQuantity(rawValue)}
              keyboardType='number-pad'
            />
            <RectButton
              onPress={handleAddGifts}
              style={[styles.button, { backgroundColor: '#04D361' }]}
            >
              <Text style={styles.buttonText}>
                Adicionar Ursos
              </Text>
              <MaterialIcons 
                style={styles.buttonIcon} 
                name='add' 
              />
            </RectButton>
          </View>
        </TouchableWithoutFeedback>
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
    fontSize: hp('4%'),
    textAlign: 'center',
    marginTop: 12,
    marginBottom: hp('6%'),
  },
  detailsText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: hp('2.8%'),
    textAlign: 'center',
    marginBottom: hp('2%')
  },
  form: {
    // position: 'absolute',
    width: wp('80%'),
    marginBottom: 2,
    // paddingVertical: 10,
    bottom: 12
  },
  button: {
    flexDirection: 'row',
    height: hp('6.6%'),
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
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
  input: {
    width: wp('50%'),
    height: hp('5.2%'),
    alignSelf: 'center',
    borderColor: "#000000",
    borderBottomWidth: 1.5,
    marginTop: hp('16%'),
    marginBottom: 8,
    textAlign: 'center',
    fontSize: hp('4%')
  },
});