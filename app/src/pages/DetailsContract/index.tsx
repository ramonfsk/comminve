import React from 'react';
import { useRoute } from '@react-navigation/native';

const STRGK_CONTRACTS = '@comminve#contracts';

interface Machine {
  machineNumber: number,
  isActive: boolean,
  cashValue: number,
  giftsQuantity: number
}

interface Contract {
  idContract: number,
  isActive: boolean,
  typeContract: number,
  idMachine: number,
  placeName: string,
  address: string,
  cep: string,
  locatorName: string,
  cpf: string,
  signatureB64: string,
  percentage: number,
  rentValue: number,
}

const FormAddContract = () => {


  const route = useRoute();
  const routeParams = route.params as Machine;
}

export default FormAddContract;