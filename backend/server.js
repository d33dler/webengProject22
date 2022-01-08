const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');


const whitelist = ['http://localhost:8083', 'http://192.168.178.11:8083', 'http://localhost:8085'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const corsSettings = {
  origin: ['http://localhost:8083', 'http://192.168.178.11:8083', 'http://localhost:8085'],
}
app.use(cors(corsSettings));
// app.use(cors(corsSettings));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
require('./routes/kamernet.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
