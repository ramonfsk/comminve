import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import { useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';

import storage from '../../database/offline/';

import PageHeader from '../../components/PageHeader';

const STRGK_MACHINES = '@comminve#machines';

interface Machine {
  idMachine: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

interface Reading {
  idReading: number,
  typeReading: number,
  idMachine: number,
  initialDate: string,
  finalDate: string,
  value: number,
  giftsQuantity: number
}

const Readings = () => {
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [valueReading, setValueReading] = useState('');
  const [giftsQuantity, setGiftsQuantity] = useState('');

  const [readings, setReadings] = useState<Reading[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);

  const isFocus = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;

  const STRGK_READINGS = `@comminve#machine${routeParams.idMachine}_readings`;

  function _updateSortReadings(data) {
    if (data.length > 0) {
      const reads = data;
      reads.sort((a: Reading, b: Reading) => { return (b.idReading - a.idReading) });
      setReadings(reads);
    }
  }

  function _loadData() {
    storage.get(STRGK_MACHINES)
      .then(data => {
          setMachines(data);
          console.log(`loadData_Machines(Readings)`);
          //console.log(`readings: ${JSON.stringify(data)}`);
          storage.get(STRGK_READINGS)
            .then(data => {
              if (!data) {
                console.log(`There are no persistent Readings data in AsyncStorage!`);
              } else {
                setReadings(data);
                console.log(`loadData(Readings)!`);
              }
            })
          .catch(err => console.log(`Error to restore readings from AsyncStorage.\n${err}`));
      })
    .catch(err => console.log(`Error to restore machines from AsyncStorage.\n${err}`));
  }

  function _saveData(data) {
    storage.push(STRGK_READINGS, data)
    .catch(err => console.log(`Failed to save readings data!\nDetails: ${err}`));
    
    let machinesSwap = machines;
    const index = machinesSwap.findIndex(machine => machine.idMachine === Number(routeParams.idMachine));
    let machine: Machine = machinesSwap[index];
    machine.giftsQuantity = data.giftsQuantity;
    if (data.typeReading == 0) {
      machine.cashValue -= data.value;
    } else {
      machine.cashValue += data.value;
    }  
      
    machinesSwap.splice(index, 1, machine);
    setMachines(machinesSwap);
    console.log(`subsSave: ${JSON.stringify(machines)}`);
    storage.save(STRGK_MACHINES, machines)
    .catch(err => console.log(`Failed to save machines data!\nDetails: ${err}`));
  }
  
  function handleAddAndSaveEntry(lastIdReading: number, typeReading: number) {
    if (!initialDate || !finalDate || !valueReading || !giftsQuantity) {
      alert(`Registro de leitura inválido, revise os campos!`);
    } else {
      const iDate = new Date(initialDate);
      const fDate = new Date(finalDate);
      if (fDate.getDay < iDate.getDay || fDate.getMonth() < iDate.getMonth() || fDate.getFullYear() < iDate.getFullYear()) {
        alert(`Data inválida!`);
      } else {
        let readingsSwap = [];
        !readings ? readingsSwap = [] : readingsSwap = readings;
        // const iDate = new Date(initialDate).toISOString();
        // const fDate = new Date(finalDate).toISOString();
        const reading = { 
          idReading: lastIdReading + 1, 
          typeReading: typeReading,
          idMachine: routeParams.idMachine,
          initialDate: initialDate,
          finalDate: finalDate,
          value: Number(valueReading),
          giftsQuantity: Number(giftsQuantity)
        }
        readingsSwap.push(reading);
        _updateSortReadings(readingsSwap);
        alert('Registro de leitura realizado com sucesso!');
        _saveData(reading);
      }
    }
  }

  function handleAddRemoval() {
    _loadData();
    if (readings.length === 0) {
      handleAddAndSaveEntry(0, 0);
    } else {
      const lastIdReading = readings[(readings.length - 1)].idReading;
      handleAddAndSaveEntry(lastIdReading, 0);
    }
  }

  function handleAddEntry() {
    _loadData();
    if (readings.length === 0) {
      handleAddAndSaveEntry(0, 1);
    } else {
      const lastIdReading = readings[(readings.length - 1)].idReading;
      handleAddAndSaveEntry(lastIdReading, 1);
    }
  }

  useEffect(() => {
    _loadData();
  }, [isFocus]);

  const renderItem = ({ item }) => {
    return (
      <View style={item.typeReading === 0 
        ? [styles.item, { backgroundColor: '#E33D3D' }]
        : [styles.item, { backgroundColor: '#04D361' }]
      }>
        <Text style={styles.itemText}>{`Data: ${item.initialDate} à ${item.finalDate}`}</Text>
        <Text style={styles.itemText}>{`Valor: R$ ${item.value}`}</Text>
        <Text style={styles.itemText}>{`Qtd: ${item.giftsQuantity}`}</Text>
      </View>
    );
  };

  return (
    <>
      {/* {storage.delete(STRGK_READINGS)} */}
      <PageHeader title="Leituras" defaultBack={true}/>
      
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Leituras</Text>

        <View style={styles.inputGroup}>
          <TextInputMask
            style={styles.input}
            type={'datetime'}
            placeholder='10/09/1995'
            options={{
              format: 'DD/MM/YYYY',
            }}
            keyboardType='number-pad'
            value={initialDate}
            onChangeText={(value) => setInitialDate(value)}
          />
          <TextInputMask
            style={styles.input}
            type={'datetime'}
            placeholder='17/09/1995'
            options={{
              format: 'DD/MM/YYYY',
            }}
            keyboardType='number-pad'
            value={finalDate}
            onChangeText={(value) => setFinalDate(value)}
          />
        </View>

        <View style={styles.inputGroup}>
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
            placeholder='R$ 99,99'
            value={String(valueReading)}
            onChangeText={(_, rawValue) => setValueReading(rawValue)}
            keyboardType='number-pad'
          />
          <TextInputMask
            style={styles.input}
            type={'only-numbers'}
            placeholder='100'
            value={String(giftsQuantity)}
            onChangeText={(value) => setGiftsQuantity(value)}
            keyboardType='number-pad'
          />
        </View>

        <View style={styles.buttonGroup}>
          <RectButton
            onPress={handleAddRemoval}
            style={styles.buttonRem}
          >
            <Text style={styles.buttonText}>
              Retirada
            </Text>
            <MaterialIcons 
              style={styles.buttonIcon} 
              name={'money-off'} 
            />
          </RectButton>

          <RectButton
            onPress={handleAddEntry}
            style={styles.buttonAdd}
          >
            <Text style={styles.buttonText}>
              Entrada
            </Text>
            <MaterialIcons 
              style={styles.buttonIcon} 
              name={'attach-money'} 
            />
          </RectButton>
        </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Archivo_700Bold',
    fontSize: 26,
    // textAlign: 'center',
    marginTop: 12,
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //marginHorizontal: 100, 
    marginBottom: 30,
  },
  input: {
    //flex: 1,
    width: '30%',
    height: 28,
    borderColor: '#000000',
    borderBottomWidth: 1.5,
    marginHorizontal: 20,
    fontSize: 18
  },
  buttonGroup: {
    //position: 'absolute',
    width: '76%',
    bottom: 12,
    alignItems: 'center',
  },
  buttonRem: {
    flexDirection: 'row',
    width: '80%',
    height: 42,
    //marginTop: '16%',
    marginBottom: 12,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E33D3D'
  },
  buttonAdd: {
    flexDirection: 'row',
    width: '80%',
    height: 42,
    //marginTop: '16%',
    marginBottom: 12,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#04D361'
  },
  buttonText: {
    fontFamily: 'Archivo_400Regular',
    fontSize: 24,
    color: '#fff'
  },
  buttonIcon: {
    fontSize: 30,
    color: '#fff'
  },
  listItens: {
    flex: 1,
    width: '90%',
    //height: 250,
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
    //backgroundColor: '#8257e5'
  },
  itemText:{
    //fontFamily: 'Archivo_400Regular',
    fontSize: 17,
    //lineHeight: 15,
    color: '#fff'
  },
});