
const express = require("express");
const cors = require("cors");

const app = express();

var corsSettings = {
    origin: "http://localhost:8085"
};

app.use(cors(corsSettings));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "TestDriving server GR23" });
});
require("./routes/kamernet.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});