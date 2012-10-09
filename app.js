// Module dependencies

var 
	express = require('express'),
	conf = require('./conf')
;

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

app.use('/', require('./app/mobile/app'));
app.use('/api', require('./app/api/v1/app'));
// /!\ swig cannot cohabit in several environnements so if you want to use sandbox, deactivate root '/'
//app.use('/sandbox', require('./app/sandbox/app'));

// Launch http server

app.listen(conf.app.port, function(){
	console.log("Express server listening on port %d in %s mode", conf.app.port, app.settings.env);
});
