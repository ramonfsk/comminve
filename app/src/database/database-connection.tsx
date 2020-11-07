import * as SQLite from 'expo-sqlite';

const name = 'db_comminve';
export const DatabaseConnection = {
    getConnection: () => SQLite.openDatabase(name, "v1"),
};