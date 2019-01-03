const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

//Set redis
const client = redis.createClient();
client.on("connect", () => {
  console.log("connected to redis");
});

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
  res.render("searchusers");
});
// Add User Page
app.get("/user/add", (req, res, next) => {
  res.render("adduser");
});
app.post("/user/search", (req, res, next) => {
  // Search processing
  let id = req.body.id;

  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.render("searchusers", {
        error: "User does not exist"
      });
    } else {
      obj.id = id;
      res.render("details", {
        user: obj
      });
    }
  });
});

// Process Add User Page
app.post("/user/add", (req, res, next) => {
  const { id, first_name, last_name, email, phone } = req.body;
  client.hmset(id, ["first_name", first_name, "last_name", last_name, "email", email, "phone", phone]);
  res.redirect("/");
});

// Delete User
app.delete("/user/delete/:id", (req, res, next) => {
  client.del(req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
