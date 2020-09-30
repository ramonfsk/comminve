import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Keyboard } from 'react-native';
import { RectButton, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import { useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import storage from '../../database/offline/';

import PageHeader from '../../components/PageHeader';
import { string } from 'prop-types';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  clockValue: number,
  cashValue: number,
  giftsQuantity: number,
  maxGiftsQuantity: number
}

interface Reading {
  idReading: number,
  typeReading: number,
  idMachine: number,
  date: string,
  previousClockValue: number,
  clockReadingValue: number,
  cashValue: number,
  leavingGiftsQuantity: number
}

const Readings = () => {
  // Reading
  const [date, setDate] = useState('');
  const [dateWithdrawCash, setDateWithdrawCash] = useState('');
  const [clockReadingValue, setClockReadingValue] = useState('');
  const [cashValue, setCashValue] = useState('');
  const [leavingGiftsQuantity, setLeavingGiftsQuantity] = useState('');
  // readings
  const [readings, setReadings] = useState<Reading[]>([]);
  // machines
  const [machines, setMachines] = useState<Machine[]>([]);

  const isFocus = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;

  const STRGK_READINGS = `@comminve#machine${routeParams.idMachine}_readings`;

  function addReading(lastIdReading: number) {
    const machine = _getMachine();
    if (!date || !clockReadingValue || !leavingGiftsQuantity) {
      alert(`Registro de leitura inválido, revise os campos!`);
    } else if (Number(clockReadingValue) < Number(machine.clockValue)) {
      alert(`Valor de leitura do relógio inválida, revise o campo!`);
    } else if (Number(leavingGiftsQuantity) > machine.giftsQuantity) {
    } else {
      const reading: Reading = { 
        idReading: lastIdReading + 1, 
        typeReading: 0,
        idMachine: machine.idMachine,
        date: date,
        previousClockValue: machine.clockValue,
        clockReadingValue: Number(clockReadingValue),
        cashValue: ((Number(clockReadingValue) - machine.clockValue) * 2),
        leavingGiftsQuantity: Number(leavingGiftsQuantity)
      }
      _updateMachineValues(reading.clockReadingValue, reading.cashValue, reading.leavingGiftsQuantity, 0, machine);
      alert('Registro de leitura realizado com sucesso!');
      _saveData(reading);
      setDate('');
      setClockReadingValue('');
      setLeavingGiftsQuantity('');
    }
  }

  function addWithdrawCash(lastIdReading: number) {
    if (!dateWithdrawCash || !cashValue) {
      alert(`Registro de retirada inválido, revise os campos!`);
    } else {
      const machine = _getMachine();
      // const dateRaw = dateWithdrawCash.split('/');
      // const date = new Date(`${dateRaw[1]}-${dateRaw[0]}-${dateRaw[2]}`);
      const reading: Reading = { 
        idReading: lastIdReading + 1, 
        typeReading: 1,
        idMachine: machine.idMachine,
        date: dateWithdrawCash,
        previousClockValue: 0,
        clockReadingValue: 0,
        cashValue: Number(cashValue),
        leavingGiftsQuantity: 0
      }
      _updateMachineValues(reading.clockReadingValue, reading.cashValue, reading.leavingGiftsQuantity, 1, machine);
      alert('Registro de leitura realizado com sucesso!');
      _saveData(reading);
      setDateWithdrawCash('');
      setCashValue('');
    }
  }

  function _updateMachineValues(clockValue: number, cashValue: number, leavingGiftsQuantity: number, typeReading: number, machine: Machine) {
    let mach = machine;
    mach.giftsQuantity -= leavingGiftsQuantity;
    if (typeReading == 0) {
      mach.clockValue = clockValue;
      mach.cashValue += cashValue;
    } else {
      mach.cashValue -= cashValue;
    }

    const machinesSwap = machines;
    machinesSwap.splice((mach.idMachine - 1), 1, machine);
    setMachines(machinesSwap);
    console.log(`subsSave: ${JSON.stringify(machines)}`);
    storage.save(STRGK_MACHINES, machines)
    .catch(err => console.log(`Failed to update machines data!\nDetails: ${err}`));
  }

  function _getMachine() {
    const index = machines.findIndex(machine => machine.idMachine === Number(routeParams.idMachine));
    const machine: Machine = machines[index];
    return machine;
  }

  function _sortReadings(data: Reading[]) {
    if (data.length > 0) {
      const reads = data;
      reads.sort((a: Reading, b: Reading) => { return (b.idReading - a.idReading) });
      return reads;
    }
    return data;
  }

  function _saveData(data: Reading) {
    const reads = readings;
    reads.push(data);
    const tmpReadings = _sortReadings(reads);
    setReadings(tmpReadings);
    storage.push(STRGK_READINGS, data)
    .catch(err => console.log(`Failed to save readings data!\nDetails: ${err}`));
  }

  function handleAddReading() {
    () => _loadData();
    if (readings.length === 0) {
      addReading(0);
    } else {
      const lastIdReading = readings[(readings.length - 1)].idReading;
      addReading(lastIdReading);
    }
  }

  function handleRemoveCash() {
    () => _loadData();
    if (readings.length === 0) {
      addWithdrawCash(0);
    } else {
      const lastIdReading = readings[(readings.length - 1)].idReading;
      addWithdrawCash(lastIdReading);
    }
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then(data => {
          setMachines(data);
          console.log(`loadData_Machines(Readings)`);
          storage.get(STRGK_READINGS)
            .then(data => {
              if (!data) {
                console.log(`There are no persistent Readings data in AsyncStorage!`);
              } else {
                const readings = _sortReadings(data);
                setReadings(readings);
                console.log(`loadData(Readings)!`);
              }
            })
          .catch(err => console.log(`Error to restore readings from AsyncStorage.\n${err}`));
      })
    .catch(err => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
  }

  useEffect(() => {
    _loadData();
  }, [isFocus]);

  const renderItem = ({ item } : { item: Reading }) => {
    return (
      <View style={item.typeReading === 0 
        ? [styles.item, { backgroundColor: '#04D361' }]
        : [styles.item, { backgroundColor: '#E33D3D' }]
      }>
        <Text style={styles.itemText}>{`Data: ${item.date}`}</Text>
        { item.previousClockValue 
          ? <Text style={styles.itemText}>{`Leitura anterior: ${item.previousClockValue}`}</Text>
          : null
        }
        { item.clockReadingValue 
          ? <Text style={styles.itemText}>{`Relógio: ${item.clockReadingValue}`}</Text>
          : null
        }
        <Text style={styles.itemText}>{`Valor: R$ ${item.cashValue}`}</Text>
        { item.leavingGiftsQuantity 
          ? <Text style={styles.itemText}>{`Saída de Ursos: ${item.leavingGiftsQuantity}`}</Text>
          : null
        }
      </View>
    );
  };

  return (
    <>
      {/* {storage.delete(STRGK_READINGS)} */}
      <PageHeader title="Leituras" defaultBack={true}/>
      
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.title}>Lista de Leituras</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInputMask
                style={styles.input}
                type={'datetime'}
                placeholder='17/09/1995'
                options={{
                  format: 'DD/MM/YYYY',
                }}
                keyboardType='number-pad'
                value={date}
                onChangeText={(value) => setDate(value)}
                clearTextOnFocus={true}
              />

              <TextInputMask
                style={styles.input}
                type={'only-numbers'}
                includeRawValueInChangeText={true}
                placeholder='1200'
                value={clockReadingValue}
                onChangeText={(_, rawValue) => setClockReadingValue(rawValue)}
                keyboardType='number-pad'
              />

              <TextInputMask
                style={styles.input}
                type={'only-numbers'}
                includeRawValueInChangeText={true}
                placeholder='12'
                value={leavingGiftsQuantity}
                onChangeText={(_, rawValue) => setLeavingGiftsQuantity(rawValue)}
                keyboardType='number-pad'
              />
            </View>

            <RectButton
              onPress={handleAddReading}
              style={[styles.button, { backgroundColor: '#04D361' }]}
            >
              <Text style={styles.buttonText}>
                Entrada
              </Text>
              <MaterialIcons 
                style={styles.buttonIcon} 
                name={'timer'} 
              />
            </RectButton>

            <View style={styles.inputGroup}>
              <TextInputMask
                style={styles.input}
                type={'datetime'}
                placeholder='17/09/1995'
                options={{
                  format: 'DD/MM/YYYY',
                }}
                keyboardType='number-pad'
                value={dateWithdrawCash}
                onChangeText={(value) => setDateWithdrawCash(value)}
              />
              <TextInputMask
                  style={styles.input}
                  type={'money'}
                  includeRawValueInChangeText={true}
                  options={{
                    // mask: 'R$ 999,99',
                    precision: 0,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$ ',
                  }}
                  placeholder='R$ 999'
                  value={String(cashValue)}
                  onChangeText={(_, rawValue) => setCashValue(String(rawValue))}
                  keyboardType='number-pad'
                />
              </View>
            <RectButton
              onPress={handleRemoveCash}
              style={[styles.button, { backgroundColor: '#E33D3D' }]}
            >
              <Text style={styles.buttonText}>
                Retirada
              </Text>
              <MaterialIcons 
                style={styles.buttonIcon} 
                name={'money-off'} 
              />
            </RectButton>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.listItens}>
          <FlatList
            data={readings}
            extraData={readings}
            renderItem={renderItem}
            keyExtractor={(item) => item.idReading.toString()}
            refreshing={false}
            onRefresh={_loadData}
          />
        </View>
      </View>
    </>
  );
}

export default Readings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Archivo_700Bold',
    fontSize: hp('3.2%'),
    textAlign: 'center',
    marginTop: 8,
    marginBottom: hp('2%'),
  },
  form: {
    alignItems: 'center',
    // backgroundColor: 'blue'
  },
  inputGroup: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //marginHorizontal: 100, 
    marginBottom: hp('1.6%'),
  },
  input: {
    width: wp('24%'),
    height: hp('3%'),
    borderColor: '#000000',
    borderBottomWidth: 1.5,
    marginHorizontal: wp('4%'),
    fontSize: hp('2.2%'),
    textAlign: 'center'
  },
  button: {
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('5.6%'),
    //marginTop: '16%',
    marginBottom: hp('1.2%'),
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: hp('3.2%'),
    color: '#fff'
  },
  buttonIcon: {
    fontSize: hp('4.2%'),
    color: '#fff'
  },
  listItens: {
    flex: 1,
    width: wp('90%'),
    alignSelf: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C9C9CB',
    borderRadius: 8,
  },
  item: {
    //flexDirection: 'row',
    //height: 80,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f1f1f1',
    borderRadius: 8,
  },
  itemText:{
    //fontFamily: 'Archivo_400Regular',
    fontSize: hp('2%'),
    //lineHeight: 15,
    color: '#fff'
  },
});