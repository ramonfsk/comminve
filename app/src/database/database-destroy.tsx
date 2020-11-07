import { WebSQLDatabase } from 'expo-sqlite';
import { DatabaseConnection } from './database-connection'

let db: WebSQLDatabase | null = null

class DatabaseDestroy {
  constructor() {
    db = DatabaseConnection.getConnection();
    this.DestroyDb();
  }

  private DestroyDb() {
      const sql = [
        `drop table if exists contract;`,
        `drop table if exists reading;`,
        `drop table if exists machine;`,
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

export default DatabaseDestroy;