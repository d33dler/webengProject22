const empty = 'Empty';
const { DataTypes } = require('sequelize');
const e = require('express');

module.exports = (sequelize, Sequelize) => sequelize.define('cities', {
  city: {
    primaryKey: true,
    ignoreDuplicates: true,
    type: DataTypes.STRING,
    defaultValue: empty,
  },
});
