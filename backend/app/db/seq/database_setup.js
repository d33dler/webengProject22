const { mysql_config, databases } = require('../db.config');
const { Sequelize, ARRAY } = require('sequelize');
const mysql = require('mysql2/promise');
const fs = require('fs');

const db = {};
const ProgressBar = require('progress');

const BREAK_RECON = 2500;

const db_parameters = {
    host: mysql_config.host,
    user: mysql_config.user,
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
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectDataset() {
    fs.readFile('properties.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('File read failed:', err);
            return;
        }
        try {
            const properties = JSON.parse(jsonString);
            populateDb(properties);
        } catch (err) {
            console.log('Error parsing JSON string:', err);
            return false;
        }
    });
    return true;
}

async function populateDb(jsonArr) {
    const kamernetRecords = [];
    const cities = [];
    const bar = new ProgressBar('processing [:bar] :rate items per second :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: jsonArr.length,
    });
    for (let i = 0; i < jsonArr.length; i++) {
        const record = {};
        Object.keys(databases[0].model).forEach((key) => {
                record[key] = jsonArr[i][key];
        });
        kamernetRecords.push(record);
        cities.push({ city: jsonArr[i].city });
        bar.tick();
    }
    console.log('\n');
    db.sequelizeProperties.options.logging = false;
    db.sequelizeCities.options.logging = false;
    await db.Properties.bulkCreate(kamernetRecords, { ignoreDuplicates: true });
    await db.Cities.bulkCreate(cities, { ignoreDuplicates: true });
    db.sequelizeProperties.options.logging = console.log;
    console.log('Finished loading database!');
}

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
            // eslint-disable-next-line camelcase
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysql_config.KAMERNET_DB}\`;`);
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysql_config.CITIES_DB}\`;`);
            const seqPropertiesDb = new Sequelize(mysql_config.KAMERNET_DB, mysql_config.user, mysql_config.password, db_parameters);
            const seqCitiesDb = new Sequelize(mysql_config.CITIES_DB, mysql_config.user, mysql_config.password, db_parameters);
            db.Sequelize = Sequelize;
            db.sequelizeProperties = seqPropertiesDb;
            db.sequelizeCities = seqCitiesDb;
            db.Properties = require('./kamernet.model.js')(seqPropertiesDb, Sequelize);
            db.Cities = require('./cities.model.js')(seqCitiesDb, Sequelize);
            collectDataset();
            await seqPropertiesDb.sync();
            await seqCitiesDb.sync();
        } catch (e) {
            console.log(e);
            await sleep(BREAK_RECON);
        }
    }
}

module.exports = db;
