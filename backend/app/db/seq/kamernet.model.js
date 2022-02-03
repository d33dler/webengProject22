const undef = 'Undefined';
const empty = 'Empty';
const { DataTypes } = require('sequelize');
const e = require('express');
const { databases } = require('../config/db.config');

module.exports = (sequelize, Sequelize) => sequelize.define('properties', databases[0].model);
