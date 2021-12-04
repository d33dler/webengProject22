module.exports = {
    host: "localhost",
    user: "doodler",
    password: "bradubradu",
    database: "kamernet_db",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
};