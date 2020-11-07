import { DatabaseConnection } from '../database/database-connection';
import { SQLError } from 'expo-sqlite';

export interface Reading {
  id: number,
  typeReading: boolean,
  dateReading: string,
  previousClockValue: number,
  clockReadingValue: number,
  cashValue: number,
  leavingGiftsQuantity: number
  idMachine: number,
}

const table = 'reading';
const db = DatabaseConnection.getConnection();

class ReadingService {
  static addData(reading: Reading) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `insert into ${table} 
            (
              typeReading,
              dateReading,
              previousClockValue,
              clockReadingValue,
              cashValue,
              leavingGiftsQuantity,
              idMachine
            ) 
            values (
              ${reading.typeReading}, 
              '${reading.dateReading}', 
              ${reading.previousClockValue},
              ${reading.clockReadingValue},
              ${reading.cashValue},
              ${reading.leavingGiftsQuantity},
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


  static updateById(reading: Reading) {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `update ${table} 
            set 
              typeReading = ${reading.typeReading}, 
              dateReading = '${reading.dateReading}', 
              previousClockValue = ${reading.previousClockValue},
              clockReadingValue = ${reading.clockReadingValue},
              cashValue = ${reading.cashValue},
              leavingGiftsQuantity = ${reading.leavingGiftsQuantity}
              idMachine = ${reading.idMachine}
            where id = ${reading.id}`,
            [],
            (_, { rowsAffected }) => resolve(rowsAffected)
            ), (sqlError: SQLError) => reject(sqlError)
        }, (txError) => reject(txError)
      );
    })
  }

  static findById(id: number): Promise<Reading>  {
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

  static findAll(): Promise<Reading[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `select * from ${table}`,
          [],
          (_, { rows }) => {
            const readings: Reading[] = [];
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

export default ReadingService;