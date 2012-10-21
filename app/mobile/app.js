// loading dependencies
var
	http = require('http'),
	express = require('express'),
	cons = require('consolidate'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	util = require('util'),
	conf = require('../../conf'),
	TwitterStrategy = require('passport-twitter').Strategy,
	Schema = mongoose.Schema,
	host = conf.app.host,
	port = conf.app.port,
	sessionUsers = {} // store current users
;

// creating app
var app = module.exports = express();

// twitter strategy middleware /!\ using local.host domain for twitter testing
passport.use(new TwitterStrategy({
	consumerKey: conf.twitter.consumerKey,
	consumerSecret: conf.twitter.consumerSecret,
	callbackURL: "http://" + host + ":" + port + "/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {

    http.get("http://" + host + ":" + port + "/api/v1/search/users?uid=" + profile.id + "&app_auth_check=" + conf.app.auth_check, function(res) {
	
	parsePost(res, function(response){
		if(response.count == 1){ // means we have a known user

                        console.log('known user');
                        done(null, response.data[0]);

                } else { //means unknown user

                        console.log('unknown user, creating a new one');

                        var newUser = JSON.stringify({
                                provider : "twitter",
                                uid : profile.id,
                                name : profile.displayName,
                                username : profile.username,
                                image : profile._json.profile_image_url
                        });

                        var options = {
                                host: host,
                                port: port,
                                path: '/api/v1/users?app_auth_check=' + conf.app.auth_check,
                                method: 'POST',
                                headers : {
                                        'Content-Type': 'application/json',
                                        'Content-Length': newUser.length
                                }
                        };

                        http.request(options, function(res){
                                parsePost(res, function(response){
                                        console.log('created user');
                                        done(null, response);
                                });
                        }).end(newUser);

                }
	});

    }).end();

}));

// helper function (simplify http post requests)
function parsePost(res, callback) {
	var data = '';
	res.on('data', function(chunk) { data += chunk; });
	res.on('end', function() { callback(JSON.parse(data)); });
}

// session stuff
passport.serializeUser(function(user, done) {
	sessionUsers[user.uid] = user;
	done(null, user.uid);
});
passport.deserializeUser(function(uid, done) {
	if(sessionUsers[uid]){
		done(null, sessionUsers[uid]);
	} else {
		done(null, new Error("unable to find supposed known user"));
	}
});

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
        app.engine('html', cons.swig);	
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'lamarck-caulincourt' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
        //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	swig.init({ root: __dirname + '/views', allowErrors: true, cache: false });
});

app.configure('production', function(){
        app.use(express.errorHandler());
});

// routing

app.get('/', ensureAuthenticated, function(req, res){ res.redirect('/home'); });

app.get('/login', function(req, res){
	res.render('login.html', { user: req.user, route : app.route });
});

app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){
  		// The request will be redirected to Twitter for authentication, so this function will not be called.
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

if (!module.parent) {
        app.listen(3000, function(){
                console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
        });
}
