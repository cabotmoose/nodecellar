var express = require('express'),
    path = require('path'),
    http = require('http'),
    neighborhood = require('./routes/neighborhoods');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/neighborhoods', neighborhood.findAll);
app.get('/neighborhoods/:id', neighborhood.findById);
app.post('/neighborhoods', neighborhood.addNeighborhood);
app.put('/neighborhoods/:id', neighborhood.updateNeighborhood);
app.delete('/neighborhoods/:id', neighborhood.deleteNeighborhood);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
