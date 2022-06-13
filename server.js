const express = require('express')
const app = express()
const database = require('./database')

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'))

app.get('/', function (request, response) {
  response.send('<iframe name="dummyframe" id="dummyframe" style="display: none"></iframe><input id="input"><form id="form" method="post" target="dummyframe"></form><button onclick="document.getElementById(\'form\').action = \'/steam/apps/\'+document.getElementById(\'input\').value; document.getElementById(\'form\').submit()">Add a game</button>');
});

app.get("/steam/apps/", function(request, response) {
  database.findAll().then(r => response.send(r));
});

app.get("/steam/apps/:appId", function(request, response) {
  database.findOneByAppId(request.params.appId).then(r => response.send(r));
});

app.post("/steam/apps/:appId", urlencodedParser, function(request, response) {
  database.create(request.params.appId).then(r => response.send(r));
});

app.listen(3000);

console.log('-');
