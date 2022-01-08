const {Op } = require('sequelize');

exports.queryOp = {
        like: Op.like,
        gte: Op.gte,
        lte: Op.lte,
        eq: Op.eq,
    };
