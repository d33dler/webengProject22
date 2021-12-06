const undef = 'Undefined';
const empty = 'Empty';
const { DataTypes } = require('sequelize');
const e = require('express');

module.exports = (sequelize, Sequelize) => {
  const Properties = sequelize.define('properties', {
    externalId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      ignoreDuplicates: true,
      defaultValue: DataTypes.UUIDV4,
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: empty,
    },
    postalCode: {
      type: DataTypes.STRING,
      defaultValue: empty,
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
  });

  return Properties;
};
