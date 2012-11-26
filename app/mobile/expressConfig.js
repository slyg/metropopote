module.exports = function(express, app, ctx){
	
	app.configure(function() {
		app.set('views', __dirname + '/views');
	    app.engine('html', ctx.cons.swig);
		app.use(express.logger());
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.session({ secret: 'lamarck-caulincourt' }));
		app.use(ctx.passport.initialize());
		app.use(ctx.passport.session());
		app.use(app.router);
		app.use(express.static(__dirname + '/static'));
	});
	
	app.configure('development', function(){
		ctx.swig.init({ root: __dirname + '/views', allowErrors: true, cache: false });
	});
	
	app.configure('production', function(){
		ctx.swig.init({ root: __dirname + '/views', allowErrors: true, cache: true });
		app.use(express.errorHandler());
	});
	
}