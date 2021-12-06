const property = require("../app/controller/kamernet.controller");

require("../app/controller/kamernet.controller");
module.exports = app => {
    const nrp_control = require("../app/controller/kamernet.controller");

    var router = require("express").Router();

    // Create a new property
    router.post("articles/new", nrp_control.create);


    // Retrieve a single Tutorial with id
    router.get("articles/id/:id", nrp_control.id_find);
    router.put("articles/id/:id", nrp_control.id_update);
    router.delete("articles/id/:id", nrp_control.id_delete);


    router.get("articles/location", nrp_control.lat_long_find);
    router.delete("articles/location", nrp_control.lat_long_delete);
    router.put("articles/location", nrp_control.lat_long_update);

    router.get("articles/search-budget", nrp_control.active_budget_find);


    router.get("articles/top-list/:city?", nrp_control.active_top_list)


    router.get("articles/statistics/:city?", nrp_control.statistics);

    app.use('/nrp', router);
};