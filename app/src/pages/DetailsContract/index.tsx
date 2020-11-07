import React from 'react';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import PageHeader from '../../components/PageHeader';
import { Contract } from '../../services/contract.service';

interface Params {
  contract: Contract
}

const DetailsContract = () => {
  const route = useRoute();
  const { contract } = route.params as Params;

  return (
    <>
      <PageHeader title='Detalhes do Contrato' defaultBack={false} />
      <ScrollView style={styles.container}>
        <View style={styles.details}>
          <Text style={styles.detailsText}>{`Número de Contrato: ${contract.id}`}</Text>
          <Text style={styles.detailsText}>{`Ativo? ${contract.isActive ? `Sim` : `Não`}`}</Text>
          <Text style={styles.detailsText}>{`Tipo de Contrato: ${contract.typeContract ? `Aluguel` : `Percentual`}`}</Text>
          <Text style={styles.detailsText}>{`Data de Assinatura: ${contract.dateSign}`}</Text>
          <Text style={styles.detailsText}>{`Número de Máquina: ${contract.idMachine}`}</Text>
          <Text style={styles.detailsText}>{`Nome do Local: ${contract.placeName}`}</Text>
          <Text style={styles.detailsText}>{`Endereço: ${contract.address}`}</Text>
          <Text style={styles.detailsText}>{`Cidade: ${contract.city}`}</Text>
          <Text style={styles.detailsText}>{`CEP: ${contract.cep}`}</Text>
          <Text style={styles.detailsText}>{`Nome do Locador: ${contract.locatorName}`}</Text>
          <Text style={styles.detailsText}>{`CPF: ${contract.cpf}`}</Text>
          <Text style={styles.detailsText}>{`Celular: ${contract.cellphone}`}</Text>
          {contract.typeContract ? (
              <Text style={styles.detailsText}>{`Valor R$: ${contract.rentValue}`}</Text>
            ) : (
              <Text style={styles.detailsText}>{`Percentual: ${contract.percentage}`}</Text>
            )
          }
        </View>

        <Image 
          style={styles.imgSign}
          source={{ uri: contract.signatureB64 }}
        />
      </ScrollView>
    </>
  );
}

export default DetailsContract;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  details: {
    marginVertical: 8,
    marginHorizontal: 18,
  },
  detailsText:{
    fontSize: hp('2.8%'),
    marginBottom: 6,
  },
  imgSign: {
    width: wp('68%'),
    height: hp('28%'),
    alignSelf: 'center',
  }
});