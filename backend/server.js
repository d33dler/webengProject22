const express = require('express');
const cors = require('cors');
const apiManager = require('./app/apis/apiManager')
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

require('nodemon');
require('ngrok');
const path = require('path');

apiManager.map();

const corsSettings = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsSettings));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'frontend_build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_build', 'index.html'));
});


app.use(express.urlencoded({ extended: true }));
require('./routes/kamernet.routes')(app);

// set port, listen for requests
const PORT = process.env.DOCKER_PORT || 6868;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}.`);
});
