const {mysql_config, databases} = require('../config/db.config');
const {Sequelize, ARRAY} = require('sequelize');
const mysql = require('mysql2/promise');
const fs = require('fs');

/**
 * Map read databases files. Useful to remove file-reading overhead when
 * using same file to create multiple separate databases/tables
 * @type {Map<any, any>}
 */
const fileMap = new Map();
/**
 * Holds all databases managed by the server during runtime
 * @type {{mapDbs: Map<any, any>, Sequelize: Sequelize}}
 */
const db = {
    Sequelize,
    mapDbs: new Map()
};
const ProgressBar = require('progress');

const BREAK_RECON = 2500;

const db_parameters = {
    host: mysql_config.host,
    user: mysql_config.user,
    port: mysql_config.port,
    password: mysql_config.password,
    dialect: mysql_config.dialect,
    pool: {
        max: mysql_config.pool.max,
        min: mysql_config.pool.min,
        acquire: mysql_config.pool.acquire,
        idle: mysql_config.pool.idle,
    },
};

initialize();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reads .json files from the specified path
 * @param filePath path of the database-file-name.json file
 * @returns {Promise<unknown>} file content as JSON string
 */
function collectDataset(filePath) {
    return new Promise((resolve, reject) =>
        fs.readFile(filePath, 'utf8', (err, jsonString) => {
            if (err) {
                console.log('File read failed:', err);
                reject(err);
                return
            }
            try {
                const jsonObj = JSON.parse(jsonString);
                fileMap.set(filePath, jsonObj);
                resolve(jsonObj);
            } catch (err) {
                console.log('Error parsing JSON string:', err);
                reject(err);
            }
        }));
}

/**
 *
 * @param db_id database id
 * @param jsonArr
 * @returns {Promise<void>}
 */
async function populateDb(db_id, jsonArr) {
    const records = [];
    const {database, seq, kernel} = db.mapDbs.get(db_id);
    const bar = new ProgressBar('processing [:bar] :rate items per second :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: jsonArr.length,
    });
    for (let i = 0; i < jsonArr.length; i++) {
        const record = {};
        Object.keys(database.model).forEach((key) => {
            record[key] = jsonArr[i][key];
        });
        records.push(record);
        bar.tick();
    }
    console.log('\n');
    seq.options.logging = false;
    await kernel.bulkCreate(records, {ignoreDuplicates: true});
    seq.options.logging = console.log;
    console.log('Finished loading database!');
}

/**
 * Initiates a connection to the local DBMS
 * If the connection succeeds, creates databases and initiates the required
 * sequelize objects and defines the table model found in the database config
 * (this creates the table).
 * Maps the database in the $db object and syncs the database tables.
 * Finally, loads the local file data into the database.
 * @returns {Promise<void>}
 */
async function initialize() {
    let connected = false;

    while (!connected) {
        console.log('Attempting connection to MySQL host');
        try {
            const {
                host, port, user, password,
            } = db_parameters;
            const connection = await mysql.createConnection({
                host, port, user, password,
            });
            console.log('MySQL HAS RESPONDED');
            connected = true;
            for await (const dbase of databases) {
                await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbase.db_id}\`;`);
                await console.log('CREATED DATABASE: ' + dbase.db_id);
                const seq = await new Sequelize(dbase.db_id,
                    mysql_config.user, mysql_config.password, db_parameters);
                console.log("DEFINING TABLE")
                const kernel = await seq.define(dbase.name_table,
                    dbase.model, {tableName: dbase.name_table});
                await db.mapDbs.set(dbase.db_id, {
                    database: dbase,
                    seq,
                    kernel
                });
                await seq.sync({force: true});
                if (fileMap.has(dbase.file_path)) {
                    await populateDb(dbase.db_id, fileMap.get(dbase.file_path));
                } else {
                    await collectDataset(dbase.file_path).then(async (r) => {
                        await populateDb(dbase.db_id, r);
                    });
                }

            }
        } catch (e) {
            console.log("Waiting for DBMS connection...");
            await sleep(BREAK_RECON);
        }
    }
}

module.exports = db;
