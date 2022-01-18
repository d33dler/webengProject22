const { Op } = require('sequelize');
const { queryOp } = require('./query-operators');

const { fieldMap } = require('../fieldSets/fields_search');

function loop(arr, instruction, op, _exec) {
    for (let i = 0; i < arr.length; i++) {
        _exec(instruction, op, i);
    }
}

const config = {
    where: (instruction, args) => {
        const { param, operator, argArr } = args;
        loop(argArr, instruction, operator, (instr, op, ix) => {
            if (instruction.where === undefined) {
                instruction.where = {};
                instruction.where[Op.and] = [];
            }
            instruction.where[Op.and].push({ [`${param}`]: { [queryOp[`${op}`]]: argArr[ix] } });
        });
    },
    order: (instruction, args) => {
        const { param, argArr } = args;
        instruction.order = [];
        instruction.order.push([`${argArr[0]}`, argArr[1]]);
    },
    limit: (instruction, args) => {
        const { argArr } = args;
        instruction.limit = parseInt(argArr[0], 10);
    },
    attributes: (instruction, args) => {
        const { argArr } = args;
        loop(argArr, instruction, null, (instr, op, ix) => {
            instr.attributes = argArr[ix];
        });
    },
};

const queryBuilder = (options) => {
    const optionsOut = {};
    options.forEach((opt) => {
        config[`${opt.sqlOp}`](optionsOut, opt);
    });
    return optionsOut;
};

exports.createQuery = (query) => {
    const options = [];
    const keys = Object.keys(query);
    console.log(fieldMap);

    Object.entries(query).forEach(([key, value]) => {
        let argArr = [];
        const field = fieldMap.get(key);
        if (Array.isArray(value)) argArr = value; else argArr.push(value);
        console.log(field);
        options.push({
            sqlOp: `${field.sqlOp}`,
            param: field.tid,
            operator: `${field.op}`,
            argArr,
        });
    });
    const out = queryBuilder(options);
    console.log(out);
    return queryBuilder(options);
};
