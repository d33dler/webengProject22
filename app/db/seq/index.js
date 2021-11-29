const dbConfig = require("../db.config");
const {Sequelize, ARRAY} = require("sequelize");
const mysql = require('mysql2/promise');
const fs = require("fs");
const db = {};
const ProgressBar = require('progress');

initialize();

async function initialize() {
    const {host, port, user, password, database} = dbConfig;
    const connection = await mysql.createConnection({host, port, user, password})
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
        host: process.env.PSQL_HOST || dbConfig.host,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    });

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.Properties = require("./kamernet.model.js")(sequelize, Sequelize);

    collectDataset();
   await sequelize.sync();
}

function collectDataset() {
    fs.readFile('properties.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        try {
            let properties = JSON.parse(jsonString)
            populateDb(properties);
        } catch (err) {
            console.log('Error parsing JSON string:', err)
        }
    })
}


async function populateDb(jsonArr) {
    let records = [];
    let bar = new ProgressBar('processing [:bar] :rate items per second :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: jsonArr.length
    });
    for (let i = 0; i < jsonArr.length; i++) {
        records.push({
            externalId: jsonArr[i].externalId,
            address: jsonArr[i].title,
            postalCode: jsonArr[i].postalCode,
            city: jsonArr[i].city,
            areaSqm: jsonArr[i].areaSqm,
            rent: jsonArr[i].rent,
            deposit: jsonArr[i].deposit,
            isRoomActive: jsonArr[i].isRoomActive,
            latitude: jsonArr[i].latitude,
            longitude: jsonArr[i].longitude
        });
        bar.tick();
    }
    console.log('\n');
    db.sequelize.options.logging = false;
    await db.Properties.bulkCreate(records, {ignoreDuplicates: true});
    db.sequelize.options.logging = console.log;

    console.log("Finished loading database!");
}

module.exports = db;




