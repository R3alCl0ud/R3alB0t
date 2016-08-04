var express = require('express');
var app = express();

const PORT = 8080;

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {});
});

app.listen(PORT, function() {
  console.log("Listening on port ".concat(PORT));
});
