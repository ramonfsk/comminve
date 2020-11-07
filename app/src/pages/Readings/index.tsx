import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Keyboard } from 'react-native';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import { useRoute, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import MachineService, { Machine } from '../../services/machine.service';
import ReadingService, { Reading } from '../../services/reading.service';

const Readings = () => {
  // Reading
  const [insertedId, setInsertedId] = useState(0);
  const [date, setDate] = useState('');
  const [dateWithdrawCash, setDateWithdrawCash] = useState('');
  const [clockReadingValue, setClockReadingValue] = useState('');
  const [cashValue, setCashValue] = useState('');
  const [leavingGiftsQuantity, setLeavingGiftsQuantity] = useState('');
  // readings
  const [readings, setReadings] = useState<Reading[]>([]);
  // machine
  const [machine, setMachine] = useState<Machine>();

  const isFocus = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;

  function handleAddReading() {
    if (machine) {
      if (!moment(date).isValid() || !clockReadingValue || !leavingGiftsQuantity) {
        alert(`Registro de leitura inválido, revise os campos!`);
      } else if (Number(clockReadingValue) < Number(machine.clockValue)) {
        alert(`Valor de leitura do relógio inválida, revise o campo!`);
      } else if (Number(leavingGiftsQuantity) > machine.giftsQuantity) {
        alert(`Não há presentes suficientes para serem retirados da máquina!`);
      } else {
        let reading: Reading = {
          id: 0, // index is unusable
          typeReading: false,
          dateReading: date,
          previousClockValue: machine.clockValue,
          clockReadingValue: Number(clockReadingValue),
          cashValue: ((Number(clockReadingValue) - machine.clockValue) * 2),
          leavingGiftsQuantity: Number(leavingGiftsQuantity),
          idMachine: machine.id,
        }
        if (reading.clockReadingValue && reading.cashValue && reading.leavingGiftsQuantity) {
          _updateMachineValues(reading.clockReadingValue, reading.cashValue, reading.leavingGiftsQuantity, false);
          const swapReadings = readings;
          reading.id = insertedId;
          swapReadings.push(reading);
          _saveData(reading);

          const readingsSorted = _sortReadings(swapReadings);
          setReadings(readingsSorted);
          alert('Registro de leitura realizado com sucesso!');
        }
        setDate('');
        setClockReadingValue('');
        setLeavingGiftsQuantity('');
      }
    }
  }

  function handleRemoveCash() {
    if (!moment(dateWithdrawCash).isValid() || !cashValue) {
      alert(`Registro de retirada inválido, revise os campos!`);
    } else {
      let reading: Reading = {
        id: 0, // index is unusable
        typeReading: true,
        dateReading: dateWithdrawCash,
        previousClockValue: 0,
        clockReadingValue: 0,
        cashValue: Number(cashValue),
        leavingGiftsQuantity: 0,
        idMachine: routeParams.id
      }
      if (reading && reading.clockReadingValue === 0 && reading.leavingGiftsQuantity === 0) {
        _updateMachineValues(reading.clockReadingValue, reading.cashValue, reading.leavingGiftsQuantity, true);
        const swapReadings = readings;
        reading.id = insertedId;
        swapReadings.push(reading);
        _saveData(reading);
        
        const readingsSorted = _sortReadings(swapReadings);
        setReadings(readingsSorted);
        alert('Registro de leitura realizado com sucesso!');
      }
      setDateWithdrawCash('');
      setCashValue('');
    }
  }

  async function _updateMachineValues(clockValue: number, cashValue: number, leavingGiftsQuantity: number, typeReading: boolean) {
    if (machine) {
      machine.giftsQuantity -= leavingGiftsQuantity;
      if (typeReading) {
        machine.cashValue -= cashValue;
      } else {
        machine.clockValue = clockValue;
        machine.cashValue += cashValue;
      }
      try {
        await MachineService.updateById(machine);
      } catch (err) {
        console.log(`Failed to update machines data!\nDetails: ${err}`);
      }
    }
  }

  function _getMachine(id: number) {
    MachineService.findById(id)
      .then(data => {
        if (data) {
          console.log(`Load values of Machine ${data.id} in page: Reading.tsx`);
          setMachine(data);
        }
      })
    .catch(err => console.log(`Error to get machine id ${id} intro SQLite!\nDetails: ${err}`));
  }

  function _sortReadings(data: Reading[]) {
    if (data.length > 0) {
      const reads = data;
      reads.sort((a: Reading, b: Reading) => { return ((b.id as number) - (a.id as number)) });
      return reads;
    }
    return data;
  }

  function _saveData(data: Reading) {
    ReadingService.addData(data)
      .then(id => {
        if (id) {
          setInsertedId(id as number);
        }
      })
    .catch(err => console.log(`Failed to save new reading data!\nDetails: ${err}`));
  }

  function _loadData() {
    ReadingService.findAll()
      .then(data => {
        if (!data || data.length === 0) {
          console.log(`There are no persistent Readings data in SQLite!`);
        } else {
          console.log(`Load values in page: Reading.tsx`);
          const contracts = _sortReadings(data);
          setReadings(contracts);
        }
      })
    .catch((err: any) => console.log(`Error to restore Readings from SQLite.\n${err}`));
  }

  useEffect(() => {
    _loadData();
    _getMachine(routeParams.id);
  }, [isFocus]);

  const renderItem = ({ item } : { item: Reading }) => {
    return (
      <View style={item.typeReading  
        ? [styles.item, { backgroundColor: '#E33D3D' }]
        : [styles.item, { backgroundColor: '#04D361' }]
      }>
        <Text style={styles.itemText}>{`Data: ${item.dateReading}`}</Text>
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

  // const _keyExtractor = (item: Reading) => String(item.id);

  return (
    <>
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
                onChangeText={(_, rawValue) => setClockReadingValue(String(rawValue))}
                keyboardType='number-pad'
              />

              <TextInputMask
                style={styles.input}
                type={'only-numbers'}
                includeRawValueInChangeText={true}
                placeholder='12'
                value={leavingGiftsQuantity}
                onChangeText={(_, rawValue) => setLeavingGiftsQuantity(String(rawValue))}
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

        <View style={styles.listItems}>
          <FlatList
            data={readings}
            extraData={readings}
            renderItem={renderItem}
            keyExtractor={(item: Reading) => item.id.toString()}
            // keyExtractor={_keyExtractor}
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
  listItems: {
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