const { Op } = require('sequelize');
const { isUndefined, isEmpty } = require('lodash');
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
        if (instruction.where === undefined) {
            instruction.where = {};
            instruction.where[Op.and] = [];
        }
        loop(argArr, instruction, operator, (instr, op, ix) => {
            instruction.where[Op.and].push({ [`${param}`]: { [queryOp[`${op}`]]: argArr[ix] } });
        });
    },
    order: (instruction, args) => {
        const { param, argArr } = args;
        instruction.order = [];
        if (!isUndefined(argArr[0]) && !isUndefined(argArr[1])){
            instruction.order.push([`${argArr[0]}`, argArr[1]]);
        }
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
    if (isUndefined(query)) {
        return { where: {} };
    }
        Object.entries(query).forEach(([key, value]) => {
            let out = value;
            let argArr = [];
            const field = fieldMap.get(key);
            if (!isUndefined(field)){
                if (out === 'true' || out === 'false') out = (value === 'true');
                if (Array.isArray(value)) argArr = out; else argArr.push(out);
                options.push({
                    sqlOp: `${field.sqlOp}`,
                    param: field.tid,
                    operator: `${field.op}`,
                    argArr,
                });
            }
        });

        const out = queryBuilder(options);
        if (isUndefined(out.where)) out.where = {};
        return queryBuilder(options);
};
