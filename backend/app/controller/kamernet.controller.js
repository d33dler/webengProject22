const { Op, Sequelize } = require('sequelize');
const medianAverage = require('median-average');
const converter = require('json-2-csv');
const db = require('../db/seq/database_setup');
const { seqFunctionMapping, localFunctionMapping } = require('../db/seq/functionSet');
const { queryOp } = require('../db/seq/query-operators');
const { createQuery } = require('../db/seq/query-buider');

const seqFunctionsMap = seqFunctionMapping();
const localFunctionsMap = localFunctionMapping();

require('sequelize-values')(Sequelize);

const propAttributes = (req) => {
    const attrs = {};
    Object.entries(req.body).forEach(([key, value]) => {
        attrs[key] = value;
    });
    return attrs;
};

// Create and upload a new property
exports.create = (req, res) => {
    // Upload new property in the database
    db.Properties.create(propAttributes(req))
        .then((data) => res.status(200).send(data.getValues()))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating new rental post',
            });
        });
};

exports.trylogin = (req, res) => {
    res.status(200).send('Server is online');
};

function processResponse(req, res, data) {
    if (req.get('Accept') === 'text/csv') {
        res.set('content-type', 'text/csv');
        converter.json2csv(data, (err, csv) => {
            if(csv === undefined || csv === null){
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                console.log(csv);
                res.status(200);
                res.send(csv);
            }
            });
        } else {
        res.status(200);
        res.set('content-type', 'application/json');
        res.send(data);
    }
}

exports.update = (req, res) => {
    const conditions = createQuery(req.query);
    const fields = req.body;
    try {
        db.Properties.update(fields, conditions).then((r) => {
            res.status(200).send(r);
        }).catch((err) => {
            res.status(204).send({
                message:
                    err.message || 'An error occurred while updating articles.',
            });
        });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Internal server error.',
        });
    }
};

exports.delete = (req, res) => {
    const conditions = createQuery(req.query);
    try {
        db.Properties.destroy(conditions).then((r) => {
            res.status(200).send(r);
        }).catch((err) => {
            res.status(204).send({
                message:
                    err.message || 'An error occurred while retrieving article.',
            });
        });
    } catch (e) {
        res.status(500).send({
            message:
                e.message || 'Internal server error.',
        });
    }
};

exports.search = (req, res) => {
    const conditions = createQuery(req.query);
    db.Properties.findAll(conditions).then(async (data) => {
         processResponse(req, res, data);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'An error occurred while retrieving article.',
        });
    });
};

exports.city_find = (req, res) => {
    const { value } = req.query;
    const condition = value ? { city: { [queryOp.like]: `${value}%` } } : null;
    db.Cities.findAll({ where: condition }).then((data) => {
        if (data.length > 0) {
            res.status(200).send(data);
        } else res.status(204).send(data);
    });
};

exports.param_find = (req, res) => {
    const { param } = req.params;
    const { value } = req.query;
    const condition = value ? { [`${param}`]: { [Op.like]: value } } : null;
    db.Properties.findAll({ where: condition }).then((data) => {
        if (data.length > 0) {
            res.status(200).send(data);
        } else res.status(204).send(data);
    });
};

function collectAttributes(seq, query) {
    const attr = [];
    Object.entries(query).forEach(
        ([key, value]) => {
            if (value === 'true') {
                if (seqFunctionsMap.has(key)) {
                    const val = seqFunctionsMap.get(key);
                    attr.push([seq.fn(val[0], seq.col(val[1])), key]);
                    delete query[key];
                }
            }
        },
    );
    return attr;
}

async function executeLocalFunctions(query) {
    const attr = [];
    for (const [key, value] of Object.entries(query)) {
        if (value === 'true') {
            if (localFunctionsMap.has(key)) {
                const val = localFunctionsMap.get(key);
                // eslint-disable-next-line no-await-in-loop
                await val[0](db, query.city, val[1]).then((result) => {
                    attr[`${key}`] = result;
                });
            }
        }
    }
    return attr;
}

async function addAllLocalResults(resultSet, response) {
    await Object.entries(resultSet).forEach(([key, value]) => {
        response[key] = value;
    });
}

async function get_stats(seq, query, city) {
    let response;
    const attr = collectAttributes(seq, query);
    await executeLocalFunctions(query).then(async (local_res) => {
        await db.Properties.findAll({
            where: { city: { [Op.like]: `%${city}%` } },
            attributes: attr,
        }).then(async (r) => {
            response = r[0].toJSON();
            await addAllLocalResults(local_res, response);
        }).catch((err) => ({ status: 500, res: err }));
    });
    return { status: 200, res: response };
}

exports.statistics = async (req, res) => {
    let { city } = req.params;
    city = city || '';
    const seq = db.Sequelize;
    req.query.city = city;
    await get_stats(seq, req.query, city).then((stats) => {
        if (stats.status === 200) {
            res.status(200).send(stats.res);
        } else if (stats.status === 204) {
            res.status(204).send();
        } else {
            res.status(500).send({ message: stats.error.message || 'The quarried city name was not found in the database' });
        }
    });
};
