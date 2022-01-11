const {Op} = require("sequelize");
const {queryOp} = require("./query-operators");


let config = {
    where: (instruction, args) => {
        const {param, operator, argArr} = args;
        instruction.where[Op.and].push([`${param}`] = {[queryOp[operator]]: argArr[0]});
    },
    order: (instruction, args) => {
        const {param, argArr} = args;
        instruction.order.push([`${param}`, argArr[0]]);
    },
    limit: (instruction, args) => {
        const {argArr} = args;
        instruction.limit = parseInt(argArr[0], 10);
    },
    attributes: (instruction, args) => {
        const {argArr} = args;
        instruction.attributes = argArr[0];
    }
}

const queryBuilder = (options) => {
    const optionsOut = {};
    Object.entries(options).forEach(opt => {
        config[`${opt}`](optionsOut, opt.args); //test this
    });
    return optionsOut;
}