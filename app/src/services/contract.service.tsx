import { DatabaseConnection } from '../database/database-connection';
import { SQLError } from 'expo-sqlite';

export interface Contract {
  id: number,
  typeContract: number,
  dateSign: string,
  placeName: string,
  address: string,
  city: string,
  cep: string,
  locatorName: string,
  cpf: string,
  cellphone: string,
  percentage: number,
  rentValue: number,
  signatureB64: string,
  idMachine: number,
}

const table = 'contract';
const db = DatabaseConnection.getConnection();

class ContractService {
  static addData(contract: Contract) {
    const c = contract;
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `insert into ${table} 
            (typeContract, 
              dateSign, 
              placeName, 
              address, 
              city, 
              cep, 
              locatorName, 
              cpf, 
              cellphone, 
              percentage, 
              rentValue, 
              signatureB64, 
              idMachine
            ) 
            values (
              ${contract.typeContract}, 
              '${contract.dateSign}', 
              '${contract.placeName}', 
              '${contract.address}', 
              '${contract.city}', 
              '${contract.cep}', 
              '${contract.locatorName}', 
              '${contract.cpf}', 
              '${contract.cellphone}',
              ${contract.percentage}, 
              ${contract.rentValue}, 
              '${contract.signatureB64}',
              ${contract.idMachine}
            )`,
            [],
            (_, { rowsAffected }) => resolve(rowsAffected)
          ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }

  static deleteById(id: number) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `delete from ${table} where id = ${id}`,
          [],
          (_, { rowsAffected }) => resolve(rowsAffected)
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }


  static updateById(contract: Contract) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `update ${table} 
            set 
              typeContract = ${contract.typeContract}, 
              dateSign = '${contract.dateSign}', 
              placeName = '${contract.placeName}', 
              address = '${contract.address}', 
              city = '${contract.city}', 
              cep = '${contract.cep}', 
              locatorName = '${contract.locatorName}', 
              cpf = '${contract.cpf}',
              cellphone = '${contract.cellphone}', 
              percentage = ${contract.percentage}, 
              rentValue = ${contract.rentValue}, 
              signatureB64 = '${contract.signatureB64}', 
              idMachine = ${contract.idMachine}
            where id = ${contract.id}`,
            [],
            (_, { rowsAffected }) => resolve(rowsAffected)
            ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    })
  }

  static findById(id: number): Promise<Contract> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table} where id = ${id}`,
          [],
          (_, { rows }) => resolve(rows.item(0))
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }

  static findLastContractByMachine(idMachine: number): Promise<Contract> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table} where idMachine = ${idMachine} order by id desc limit 1`,
          [],
          (_, { rows }) => resolve(rows.item(0))
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }

  static findAllByMachine(id: number): Promise<Contract[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table} where idMachine = ${id}`,
          [],
          (_, { rows }) => {
            const contracts: Contract[] = [];
            for (let i = 0; i < rows.length; i++) {
              contracts.push(rows.item(i));
            }
            resolve(contracts);
          }
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }

  static findAll(): Promise<Contract[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table}`,
          [],
          (_, { rows }) => {
            const contracts: Contract[] = [];
            for (let i = 0; i < rows.length; i++) {
              contracts.push(rows.item(i));
            }
            resolve(contracts);
          }
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }
}

export default ContractService;