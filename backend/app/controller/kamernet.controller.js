const {Op, Sequelize} = require('sequelize');
const medianAverage = require('median-average');
const converter = require('json-2-csv');
const db = require('../db/seq/database_setup');
const {seqFunctionMapping, localFunctionMapping} = require('../db/seq/functionSet');
const {queryOp} = require('../db/seq/query-operators');
const {createQuery} = require('../db/seq/query-buider');
const {isUndefined} = require("lodash");
const _ = require("lodash");
const {apiMap} = require("../apis/apiManager");
const seqFunctionsMap = seqFunctionMapping();
const localFunctionsMap = localFunctionMapping();

require('sequelize-values')(Sequelize);


// Create and upload a new property
exports.create = (req, res) => {
    // Upload new property in the database
    const db_target = req.get('Target-Database');
    if (isUndefined(db_target)) {
        res.status(400).send({message: 'Missing `Target-Database` header'});
    } else if (db.mapDbs.has(db_target)) {
        processRequest(req.body, db_target).then(body => {
            db.mapDbs.get(db_target).kernel.create(body)
                .then(data =>
                    processResponse(req, res, data.getValues(), 200))
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || 'Some error occurred while creating new rental post',
                    });
                });
        });
        return
    }
    res.status(404).send();
};

function processRequest(body, db_target) {
    return new Promise( async (resolve) => {
        try {
            for await (const call of db.mapDbs.get(db_target).database.apiTriggers) {
                const service = apiMap.get(call.name).get(call.service);
                await service.effect(body);
            }
            resolve(body);
        } catch (e) {
            console.log(e);
            resolve(body);
        }
    })
}

exports.trylogin = (req, res) => {
    res.status(200).send('Server is online');
};


function processResponse(req, res, data, status = 200) {
    if (req.get('Accept') === 'text/csv') {
        res.set('content-type', 'text/csv');
        converter.json2csv(data, (err, csv) => {
            if (csv === undefined || csv === null) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                console.log(csv);
                res.status(status);
                res.send(csv);
            }
        });
    } else {
        res.status(status);
        res.set('content-type', 'application/json');
        res.send(data);
    }
}

exports.update = (req, res) => {
    const conditions = createQuery(req.query);
    const fields = req.body;
    const db_target = req.get('Target-Database');
    try {
        if (isUndefined(db_target)) {
            res.status(400).send();
        } else if (db.mapDbs.has(db_target)) {
            db.mapDbs.get(db_target).kernel.update(fields, conditions).then((r) => {
                res.status(200).send(r.toString());
            }).catch((err) => {
                res.status(400).send({
                    message:
                        err.message || 'An error occurred while updating articles.',
                });
            });
            return
        }
        res.status(404).send();
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Internal server error.',
        });
    }
};

exports.delete = (req, res) => {
    const conditions = createQuery(req.query);
    const db_target = req.get('Target-Database');
    try {
        if (isUndefined(db_target)) {
            res.status(400).send();
        } else if (db.mapDbs.has(db_target)) {
            db.mapDbs.get(db_target).kernel.destroy(conditions).then((r) => {
                res.status(200).send(r.toString());
            }).catch((err) => {
                console.log(err);
                res.status(400).send({
                    message:
                        err.message || 'An error occurred while retrieving article.',
                });
            });
            return
        }
        res.status(404).send();
    } catch (e) {
        res.status(500).send({
            message:
                e.message || 'Internal server error.',
        });
    }
};

exports.search = (req, res) => {
    const conditions = createQuery(req.query);
    const db_target = req.get('Target-Database');
    console.log(req.query);
    try {
        if (isUndefined(db_target)) {
            res.status(400).send();
        } else if (db.mapDbs.has(db_target)) {
            db.mapDbs.get(db_target).kernel.findAll(conditions)
                .then(async (data) => {
                    processResponse(req, res, data);
                })
                .catch((err) => {
                    res.status(400).send({
                        message:
                            err.message || 'An error occurred while retrieving article.',
                    });
                });
            return
        }
        res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || 'Internal server error.',
        });
    }
};

exports.city_find = (req, res) => {
    const {value} = req.query;
    const db_target = req.get('Target-Database');
    console.log(req.query);
    const condition = value ? {city: {[queryOp.like]: `${value}%`}} : null;
    try {
        if (isUndefined(db_target)) {
            res.status(400).send();
        } else if (db.mapDbs.has(db_target)) {
            db.mapDbs.get(db_target).kernel.findAll({where: condition})
                .then((data) => {
                    if (data.length > 0) {
                        res.status(200).send(data);
                    } else res.status(204).send(data);
                });
            return
        }
        res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || 'Internal server error.',
        });
    }
};

exports.param_find = async (req, res) => {
    const {param} = req.params;
    const {value} = req.query;
    const db_target = req.get('Target-Database');
    const condition = value ? {[`${param}`]: {[Op.like]: value}} : null;

    try {
        if (isUndefined(db_target)) {
            res.status(400).send();
        } else if (db.mapDbs.has(db_target)) {
            await db.mapDbs.get(db_target).kernel.findAll({where: condition})
                .then((data) => {
                    if (data.length > 0) {
                        res.status(200).send(data);
                    } else res.status(204).send(data);
                });
            return
        }
        res.status(404)
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || 'Internal server error.',
        });
    }

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

async function executeLocalFunctions(db_target, query) {
    const attr = [];
    const kernel = db.mapDbs.get(db_target).kernel;
    for (const [key, value] of Object.entries(query)) {
        if (value === 'true') {
            if (localFunctionsMap.has(key)) {
                const val = localFunctionsMap.get(key);
                await val[0](kernel, query.city, val[1]).then((result) => {
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

async function get_stats(seq, req, city) {
    let response;
    const query = req.query;
    const db_target = req.get('Target-Database');
    console.log(db_target)
    if (isUndefined(db_target)) {
        return {status: 400, res: null};
    } else if (db.mapDbs.has(db_target)) {
        const attr = collectAttributes(seq, query);
        await executeLocalFunctions(db_target, query).then(async (local_res) => {
            await db.mapDbs.get(db_target).kernel.findAll({
                where: {city: {[Op.like]: `%${city}%`}},
                attributes: attr,
            }).then(async (r) => {
                response = await r[0].toJSON()
                await addAllLocalResults(local_res, response);
            }).catch((err) => ({status: 500, res: err}));
        });
        return {status: 200, res: response};
    }
    return {status: 404, res: null};
}

exports.statistics = async (req, res) => {
    let {city} = req.params;
    city = city || '';
    const seq = db.Sequelize;
    req.query.city = city;
    await get_stats(seq, req, city).then((stats) => {
        processResponse(req, res, stats.res, stats.status);
    });
};
