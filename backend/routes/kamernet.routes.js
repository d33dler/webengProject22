const property = require('../app/controller/kamernet.controller');

require('../app/controller/kamernet.controller');
const nrp_control = require('../app/controller/kamernet.controller');
const cors = require('cors');

module.exports = (app) => {
  const nrp_control = require('../app/controller/kamernet.controller');

  const router = require('express').Router();

  // Create a new property
  router.post('/new', nrp_control.create);

  // Retrieve a single Tutorial with id
  router.get('/', nrp_control.trylogin);
  router.get('/id/:id', nrp_control.id_find);
  router.get('/:city?', nrp_control.city_find);
  router.get('/:param?', nrp_control.param_find);
  router.put('/id/:id', nrp_control.id_update);
  router.delete('/id/:id', nrp_control.id_delete);

  router.get('/search/filter', nrp_control.search);
  router.delete('/search/filter', nrp_control.delete);
  router.put('/search/filter', nrp_control.update);

  router.get('/location', nrp_control.lat_long_find);
  router.delete('/location', nrp_control.lat_long_delete);
  router.put('/location', nrp_control.lat_long_update);

  router.get('/search-budget', nrp_control.active_budget_find);

  router.get('/top-list/:city?', nrp_control.active_top_list);

  router.get('/statistics/:city?', nrp_control.statistics);

  app.use('/nrp/articles', router);
};
