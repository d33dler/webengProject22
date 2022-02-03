const { Sequelize, Op } = require('sequelize');
require('sequelize-values')(Sequelize);

const seq = Sequelize;

exports.localFunctionSet = () => {
    const arr = [];

    arr.calc_median_1 = (kernel, city, param) => kernel.findAll({
            where: { city: { [Op.like]: `%${city}%` } },
            order: [[param, 'ASC']],
        }).then((out) => {
            const vals = Sequelize.getValues(out);
            switch (vals.length) {
                case 0:
                    return 0;
                case 1:
                    return vals[`${param}`];
                default:
                    if (vals.length % 2 === 0) {
                        return vals[vals.length / 2][`${param}`];
                    } return ((vals[Math.floor(vals.length / 2)][`${param}`]
                    + vals[Math.floor(vals.length / 2) + 1][`${param}`]) / 2);

            }
        }).catch(() => console.log('Client bad request triggered `median` function error'));
    return arr;
};

exports.sqlFunctions = () => {
    const arr = [];
    arr.seqFuncGeneric = (fun, colName, name) => [seq.fn(fun, seq.col(colName)), name];

    return arr;
};
