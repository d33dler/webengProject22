module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    KAMERNET_DB: process.env.DB_NAME_1,
    CITIES_DB: process.env.DB_NAME_2,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000,
    },
};


//port: process.env.DB_PORT,