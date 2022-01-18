const { Op } = require('sequelize');

exports.queryOp = {
        and: Op.and,
        like: Op.like,
        gte: Op.gte,
        lte: Op.lte,
        eq: Op.eq,
        ranged: 'range',
    };
