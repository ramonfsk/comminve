import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Keyboard, FlatList } from 'react-native';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';
import 'moment/locale/pt-br';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import MachineService, { Machine } from '../../services/machine.service';
import WithdrawService, { Withdraw } from '../../services/withdraw.service';

const Withdraws = () => {
  // Withdraw
  const [insertedId, setInsertedId] = useState(0);
  const [date, setDate] = useState('');
  const [cashValue, setCashValue] = useState('');
  // Withdraws
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  // machine
  const [machine, setMachine] = useState<Machine>();

  const isFocus = useIsFocused();

  const route = useRoute();
  const routeParams = route.params as Machine;

  function handleRemoveCash() {
    if (!moment(date).isValid() || !cashValue) {
      alert(`Registro de retirada inválido, revise os campos!`);
    } else {
      let withdraw: Withdraw = {
        id: 0, // index is unusable
        dateReading: date,
        cashValue: Number(cashValue),
        idMachine: routeParams.id
      }
      if (withdraw) {
        _updateMachineValues(withdraw.cashValue);
        const swapWithdraws = withdraws;
        withdraw.id = insertedId;
        swapWithdraws.push(withdraw);
        _saveData(withdraw);
        
        const withdrawsSorted = _sortWithdraws(swapWithdraws);
        setWithdraws(withdrawsSorted);
        alert('Registro de retirada realizado com sucesso!');
      }
      setDate('');
      setCashValue('');
    }
  }

  async function _updateMachineValues(cashValue: number) {
    try {
      if (machine) {
        machine.cashValue -= cashValue;
        await MachineService.updateById(machine);
      }
    } catch (err) {
      console.log(`Failed to update machines data!\nDetails: ${err}`);
    }
  }

  function _getMachine(id: number) {
    MachineService.findById(id)
      .then(data => {
        if (data) {
          console.log(`Load values of Machine ${data.id} in page: Withdraw.tsx`);
          setMachine(data);
        }
      })
    .catch(err => console.log(`Error to get machine id ${id} intro SQLite!\nDetails: ${err}`));
  }

  function _sortWithdraws(data: Withdraw[]) {
    if (data.length > 0) {
      const reads = data;
      reads.sort((a: Withdraw, b: Withdraw) => { return ((b.id as number) - (a.id as number)) });
      return reads;
    }
    return data;
  }

  function _saveData(data: Withdraw) {
    WithdrawService.addData(data)
      .then(id => {
        if (id) {
          setInsertedId(id as number);
        }
      })
    .catch(err => console.log(`Failed to save new reading data!\nDetails: ${err}`));
  }

  function _loadData() {
    WithdrawService.findAllByMachine(routeParams.id)
      .then(data => {
        if (!data || data.length === 0) {
          console.log(`There are no persistent Withdraws data in SQLite!`);
        } else {
          console.log(`Load values in page: Withdraw.tsx`);
          const contracts = _sortWithdraws(data);
          setWithdraws(contracts);
        }
      })
    .catch((err: any) => console.log(`Error to restore Withdraws from SQLite.\n${err}`));
  }

  useEffect(() => {
    _loadData();
    _getMachine(routeParams.id);
  }, [isFocus]);

  const renderItem = ({ item } : { item: Withdraw }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{`Data: ${item.dateReading}`}</Text>
        <Text style={styles.itemText}>{`Valor: R$ ${item.cashValue}`}</Text>
      </View>
    );
  };

  return(
    <>
      <PageHeader title="Retiradas" defaultBack={true}/>
      
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.title}>Lista de Retiradas</Text>
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
            data={withdraws}
            extraData={withdraws}
            renderItem={renderItem}
            keyExtractor={(item: Withdraw) => item.id.toString()}
            // keyExtractor={_keyExtractor}
            refreshing={false}
            onRefresh={_loadData}
          />
        </View>
      </View>
    </>
  );
}

export default Withdraws;

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
    backgroundColor: '#8257e5',
  },
  itemText:{
    //fontFamily: 'Archivo_400Regular',
    fontSize: hp('2%'),
    //lineHeight: 15,
    color: '#fff'
  },
});
