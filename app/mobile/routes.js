module.exports = function(app, passport){

	app.get('/', ensureAuthenticated, function(req, res){ res.redirect('/home'); });
	
	app.get('/login', function(req, res){
		res.render('login.html', { user: req.user, route : app.route });
	});
	
	app.get('/auth/twitter',
		passport.authenticate('twitter'),
		function(req, res){
	  		// The request will be redirected to Twitter for authentication, 
	  		// so this function will not be called.
		});
	
	app.get('/auth/twitter/callback', 
		passport.authenticate('twitter', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect('/home');
		}
	);
	
	app.get('/home', ensureAuthenticated, function(req, res){
	        res.render('home.html', { user: req.user, route : app.route });
	});
	
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	
	// routing authentication check
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}

}