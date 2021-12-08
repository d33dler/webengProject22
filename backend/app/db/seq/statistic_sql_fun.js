const { Sequelize } = require('sequelize');

const seq = Sequelize;

export function count(colName, name) { return [seq.fn('COUNT', seq.col(colName)), name]; }
export function avg(colName, name) { return [seq.fn('AVG', seq.col(colName)), name]; }
export function sd(colName, name) { return [seq.fn('STD', seq.col(colName)), name]; }
