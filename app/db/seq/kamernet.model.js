const undef = "Undefined"
const empty = "Empty"
const {DataTypes} = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Properties = sequelize.define('properties', {
        externalId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            ignoreDuplicates: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: undef
        },
        city: {
            type: DataTypes.STRING,
            defaultValue: undef
        },
        areaSqm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            set: function (value) {
                value = parseInt(value);
                this.setDataValue('areaSqm', value)
            }
        },
        address: {
            type: DataTypes.STRING
        },
        rent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        deposit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        isRoomActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
            set: function (value) {
                value = value === 'true';
                this.setDataValue('isRoomActive', value);
            }
        },
        latitude: {
            type: DataTypes.STRING,
        },
        longitude: {
            type: DataTypes.STRING,
        }
    });

    return Properties;
};