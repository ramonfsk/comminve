import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, Switch, AsyncStorage, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text'

import storage from '../../database/offline/';

import PageHeader from '../../components/PageHeader';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

const FormAddMachine = () => {
  const [idMachine, setIdMachine] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [cashValue, setCashValue] = useState('');
  // rawValue
  const [giftsQuantity, setGiftsQuantity] = useState('');
  const [machines, setMachines] = useState<Machine[]>([]);
  // switch
  const toggleSwitch = () => setIsActive(previousState => !previousState);

  const navigation = useNavigation();

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
        const result = machines.find(machine => machine.idMachine === Number(idMachine));
        console.log(`result: ${JSON.stringify(result)}`);
        if (!idMachine) {
          alert(`Registro de máquina inválido, revise os campos!`);
        } else if (result && result.idMachine === Number(idMachine)) {
          alert(`Máquina já existe, escolha outro número!`);
        } else {
          handleSaveDataAndReturnToHome();
        }
      }
    } catch (err) {
      console.log(`Error to register new Machine.\nDetails: ${err}`);
    }
  }

  function handleSaveDataAndReturnToHome() {
    const machine = {
      idMachine: Number(idMachine),
      isActive: isActive,
      cashValue: Number(cashValue),
      giftsQuantity: Number(giftsQuantity)
    };
    _saveData(machine);
    alert('Máquina cadastrada com sucesso!');
    navigation.reset({
      index: 0,
      routes: [{
        name: 'Home',
        params: machines
      }],
    });
  }

  function _addSortMachines(machine) {
    const machs = machines;
    machs.push(machine);
    machs.sort((a: Machine, b: Machine) => { return (a.idMachine - b.idMachine) });
    setMachines(machs);
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then(data => {
        if (!data) {
          console.log(`There are no persistent Machines data in AsyncStorage!`);
        } else {
          setMachines(data);
          console.log(`loadData(FormAddMachine)`);
        }
      })
    .catch(err => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
  }

  function _saveData(data: {}) {
    _addSortMachines(data);
    storage.push(STRGK_MACHINES, data)
    .catch(err => console.log(`Failed to save data!\nDetails: ${err}`));
  }

  useEffect(() => {
    _loadData();
  }, []);

  return (
    <>
      <PageHeader title='Registro de Máquina' />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputGroupBlock}>
            <TextInputMask
              style={styles.input}
              type={'only-numbers'}
              placeholder='Número'
              keyboardType='number-pad'
              value={String(idMachine)}
              onChangeText={(text) => setIdMachine(text)}
            />
          </View>

          <View style={styles.inputGroupBlock}>
            <Text style={styles.label}>Ativa?</Text>
            <Switch
              ios_backgroundColor='#3e3e3e'
              onValueChange={toggleSwitch}
              value={isActive}
            />
          </View>
        </View>

        <TextInputMask
          style={styles.input}
          type={'money'}
          includeRawValueInChangeText={true}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
            suffixUnit: ''
          }}
          placeholder='R$ 100,00'
          value={String(cashValue)}
          onChangeText={(_, rawValue) => setCashValue(String(rawValue))}
          keyboardType='numeric'
        />

        <TextInputMask
          style={styles.input}
          type={'only-numbers'}
          placeholder='100'
          value={String(giftsQuantity)}
          onChangeText={(value) => setGiftsQuantity(value)}
          keyboardType='numeric'
        />

        <RectButton 
          style={styles.button}
          onPress={_handleAddMachine}
        >
          <Text style={styles.buttonText}>Salvar</Text>
          <MaterialIcons name="save" size={32} color={'#fff'}/>
        </RectButton>
      </View>
    </>
  );
}

export default FormAddMachine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  form: {
    //flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    width: '86%',
    height: 50,
    borderColor: "#000000",
    borderBottomWidth: 1.5,
    marginBottom: 12,
    fontSize: 18
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  inputGroupBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '43%'
  },
  label: {
    paddingLeft: '38%',
    fontSize: 18,
  },
  button: {
    // position: 'absolute',
    flexDirection: 'row',
    width: '70%',
    height: 46,
    paddingHorizontal: 18,
    marginTop: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#8257e5'
  },
  buttonText: {
    fontFamily: 'Archivo_700Bold',
    fontSize: 26,
    color: '#fff'
  }
});