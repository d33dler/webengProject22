const express = require('express');
const cors = require('cors');

const app = express();
var bodyParser = require('body-parser');
const corsSettings = {
  origin: 'http://localhost:8083',
};

app.use(cors(corsSettings));

// parse requests of content-type - application/json
app.use(express.json());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require('./routes/kamernet.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
