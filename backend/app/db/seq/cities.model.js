const empty = 'Empty';
const { DataTypes } = require('sequelize');
const e = require('express');
const {databases} = require('../config/db.config');

module.exports = (sequelize, Sequelize) => sequelize.define('cities', databases[1].model);
