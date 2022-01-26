const { DataTypes } = require('sequelize');

exports.mysql_config = {
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

const undef = 'Undefined';

exports.databases = [
    {
        model: {
            externalId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                ignoreDuplicates: true,
                defaultValue: DataTypes.UUIDV4,
            },
            title: {
                type: DataTypes.STRING,
                defaultValue: undef,
            },
            postalCode: {
                type: DataTypes.STRING,
                defaultValue: undef,
            },
            city: {
                type: DataTypes.STRING,
                defaultValue: undef,
            },
            areaSqm: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                set(value) {
                    value = parseInt(value);
                    this.setDataValue('areaSqm', value);
                },
            },
            rent: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            deposit: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isRoomActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
                set(value) {
                    value = (value === 'true' || value === true);
                    this.setDataValue('isRoomActive', value);
                },
            },
            latitude: {
                type: DataTypes.STRING,
            },
            longitude: {
                type: DataTypes.STRING,
            },
        },
    }, 
    {
       model: {
           city: {
               primaryKey: true,
               ignoreDuplicates: true,
               type: DataTypes.STRING,
               defaultValue: undef,
           },
       },
    },
];
// port: process.env.DB_PORT,
