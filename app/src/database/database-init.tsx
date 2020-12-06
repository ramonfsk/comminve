import { WebSQLDatabase } from 'expo-sqlite';
import { DatabaseConnection } from './database-connection'

let db: WebSQLDatabase | null = null

class DatabaseInit {
  constructor() {
    db = DatabaseConnection.getConnection();
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
      console.log('Foreign keys turned on')
    );
    this.InitDb();
  }

  private InitDb() {
      const sql = [
        `create table if not exists machine (
          id integer primary key,
          clockValue int,
          cashValue double,
          giftsQuantity int,
          maxGiftsQuantity int
        );`,

        `create table if not exists contract (
          id integer primary key autoincrement,
          isActive boolean,
          typeContract boolean,
          dateSign text,
          placeName text,
          address text,
          city text,
          cep text,
          locatorName text,
          cpf text,
          cellphone text,
          percentage int,
          rentValue double,
          signatureB64 blob,
          idMachine int,
          foreign key (idMachine) references machine (id)
        );`,

        `create table if not exists reading (
          id integer primary key autoincrement,
          dateReading text,
          previousClockValue int,
          clockReadingValue int,
          cashValue double,
          leavingGiftsQuantity int,
          idMachine int,
          foreign key (idMachine) references machine (id)
        );`,

        `create table if not exists withdraw (
          id integer primary key autoincrement,
          dateReading text,
          cashValue double,
          idMachine int,
          foreign key (idMachine) references machine (id)
        );`
    ];

    db?.transaction(
      tx => {
        sql.forEach(script => {
          tx.executeSql(script);
        });
      }, (error) => {
          console.log("error call back : " + JSON.stringify(error));
          console.log(error);
      }, () => {
          console.log("transaction complete call back ");
      }
    );
  }
}

export default DatabaseInit;