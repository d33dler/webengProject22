const undef = '?UNDEFINED?';
const {DataTypes} = require('sequelize');

exports.mysql_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000,
    },
};

exports.databases = [
    {
        id: '1',
        name_verbose: 'NLRentalProperties',
        name_table: "properties",
        file_path: 'local_databases/properties.json',
        db_id: 'kamernet_db',
        db_config: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 20000,
            },
        },
        apiTriggers:
            [{
                name: `position-stack`,
                service: 'position-stack_get_forward',
            }],
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
        id: '2',
        name_verbose: 'NLRentalProperties',
        name_table: 'cities',
        db_id: 'cities_db',
        file_path: 'local_databases/properties.json',
        db_config: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 20000,
            },
        },
        apiTriggers: [],
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
