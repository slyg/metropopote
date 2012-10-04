// Module dependencies

var express = require('express');

// Create http server

var app = module.exports = express();

// Configuration

app.configure(function(){
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

//app.get('/', function(req, res, next){ res.redirect('/login'); });
app.use('/', require('./app/mobile/app'));
app.use('/api', require('./app/api/v1/app'));
app.use('/sandbox', require('./app/sandbox/app'));
//app.use('/twitter', require('./app/twitter/app'));

// Launch http server

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
