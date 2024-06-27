import * as SQLite from 'expo-sqlite';

export default class StorageManager {
    constructor() {
        // se esiste un db lo apro, altrimenti lo creo
        this.db = SQLite.openDatabase("MIT-DB")

        // crea le tabelle se non esistono
        this.createTableUtenti();
        this.createTableOggetti();
    }

    //utenti

    async createTableUtenti() {
        const querySQL = "CREATE TABLE IF NOT EXISTS utenti (uid INTEGER PRIMARY KEY, name VARCHAR(100), picture TEXT, profileversion INTEGER)";
        const query = { args: [], sql: querySQL }
        const result = await this.db.execAsync([query], false)
        return result
    }

    // INSERT
    async insertUser(uid, name, picture, profileversion) {
        const querySQL = "INSERT INTO utenti (uid, name, picture, profileversion) VALUES (?, ?, ?, ?)";
        const query = { args: [uid, name, picture, profileversion], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        console.log(result);
        return result;
    }

    // UPDATE
    async updateUser(uid, name, picture, profileversion) {
        const querySQL = "UPDATE utenti SET name = ?, picture = ?, profileversion = ? WHERE uid = ?";
        const query = { args: [name, picture, profileversion, uid], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        console.log(result);
        return result;
    }

    // GETTERS
    async getAllUsers() {
        const querySQL = "SELECT * FROM utenti";
        const query = { args: [], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        //console.log(result[0].rows);
        return result[0].rows;
    }

    async getUserByID(uid) {
        const querySQL = "SELECT * FROM utenti WHERE uid = ?";
        const query = { args: [uid], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        //console.log("StorageManager // getUser - "+result[0].rows[0].uid);
        return result[0].rows;
    }

    //oggetti

    // Table create
    async createTableOggetti() {
        const querySQL = "CREATE TABLE IF NOT EXISTS oggetti (id INTEGER PRIMARY KEY, type VARCHAR(100), image TEXT, name VARCHAR(100), level INTEGER)";
        const query = { args: [], sql: querySQL }
        const result = await this.db.execAsync([query], false)
        return result
    }

    // INSERT
    async insertObject(id, type, image, name, level) {
        const querySQL = "INSERT INTO oggetti (id, type, image, name, level) VALUES (?, ?, ?, ?, ?)";
        const query = { args: [id, type, image, name, level], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        console.log(result);
        return result;
    }

    // GETTERS
    async getAllObjects() {
        const querySQL = "SELECT * FROM oggetti";
        const query = { args: [], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        //console.log(result[0].rows);
        return result[0].rows;
    }

    async getObjectByID(id) {
        const querySQL = "SELECT * FROM oggetti WHERE id = ?";
        const query = { args: [id], sql: querySQL };
        const result = await this.db.execAsync([query], false);
        //console.log("StorageManager // getUser - "+result[0].rows[0].uid);
        return result[0].rows;
    }
}