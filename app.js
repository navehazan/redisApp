const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

//Set redis
const client=redis.createClient();
client.on("connect",()=>{
  console.log("connected to redis")
})

// Set Port
const port = 3000;

// Init app
const app = express();

// View Engine\
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// methodOverride
app.use(methodOverride("_method"));

// Search Page
app.get("/", (req, res, next) => {
  res.render("searchUsers");
});
app.post("/user/search", (req, res, next) => {
  const id = req.body.id;
  console.log(id);
});
app.listen(port, () => {
  console.log("Server started on port " + port);
});
