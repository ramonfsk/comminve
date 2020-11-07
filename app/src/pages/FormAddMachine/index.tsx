import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MachineService, { Machine } from '../../services/machine.service';

import PageHeader from '../../components/PageHeader';

const FormAddMachine = () => {
  // form data
  const [idMachine, setIdMachine] = useState('');
  const [clockValue, setClockValue] = useState('');
  const [maxGiftsQuantity, setMaxGiftsQuantity] = useState('');
  const [giftsQuantity, setGiftsQuantity] = useState('');
  // machines
  const [machines, setMachines] = useState<Machine[]>([]);
  // navigation
  const navigation = useNavigation();
  // functions
  function _handleAddMachine() {
    try {
      _loadData();
      if (!machines) {
        if (!idMachine) {
          alert(`Registro de máquina inválido, revise os campos!`);
        } else {
          handleSaveDataAndReturnToHome();
        }
      } else {
        const result = machines.find(machine => machine.id === Number(idMachine));
        //console.log(`result: ${JSON.stringify(result)}`);
        if (!idMachine) {
          alert(`Registro de máquina inválido, revise os campos!`);
        } else if (result && result.id === Number(idMachine)) {
          alert(`Máquina já existe, escolha outro número!`);
        } else if (Number(giftsQuantity) > Number(maxGiftsQuantity)) {
          alert(`A quantidade atual de ${giftsQuantity} presentes não pode ser maior que a máxima ${maxGiftsQuantity} permitida!`);
        } else {
          handleSaveDataAndReturnToHome();
        }
      }
    } catch (err) {
      console.log(`Error to register new Machine.\nDetails: ${err}`);
    }
  }

  function handleSaveDataAndReturnToHome() {
    const machine: Machine = {
      id: Number(idMachine),
      clockValue: Number(clockValue),
      cashValue: 0,
      giftsQuantity: Number(giftsQuantity),
      maxGiftsQuantity: Number(maxGiftsQuantity)
    };
    _saveData(machine);
    alert(`Máquina ${idMachine} cadastrada com sucesso!`);
    if(navigation.canGoBack()) {
      navigation.goBack();
    };
  }

  function _loadData() {
    MachineService.findAll()
      .then(data => {
        if (!data || data.length === 0) {
          console.log(`There are no persistent Machines data in SQLite!`);
        } else {
          console.log(`loadData(Home)`);
          const machines = data;
          setMachines(machines);
        }
      })
    .catch((err: any) => console.log(`Error to restore machines from SQLite.\n${err}`));
  }

  async function _saveData(data: Machine) {
    try {
      await MachineService.addData(data);
    } catch (err) {
      console.log(`Failed to save new machine data!\nDetails: ${err}`);
    }
  }
  // hooks
  useEffect(() => {
    _loadData();
  }, []);
  // render
  return (
    <View style={styles.container}>
      <PageHeader title='Registro de Máquina' defaultBack={true} />
        <TouchableWithoutFeedback style={styles.form} onPress={Keyboard.dismiss}>
          <TextInputMask
            style={styles.input}
            type={'only-numbers'}
            placeholder='Número da Máquina: 1'
            keyboardType='number-pad'
            value={String(idMachine)}
            onChangeText={(text) => setIdMachine(text)}
          />

          <TextInputMask
            style={styles.input}
            type={'only-numbers'}
            includeRawValueInChangeText={true}
            placeholder='Valor atual do relógio: 1299'
            value={String(clockValue)}
            onChangeText={(value) => setClockValue(value)}
            keyboardType='number-pad'
          />

          <TextInputMask
            style={styles.input}
            type={'only-numbers'}
            placeholder='Quantidade atual: 100'
            value={String(giftsQuantity)}
            onChangeText={(value) => setGiftsQuantity(value)}
            keyboardType='number-pad'
          />

          <TextInputMask
            style={styles.input}
            type={'only-numbers'}
            placeholder='Quantidade Máxima: 120'
            value={String(maxGiftsQuantity)}
            onChangeText={(value) => setMaxGiftsQuantity(value)}
            keyboardType='number-pad'
          />

          <RectButton 
            style={styles.button}
            onPress={_handleAddMachine}
          >
            <Text style={[styles.buttonText]}>Salvar</Text>
            <MaterialIcons name="save" size={hp('4%')} color={'#fff'}/>
          </RectButton>
        </TouchableWithoutFeedback>
    </View>
  );
}

export default FormAddMachine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  form: {
    alignItems: 'center',
    marginTop: 8,
    // backgroundColor: 'red'
  },
  input: {
    width: wp('80%'),
    height: hp('8%'),
    marginBottom: 12,
    borderColor: "#000000",
    borderBottomWidth: 1.5,
    fontSize: 18,
    // backgroundColor: 'blue'
  },
  button: {
    flexDirection: 'row',
    width: wp('80%'),
    height: hp('6.6%'),
    paddingHorizontal: 18,
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#8257e5'
  },
  buttonText: {
    fontFamily: 'Archivo_700Bold',
    fontSize: hp('4%'),
    color: '#fff'
  }
});