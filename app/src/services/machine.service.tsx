// import Machine from '../models/machine.model';
import { DatabaseConnection } from '../database/database-connection';
import { SQLError } from 'expo-sqlite';

export interface Machine {
  id: number,
  clockValue: number,
  cashValue: number,
  giftsQuantity: number,
  maxGiftsQuantity: number
}

const table = 'machine';
const db = DatabaseConnection.getConnection();

class MachineService {
  static addData(machine: Machine) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `insert into ${table} 
            (
              id, 
              clockValue, 
              cashValue, 
              giftsQuantity,
              maxGiftsQuantity
            ) 
            values (
              ${machine.id}, 
              ${machine.clockValue}, 
              ${machine.cashValue}, 
              ${machine.giftsQuantity}, 
              ${machine.maxGiftsQuantity})`,
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


  static updateById(machine: Machine) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `update ${table} 
            set 
              clockValue = ${machine.clockValue}, 
              cashValue = ${machine.cashValue}, 
              giftsQuantity = ${machine.giftsQuantity}, 
              maxGiftsQuantity = ${machine.maxGiftsQuantity}
            where id = ${machine.id}`,
            [],
            (_, { rowsAffected }) => resolve(rowsAffected)
            ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    })
  }

  static findById(id: number): Promise<Machine>  {
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

  static findAll(): Promise<Machine[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table}`,
          [],
          (_, { rows }) => {
            const machines: Machine[] = [];
            for (let i = 0; i < rows.length; i++) {
              machines.push(rows.item(i));
            }
            resolve(machines);
          }
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }
}

export default MachineService;