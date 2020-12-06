import { DatabaseConnection } from '../database/database-connection';
import { SQLError } from 'expo-sqlite';

export interface Withdraw {
  id: number,
  dateReading: string,
  cashValue: number,
  idMachine: number,
}

const table = 'withdraw';
const db = DatabaseConnection.getConnection();

class WithdrawService {
  static addData(reading: Withdraw) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `insert into ${table} 
            (
              dateReading,
              cashValue,
              idMachine
            ) 
            values (
              '${reading.dateReading}', 
              ${reading.cashValue},
              ${reading.idMachine}
            )`,
            [],
            (_, { insertId }) => resolve(insertId)
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


  static updateById(reading: Withdraw) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `update ${table} 
            set 
              dateReading = '${reading.dateReading}', 
              cashValue = ${reading.cashValue},
              idMachine = ${reading.idMachine}
            where id = ${reading.id}`,
            [],
            (_, { rowsAffected }) => resolve(rowsAffected)
            ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    })
  }

  static findById(id: number): Promise<Withdraw>  {
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

  static findAllByMachine(id: number): Promise<Withdraw[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table} where idMachine = '${id}'`,
          [],
          (_, { rows }) => {
            const readings: Withdraw[] = [];
            for (let i = 0; i < rows.length; i++) {
              readings.push(rows.item(i));
            }
            resolve(readings);
          }
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }

  static findAll(): Promise<Withdraw[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table}`,
          [],
          (_, { rows }) => {
            const readings: Withdraw[] = [];
            for (let i = 0; i < rows.length; i++) {
              readings.push(rows.item(i));
            }
            resolve(readings);
          }
        ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    });
  }
}

export default WithdrawService;