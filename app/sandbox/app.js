// Module dependencies

var 
	express = require('express'),
	cons    = require('consolidate'),
	swig	= require('swig'),
	conf	= require('../../conf')
;
    
// Create http server

var app = module.exports = express();

// Middleware

app.configure(function(){
	app.engine('html', cons.swig);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	swig.init({cache: false});
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Route list

app.get('/', function(req, res) {
	res.render('home.html', {route : app.route, cache: false, apiversion : 'v1'});
});

// Launch http server

if (!module.parent) {
	app.listen(conf.app.port, function(){
		console.log("Express server listening on port %d in %s mode", conf.app.port, app.settings.env);
	});
}
