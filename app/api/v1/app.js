// Module dependencies

var express = require('express'),
	async = require('async'),
	mongoose = require('mongoose');
    
// Create http server

var app = module.exports = express();

// Middleware

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Configure mongodb, attached to server context

app.dbconnect = mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: ' + err.message);
	console.error('Make sure a mongoDB server is running and accessible by this application')
});

// Setup API version
app.version = 'v1';

// Default Routes

require('./routes/factory')(app, [
	'user',
	'recipe',
	'reservation',
	'course',
	'location',
	'metro_station',
	'metro_line',
	'authenticated_app'
]);

// Additionnal routes

require('./routes/recipe.ingredient')(app);
require('./routes/search.user.js')(app);

// Route list (documentation)

app.get('/', function(req, res) {
  
	var routes = [];
	
	async.forEach(Object.keys(app.routes), function (method, callback){ 
	
		async.forEach(app.routes[method], function(route, callback){
		  
			routes.push({method: method , path: app.route + route.path});
			callback(); // tell async loop finished
		
		}, function(err){});
		
		callback(); // tell async that the iterator has completed
	
	}, function(err) {
		res.json(routes);
	}); 
 
});

// Launch http server

if (!module.parent) {
	app.listen(3000, function(){
		console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
	});
}
