import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { StyleSheet, View, Text, Switch, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { RectButton, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import storage from '../../database/offline/index.js';
import Sign from '../../components/Signature/index.js';

import PageHeader from '../../components/PageHeader';

interface Machine {
  idMachine: number,
  clockValue: number,
  cashValue: number,
  giftsQuantity: number,
  maxGiftsQuantity: number
}
interface Contract {
  idContract: number,
  isActive: boolean,
  typeContract: boolean,
  dateSign: string,
  idMachine: number,
  placeName: string,
  address: string,
  city: string,
  cep: string,
  locatorName: string,
  cpf: string,
  cellphone: string,
  percentage: string,
  rentValue: number,
  signatureB64: string,
}

interface Allocation {
  typeContract: boolean,
  value: string
}
interface Params {
  machine: Machine
}

const FormAddContract = () => {
  const [typeContract, setTypeContract] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [locatorName, setLocatorName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [percentage, setPercentage] = useState('');
  const [rentValue, setRentValue] = useState('');
  const [signatureB64, setSignatureB64] = useState('');

  const [contracts, setContracts] = useState<Contract[]>([]);

  // switch
  const toggleSwitch = () => setTypeContract(previousState => !previousState);

  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as Params;
  const STRGK_CONTRACTS = `@comminve#machine${routeParams.machine.idMachine}_contracts`;
  const STRGK_ALOCATIONS = `@comminve#machine${routeParams.machine.idMachine}_allocations`;

  const _handleSignature = (signature: string) => {
    //console.log(signature);
    setSignatureB64(signature);
  }

  function _handleAddContract() {
    try {
      _loadData();
      if (contracts.length === 0) {
        handleSaveDataAndReturnToContracts(0);
      } else {
        const lastIdContract = contracts[(contracts.length - 1)].idContract;
        handleSaveDataAndReturnToContracts(lastIdContract);
      }
    } catch (err) {
      console.log(`Error to register new Contract.\nDetails: ${err}`);
    }
  }

  function handleSaveDataAndReturnToContracts(lastIdContract: number) {
    if (!placeName || !address || !city || !cep || !locatorName || !cpf || !cellphone || !signatureB64) {
      alert(`Registro de contrato inválido, revise os campos!`);
    } else {
      const currentDate = new Date();
      const contract: Contract = {
        idContract: lastIdContract + 1,
        isActive: true,
        typeContract: typeContract,
        dateSign: `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`,
        idMachine: Number(routeParams.machine.idMachine),
        placeName: placeName,
        address: address,
        city: city,
        cep: cep,
        locatorName: locatorName,
        cpf: cpf,
        cellphone: cellphone,
        percentage: percentage,
        rentValue: Number(rentValue),
        signatureB64: signatureB64
      };
      _desativeLastContract(lastIdContract);
      _saveData(contract);
      alert('Contrato assinado com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Contracts',
          params: { contract: contract }
        }],
      });
      // // fiz tudo, vlw flw!
      navigation.goBack();
    }
  }

  function _desativeLastContract(lastIdContract: number) {
    if (lastIdContract > 0) {
      let contractsSwap = contracts;
      contractsSwap[lastIdContract - 1].isActive = false;
      setContracts(contractsSwap);
    }
  }

  function _saveData(data: Contract) {
    _saveAllocationValue(data);
    const cntrcs = contracts;
    cntrcs.push(data);
    storage.save(STRGK_CONTRACTS, cntrcs)
    .catch((err: Error) => console.log(`Failed to save contracts data!\nDetails: ${err}`));
  }

  function _saveAllocationValue(data: Contract) {
    if (!data.typeContract) {
      const alloc: Allocation = { typeContract: data.typeContract, value: data.percentage };
      storage.save(STRGK_ALOCATIONS, alloc)
      .catch((err: Error) => console.log(`Failed to save data!\nDetails: ${err}`));
    } else {
      const alloc: Allocation = { typeContract: data.typeContract, value: data.rentValue.toString() };
      storage.save(STRGK_ALOCATIONS, alloc)
      .catch((err: Error) => console.log(`Failed to save data!\nDetails: ${err}`));
    }
  }

  function _loadData() {
    storage.get(STRGK_CONTRACTS)
      .then((data: Contract[]) => {
        if (!data) {
          console.log(`There are no persistent Contracts data in AsyncStorage!`);
        } else {
          setContracts(data);
          console.log(`loadData(FormAddContract)`);
        }
      })
    .catch((err: Error) => console.log(`Error to restore contracts from AsyncStorage.\n${err}`));
  }

  useEffect(() => {
    _loadData();
  }, []);

  return (
    <>
      <PageHeader title='Registro de Contrato' defaultBack={false} />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, { width: wp('50%') }]}
              placeholder='Shopping'
              maxLength={100}
              keyboardType='default'
              value={placeName}
              onChangeText={(text) => setPlaceName(text)}
            />

            <Text style={styles.label}>Aluguel?</Text>
            <Switch
              ios_backgroundColor='#3e3e3e'
              onValueChange={toggleSwitch}
              value={typeContract}
            />
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput
              style={styles.input}
              placeholder='QR 400 Conjunto C Lote 00'
              maxLength={100}
              keyboardType='default'
              value={address}
              onChangeText={(text) => setAddress(text)}
            />

            <TextInput
              style={styles.input}
              placeholder='Santa Maria'
              maxLength={100}
              keyboardType='default'
              value={city}
              onChangeText={(text) => setCity(text)}
            />

            <TextInputMask
              style={styles.input}
              type={'custom'}
              options={{
                mask: '99999-999'
              }}
              placeholder='72000-000'
              keyboardType='number-pad'
              value={cep}
              onChangeText={(text) => setCep(text)}
            />

            <TextInput
              style={styles.input}
              placeholder='Edvaldo Lemos'
              maxLength={100}
              keyboardType='default'
              value={locatorName}
              onChangeText={(text) => setLocatorName(text)}
            />

            <TextInputMask
              style={styles.input}
              type={'cpf'}
              placeholder='000.000.000-99'
              keyboardType='number-pad'
              value={String(cpf)}
              onChangeText={(text) => setCpf(text)}
            />

            <TextInputMask
              style={styles.input}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              placeholder='(61) 99999-9999'
              keyboardType='number-pad'
              value={String(cellphone)}
              onChangeText={(text) => setCellphone(text)}
            />

            {typeContract ? (
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
                value={String(rentValue)}
                onChangeText={(_, rawValue) => setRentValue(String(rawValue))}
                keyboardType='number-pad'
              />
            ) : (
              <TextInputMask
              style={styles.input}
              type={'custom'}
              options={{
                mask: '99%',
              }}
              placeholder='12%'
              keyboardType='number-pad'
              value={percentage}
              onChangeText={(text) => setPercentage(text)}
              />
            )}
          </TouchableWithoutFeedback>

          <View style={styles.signature}>
            <Sign
              key='sign'
              onOK={_handleSignature} 
              text={'ASSINE AQUI'}
            />
          </View>

          <RectButton 
            style={styles.button}
            onPress={_handleAddContract}
          >
            <Text style={styles.buttonText}>Salvar</Text>
            <MaterialIcons name="save" size={32} color={'#fff'}/>
          </RectButton>
        </View>
      </ScrollView>
    </>
  );
}

export default FormAddContract;

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
    width: wp('88%'),
    height: hp('7.2%'),
    borderColor: "#000000",
    borderBottomWidth: 1.5,
    marginBottom: 9,
    fontSize: hp('2.2%')
  },
  inputGroup: {
    flexDirection: 'row',
    
    alignItems: 'center',
    justifyContent: 'space-between'
    // backgroundColor: 'red'
  },
  label: {
    marginRight: 10,
    paddingLeft: wp('10%'),
    fontSize: hp('2.2%'),
  },
  button: {
    // position: 'absolute',
    flexDirection: 'row',
    width: wp('80%'),
    height: hp('6.6%'),
    paddingHorizontal: 18,
    marginVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#8257e5'
  },
  buttonText: {
    fontFamily: 'Archivo_700Bold',
    fontSize: hp('4%'),
    color: '#fff'
  },
  signature: {
    width: wp('60%'),
    height: hp('14%'),
  }
});