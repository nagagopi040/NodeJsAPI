const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/products", require("./routes/products"));

app.listen(3000, function() {
  console.log("eStore app is up and running on port 3000");
});
