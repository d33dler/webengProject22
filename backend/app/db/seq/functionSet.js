const { sqlFunctions, localFunctionSet} = require('./statistic_sql_fun');

const seqFunctions = [
  {
    id: 'population',
    fun: 'COUNT',
    col: 'externalId',
  },
  {
    id: 'mean_rent',
    fun: 'AVG',
    col: 'rent',
  },
  {
    id: 'mean_deposit',
    fun: 'AVG',
    col: 'deposit',
  },
  {
    id: 'sd_rent',
    fun: 'STD',
    col: 'rent',
  },
  {
    id: 'sd_deposit',
    fun: 'STD',
    col: 'deposit',
  },
];

const localFunctions = [
  {
    id: 'med_rent',
    fun: 'calc_median_1',
    col: 'rent',
  },
  {
    id: 'med_deposit',
    fun: 'calc_median_1',
    col: 'deposit',
  },
];

const seqFunctionMapping = () => {
  const funMap = new Map();
  const arr = sqlFunctions();
  for (let i = 0; i < seqFunctions.length; i++) {
    const { id, fun, col } = seqFunctions[i];
    funMap.set(id, [fun, col]);
  }
  return funMap;
};
const localFunctionMapping = () => {
  const arr = localFunctionSet();
  const funMap = new Map();
  for (let i = 0; i < localFunctions.length; i++) {
    const { id, fun, col } = localFunctions[i];
    funMap.set(id, [arr[`${fun}`], col]);
  }
  return funMap;
};
module.exports = { seqFunctionMapping, localFunctionMapping}
