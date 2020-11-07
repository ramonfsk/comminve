import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import MachineService, { Machine } from '../../services/machine.service';
import ContractService, { Contract } from '../../services/contract.service';

interface Allocation {
  typeContract: boolean,
  value: number,
}

const MachineDetails = () => {
  // machine props
  const [machine, setMachine] = useState<Machine>();
  // allocation cost
  const [allocation, setAllocation] = useState<Allocation>();
  const [valueAllocation, setValueAllocation] = useState(0);
  // quantity gifts
  const [giftsQuantity, setGiftsQuantity] = useState('');
  // current gifts
  const [currentGiftsQuantity, setCurrentGiftsQuantity] = useState(0);

  const isFocused = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;

  function handleAddGifts() {
    if (!giftsQuantity && !machine) {
      alert(`Quantidade de ursos inválida!`);
      setGiftsQuantity('');
      return;
    }
    if (machine) {
      if (Number(giftsQuantity) > (machine.maxGiftsQuantity - machine.giftsQuantity)) {
        alert(`Quantidade de ursos supera a máxima permitida!`);
        setGiftsQuantity('');
        return;
      }
      const sumGiftsQuantity = Number(giftsQuantity) + machine.giftsQuantity;
      setCurrentGiftsQuantity(sumGiftsQuantity);
      setGiftsQuantity('');
      _updateGiftsQuantityMachine(sumGiftsQuantity);
    }
  }

  async function _updateGiftsQuantityMachine(giftsQuantity: number) {
    if (machine) {
      const { id, cashValue, clockValue, maxGiftsQuantity } = machine;
      await MachineService.updateById({ id, cashValue, clockValue, giftsQuantity, maxGiftsQuantity});
    }
  }

  function _calcAllocationValue() {
    if (allocation) {
      if (!allocation.typeContract) {
        if (machine){
          setValueAllocation((allocation.value / 100) * machine.cashValue);
        }
      } else {
        setValueAllocation(allocation.value);
      }
    }
  }

  async function _getContractActiveMachine() {
    if (machine) {
      const contract: Contract = await ContractService.findActiveContractByMachine(machine.id);
      if (!contract) {
        console.log(`There are no persistent Contracts data in SQLite!`);
      } else {
        const allocation: Allocation = {
          typeContract: contract.typeContract,
          value: contract.typeContract ? contract.rentValue : contract.percentage
        };
        setAllocation(allocation);
      }
    }
  }

  async function _loadData() {
    const machine: Machine = await MachineService.findById(routeParams.id);
    if (machine) {
      setMachine(machine);
      setCurrentGiftsQuantity(machine.giftsQuantity);
      _getContractActiveMachine();
      _calcAllocationValue();
      console.log(`Load values in page: MachineDetails.tsx`);
    }
  }

  useEffect(() => {
    _loadData();
  }, [isFocused]);

  return (
    <>
      <PageHeader title="Detalhes" defaultBack={true} />

      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.title}>
            {`Máquina ${machine?.id}`}
          </Text>
          
          <Text style={styles.detailsText}>{`Relógio:  ${machine?.clockValue}`}</Text>
          <Text style={styles.detailsText}>{`Dinheiro em caixa: R$ ${machine?.cashValue.toFixed(2)}`}</Text>
          <Text style={styles.detailsText}>{`Quantidade de presentes: ${currentGiftsQuantity}`}</Text>
          <Text style={styles.detailsText}>{`Quantidade máxima: ${machine?.maxGiftsQuantity}`}</Text>
          <Text style={styles.detailsText}>{`Alocação: R$ ${allocation ? valueAllocation.toFixed(2) : 0}`}</Text>

          <View style={styles.form}>
            <TextInputMask
              style={styles.input}
              type={'only-numbers'}
              includeRawValueInChangeText={true}
              placeholder='10 Ursos'
              value={giftsQuantity}
              onChangeText={(_, rawValue) => setGiftsQuantity(String(rawValue))}
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