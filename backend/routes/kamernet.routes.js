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
  router.get('/city/:city?', nrp_control.city_find);

  router.get('/search/filter', nrp_control.search);
  router.delete('/search/filter', nrp_control.delete);
  router.patch('/search/filter', nrp_control.update);
  router.get('/statistics/:city?', nrp_control.statistics);

  app.use('/nrp/articles', router);
};
