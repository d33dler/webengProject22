const db = require("../db/seq");
const {Op, Sequelize} = require("sequelize");
const {response} = require("express");
const medianAverage = require("median-average");
const converter = require('json-2-csv');


// Create and upload a new property
exports.create = (req, res) => {
    if (!req.body.externalId) {
        res.status(400).send({
            message: "Missing External ID is a primary key!"
        });
        return;
    }

    const rentProp = {
        address: req.body.address,
        city: req.body.city,
        externalId: req.body.externalId,
    };

    // Upload new property in the database
    db.Properties.create(rentProp)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating new rental post"
            });
        });
};


// Find a single Tutorial with an id
exports.id_find = (req, res) => {
    const id = req.params.id;
    var condition = id ? {externalId: {[Op.like]: `${id}`}} : null;

    db.Properties.findOne({where: condition}).then(data => { //add not found
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "An error occurred while retrieving article."
        });
    });
};

// Update a Tutorial by the id in the request
exports.id_update = (req, res) => {
    const id = req.params.id;
    db.Properties.update(req.body, {
        where: {
            externalId: id
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Article was updated successfully."
            });
        } else {
            res.status(404).send({
                message: `Cannot update property with id=${id}.Property not found or input is empty!`
            });
        }
    }).catch(() => {
        res.status(500).send({
            message: "Error updating property with id=" + id
        });
    });
};

// Delete a rental post with the specified id in the request
exports.id_delete = (req, res) => {
    const id = req.params.id;

    db.Properties.destroy({
        where: {
            externalId: id
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Article was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete article with id=${id}. Property not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "An error occurred while deleting article with id=" + id
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
                    {latitude: {[Op.like]: `${lat}`}},
                    {longitude: {[Op.like]: `${long}`}}
                ]
        }
    }).then(data => {
        if (data.length === 0) {
            res.send({message: "0 Properties found at the provided location"})
        } else res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving property."
        });
    });
}

exports.lat_long_update = (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    db.Properties.update(req.body, {
        where: {
            latitude: lat,
            longitude: long
        }
    }).then(num => {
        if (num === 0) {
            res.status(404).send({
                message: "Found 0 articles to update"
            })
        } else {
            res.status(200).send({
                message: `Updated ${num} articles with lat=${lat} & long= ${long}`
            });
        }
    }).catch(() => {
        res.status(500).send({
            message: "Encountered an error while updating articles by location"
        });
    });
}

exports.lat_long_delete = (req, res) => {
    const lat = req.query.latitude;
    const long = req.query.longitude;

    db.Properties.destroy({
        where: {
            latitude: lat,
            longitude: long
        }
    }).then(num => {
        if (num !== 0) {
            res.status(200).set({
                message: `Deleted ${num} articles with lat=${lat} & long= ${long}.`
            });
        } else res.status(404).send({message: `Could not find any articles to delete`})

    }).catch(err => {
        res.status(500).send({
            message: `Could not delete Property with lat=${lat} & long= ${long}`
        });
    });
}

exports.active_budget_find = (req, res) => {
    const min = req.query.min;
    const max = req.query.max;
    const format = req.query.format;

    db.Properties.findAll({
        where: {
            [Op.and]:
                [
                    {rent: {[Op.gte]: `${min}`}},
                    {rent: {[Op.lte]: `${max}`}}
                ]
        },
        raw: true
    }).then(data => {
        if (data.length !== 0) {
            if (format === 'csv') {
                console.log(data);
                converter.json2csv(data, (err, csv) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving property."
                        });
                    }
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(csv);
                });
            } else {
                res.status(200).send(data);
            }
        } else res.status(204).send({message: "0 Articles found for the specified quarry"})

    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving property."
        });
    });
}

exports.active_top_list = (req, res) => {
    activeFindByParam(req.query.parameter, req, res);
}

function activeFindByParam(param, req, res) {
    let city = req.params.city;
    city = city ? city : ''
    const ascending = req.query.ascending;
    const n = req.query.amount;
    const asc = (ascending === 'true') ? 'ASC' : 'DESC';
    const seq = db.sequelize;
    db.Properties.findAll({
        limit: parseInt(n),
        where: {
            [Op.and]:
                [
                    {isRoomActive: true},
                    {city: {[Op.like]: `%${city}%`}}
                ]
        },
        order: [[`${param}`, asc]]
    }).then(data => { //add 0  prop msg
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving property."
        });
    });
}

exports.statistics = (req, res) => {
    let city;
    city = req.params.city;
    city = city ? city : ''
    const seq = db.Sequelize;
    send_all_stats(seq, city, res).then(() => {
    })
}

async function send_all_stats(seq, city, res) {
    const m_deposit = await calc_median(city, `deposit`)
    const m_cost = await calc_median(city, `rent`)

    if (m_deposit != null) {
        await db.Properties.findAll({
            where: {city: {[Op.like]: `%${city}%`}},
            attributes: [
                [seq.fn('COUNT', seq.col('externalId')), 'entries_n'],
                [seq.fn('AVG', seq.col('rent')), 'mean_cost'],
                [seq.fn('STD', seq.col('rent')), 'sd_cost'],
                [seq.fn('AVG', seq.col('deposit')), 'mean_deposit'],
                [seq.fn('STD', seq.col('deposit')), 'sd_deposit'],
            ]
        }).then(r => {
            const jsonObj = r[0].toJSON();
            json_add_attr(jsonObj, "median_cost", m_cost);
            json_add_attr(jsonObj, "median_deposit", m_deposit);
            json_add_attr(jsonObj, "city", city.length === 0 ? "*" : city)
            res.status(200).send(jsonObj)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Failed to fetch database statistics."
            });
        });
    } else {
        res.status(204).send({message: "The quarried city name was not found in the database"});
    }
}

async function calc_median(city, param) {
    let res = null;
    await db.Properties.count({
        where: {city: {[Op.like]: `%${city}%`}}
    }).then(async mid => {
        if (mid !== 0) {
            const mid2 = Math.trunc(mid / 2) - 1;
            mid = mid % 2 === 0 ? mid / 2 : Math.trunc(mid / 2) + 1;
            await db.Properties.findAll({
                where: {city: {[Op.like]: `%${city}%`}},
                order: [[param, 'ASC']],
                offset: mid2,
                limit: mid - mid2,
                attributes: [param]
            }).then(median_res => {
                console.error(median_res)
                let x = 0;
                for (let i = 0; i < median_res.length; i++) {
                    x += median_res[i][`${param}`];
                }
                res = x / median_res.length;

            })
        } else {
            return null;
        }
    });
    console.log(res);
    return res;
}


function json_add_attr(obj, field, value) {
    obj[field] = value;
}


