const dbConfig = require('../db.config');
const { Sequelize, ARRAY } = require('sequelize');
const mysql = require('mysql2/promise');
const fs = require('fs');

const db = {};
const ProgressBar = require('progress');

const db_parameters = {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
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
        kamernetRecords.push({
            externalId: jsonArr[i].externalId,
            address: jsonArr[i].title,
            postalCode: jsonArr[i].postalCode,
            city: jsonArr[i].city,
            areaSqm: jsonArr[i].areaSqm,
            rent: jsonArr[i].rent,
            deposit: jsonArr[i].deposit,
            isRoomActive: jsonArr[i].isRoomActive,
            latitude: jsonArr[i].latitude,
            longitude: jsonArr[i].longitude,
        });
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

    while (!connected){
        console.log('Attempting connection to MySQL host');
        try {
            const {
                host, port, user, password, KAMERNET_DB, CITIES_DB,
            } = dbConfig;
            const connection = await mysql.createConnection({
                host, port, user, password,
            });
            if (connection !== undefined) {
                connected = true;
                console.log('MySQL HAS RESPONDED');
            }
            // eslint-disable-next-line camelcase
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${KAMERNET_DB}\`;`).then(() => {
                connection.query(`CREATE DATABASE IF NOT EXISTS \`${CITIES_DB}\`;`).then(async () => {

                    const seqPropertiesDb = new Sequelize(dbConfig.KAMERNET_DB, dbConfig.user, dbConfig.password, db_parameters);
                    const seqCitiesDb = new Sequelize(dbConfig.CITIES_DB, dbConfig.user, dbConfig.password, db_parameters);
                    db.Sequelize = Sequelize;
                    db.sequelizeProperties = seqPropertiesDb;
                    db.sequelizeCities = seqCitiesDb;
                    db.Properties = require('./kamernet.model.js')(seqPropertiesDb, Sequelize);
                    db.Cities = require('./cities.model.js')(seqCitiesDb, Sequelize);
                    await db.Properties.count().then((n) => {
                        if (n === 0) {
                            collectDataset();
                        }
                    });
                    await seqPropertiesDb.sync();
                    await seqCitiesDb.sync();
                });
            });
        } catch (e) {
            await sleep(2000);
        }
    }
}


module.exports = db;
