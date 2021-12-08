module.exports = {
    host: 'localhost',
    user: 'doodler',
    password: 'bradubradu',
    kamernetDb: 'kamernet_db',
    citiesDb: 'cities_kn_db',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000,
    },
};
