const { Sequelize, Op } = require('sequelize');

const seq = Sequelize;

exports.localFunctionSet = () => {
  const arr = [];

  arr['calc_median_1'] = async (db, city, param) => {
    let res = null;
    await db.Properties.count({
      where: { city: { [Op.like]: `%${city}%` } },
    }).then(async (mid) => {
      if (mid !== 0) {
        const mid2 = Math.trunc(mid / 2) - 1;
        mid = mid % 2 === 0 ? mid / 2 : Math.trunc(mid / 2) + 1;
        await db.Properties.findAll({
          where: { city: { [Op.like]: `%${city}%` } },
          order: [[param, 'ASC']],
          offset: mid2,
          limit: mid - mid2,
          attributes: [param],
        }).then((median_res) => {
          console.error(median_res);
          let x = 0;
          for (let i = 0; i < median_res.length; i++) {
            x += median_res[i][`${param}`];
          }
          res = x / median_res.length;
        });
      } else {
        return null;
      }
    });
    console.log(res);
    return res;
  };
  return arr;
};

exports.sqlFunctions = () => {
  const arr = [];
  arr['seqFuncGeneric'] = (fun, colName, name) => [seq.fn(fun, seq.col(colName)), name];
  return arr;
}
