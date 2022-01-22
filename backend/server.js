const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

require('nodemon');
require('ngrok');

const corsSettings = {
    origin: process.env.CLIENT_ORIGIN
        || ['http://localhost:*', 'http://192.168.178.11:3000', 'http://localhost:3000'],
};
app.use(cors(corsSettings));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
require('./routes/kamernet.routes')(app);

// set port, listen for requests
const PORT = process.env.DOCKER_PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
