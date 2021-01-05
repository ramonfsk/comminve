import * as SQLite from 'expo-sqlite';

const name = 'db_comminve_v4';
export const DatabaseConnection = {
    getConnection: () => SQLite.openDatabase(name, 'v1'),
};