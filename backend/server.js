// Create express app
require('dotenv').config();
var express = require("express")
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express()
var db = require("./database.js")
var poe = require("./apps/poe.js")

// Cors
app.use(cors());
app.use(bodyParser.json());

// Server port
var HTTP_PORT = process.env["APP_PORT"] 

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints
app.get("/api/users", async (req, res, next) => {
  var user = await db.listUser(req);
  res.send(JSON.stringify(user, null, 4));
});

app.post("/accounts/signup", (req, res) => {
  db.createUser(req.body);
  res.send(req.body);
});

app.post("/accounts/signin", async (req, res) => {
    var result = await db.getUser(req.body);
    res.send(result);
});

app.post("/txn/send", async(req, res) => {
  var objPoeResponse = await poe.send(req);
  await db.writeTxn(JSON.parse(objPoeResponse));
  res.send(objPoeResponse);
});

app.post("/txn/list", async(req, res) => {
  var objPoeResponse = await poe.list(req);
  res.send(objPoeResponse);
});

app.post("/credentials/verify", async (req, res) => {
  var objPoeResponse = await poe.verify(req);
  res.send(objPoeResponse);
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});