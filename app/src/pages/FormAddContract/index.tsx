import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Switch, Keyboard, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { RectButton, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import Sign from '../../components/Signature/index.js';
import ContractService, { Contract } from '../../services/contract.service';
import { Machine } from '../../services/machine.service';

interface Params {
  machine: Machine;
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

  // switch
  const toggleSwitch = () => setTypeContract(previousState => !previousState);

  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as Params;

  const _handleSignature = (signature: string) => {
    //console.log(signature);
    setSignatureB64(signature);
  }

  function _handleAddContract() {
    if (!placeName || !address || !city || !cep || !locatorName || !cpf || !cellphone || !signatureB64) {
      alert(`Registro de contrato inválido, revise os campos!`);
    } else {
      const currentDate = moment().locale('pt-br').format('L');
      
      const contract: Contract = {
        id: 0, // index is unusable
        isActive: true,
        typeContract: typeContract,
        dateSign: currentDate,
        placeName: placeName,
        address: address,
        city: city,
        cep: cep,
        locatorName: locatorName,
        cpf: cpf,
        cellphone: cellphone,
        percentage: percentage.includes('%') ? Number(percentage.replace('%', '')) : Number(percentage),
        rentValue: Number(rentValue),
        signatureB64: signatureB64,
        idMachine: routeParams.machine.id
      };
      _disableLastContract();
      _saveData(contract)
      alert('Contrato assinado com sucesso!');
      navigation.goBack();
    }
  }

  async function _disableLastContract() {
    try {
      const lastContract: Contract = await ContractService.findLastContractByMachine(routeParams.machine.id);
      if (lastContract) {
        const { id, typeContract, dateSign, placeName, address, city, cep, locatorName, cpf, cellphone, percentage, rentValue, signatureB64, idMachine } = lastContract;
        await ContractService.updateById({ id, isActive: false, typeContract, dateSign, placeName, address, city, cep, locatorName, cpf, cellphone, percentage, rentValue, signatureB64, idMachine });
      }
    } catch (err) {
      console.log(`Failed to disable last contract!\nDetails: ${err}`);
    }
  }

  async function _saveData(data: Contract) {
    try {
      await ContractService.addData(data);
    } catch (err) {
      console.log(`Failed to save new contract data!\nDetails: ${err}`);
    }
  }

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