const { Op, Sequelize } = require('sequelize');
const medianAverage = require('median-average');
const converter = require('json-2-csv');
const db = require('../db/seq');
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

exports.search = (req, res) => {
    const conditions = createQuery(req.query);
    db.Properties.findAll(conditions).then((r) => {
        res.status(200).send(r);
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

// Find a single Tutorial with an id
exports.id_find = (req, res) => {
    const { id } = req.params;
    const condition = id ? { externalId: { [Op.like]: `${id}` } } : null;

    db.Properties.findOne({ where: condition }).then((data) => {
        if (data != null) {
            res.send([data.getValues()]);
        } else {
            res.status(204).send({
                message:
                    'No article found.',
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'An error occurred while retrieving article.',
        });
    });
};

// Update a Tutorial by the id in the request
exports.id_update = (req, res) => {
    const { id } = req.params;
    db.Properties.update(req.body, {
        where: {
            externalId: id,
        },
    }).then((num) => {
        if (num == 1) {
            res.status(200).send({
                message: 'Article was updated successfully.',
            });
        } else {
            res.status(204).send({
                message: `Cannot update property with id=${id}.Property not found or input is empty!`,
            });
        }
    }).catch(() => {
        res.status(500).send({
            message: `Error updating property with id=${id}`,
        });
    });
};

// Delete a rental post with the specified id in the request
exports.id_delete = (req, res) => {
    const { id } = req.params;

    db.Properties.destroy({
        where: {
            externalId: id,
        },
    }).then((num) => {
        if (num == 1) {
            res.status(200).send({
                message: 'Article was deleted successfully!',
            });
        } else {
            res.status(204).send({
                message: `Cannot delete article with id=${id}. Property not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: `An error occurred while deleting article with id=${id}`,
        });
    });
};

exports.lat_long_find = (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    db.Properties.findAll({
        where: {
            [Op.and]:
                [
                    { latitude: { [Op.like]: `${lat}` } },
                    { longitude: { [Op.like]: `${long}` } },
                ],
        },
    }).then((data) => {
        if (data.length === 0) {
            res.send({ message: '0 Properties found at the provided location' });
        } else res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving property.',
        });
    });
};

exports.lat_long_update = (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    db.Properties.update(req.body, {
        where: {
            latitude: lat,
            longitude: long,
        },
    }).then((num) => {
        if (num === 0) {
            res.status(204).send({
                message: 'Found 0 articles to update',
            });
        } else {
            res.status(200).send({
                message: `Updated ${num} articles with lat=${lat} & long= ${long}`,
            });
        }
    }).catch(() => {
        res.status(500).send({
            message: 'Encountered an error while updating articles by location',
        });
    });
};

exports.lat_long_delete = (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    db.Properties.destroy({
        where: {
            latitude: lat,
            longitude: long,
        },
    }).then((num) => {
        if (num !== 0) {
            res.status(200).set({
                message: `Deleted ${num} articles with lat=${lat} & long= ${long}.`,
            });
        } else res.status(404).send({ message: 'Could not find any articles to delete' });
    }).catch((err) => {
        res.status(500).send({
            message: `Could not delete Property with lat=${lat} & long= ${long}`,
        });
    });
};

exports.active_budget_find = (req, res) => {
    const { min } = req.query;
    const { max } = req.query;
    const { format } = req.query;

    db.Properties.findAll({
        where: {
            [Op.and]:
                [
                    { rent: { [Op.gte]: `${min}` } },
                    { rent: { [Op.lte]: `${max}` } },
                ],
        },
        raw: true,
    }).then((data) => {
        if (data.length !== 0) {
            if (format === 'csv') {
                console.log(data);
                converter.json2csv(data, (err, csv) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                err.message || 'Some error occurred while retrieving property.',
                        });
                    }
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(csv);
                });
            } else {
                res.status(200).send(data);
            }
        } else res.status(204).send({ message: '0 Articles found for the specified quarry' });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving property.',
        });
    });
};

exports.active_top_list = (req, res) => {
    activeFindByParam(req.query.parameter, req, res);
};

function activeFindByParam(param, req, res) {
    let { city } = req.params;
    city = city || '';
    const { ascending, amount: n } = req.query;
    const asc = (parseInt(ascending, 10) === 1) ? 'ASC' : 'DESC';
    const seq = db.sequelizeProperties;
    db.Properties.findAll({
        limit: parseInt(n, 10),
        where: {
            [Op.and]:
                [
                    { isRoomActive: { [Op.eq]: 1 } },
                    { city: { [Op.like]: `%${city}%` } },
                ],
        },
        order: [[`${param}`, asc]],
    }).then((data) => { // add 0  prop msg
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving property.',
        });
    });
}

async function json_add_attr(obj, field, value) {
    obj[field] = value;
}

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
            console.log(r);
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
