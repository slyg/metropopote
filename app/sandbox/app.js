// Module dependencies

var express = require('express'),
	cons    = require('consolidate');
    
// Create http server

var app = module.exports = express();

// Middleware

app.configure(function(){
 
	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.engine('html', cons.swig);
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));
	});

	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Route list

app.get('/', function(req, res) {
	res.render('home.html');
});

// Launch http server

if (!module.parent) {
	app.listen(3000, function(){
		console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
	});
}
