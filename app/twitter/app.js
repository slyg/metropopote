// loading dependencies
var
	http = require('http'),
	express = require('express'),
	cons = require('consolidate'),
	swig = require('swig'),
	mongoose = require('mongoose')
	passport = require('passport')
	util = require('util')
	TwitterStrategy = require('passport-twitter').Strategy
	Schema = mongoose.Schema
;

// creating app
var app = module.exports = express();


// twitter credencials
var TWITTER_CONSUMER_KEY = "cEEX9ZxFerB7SeGPhx3Hcw";
var TWITTER_CONSUMER_SECRET = "0sRjUGPdQQjcreGQvvk7KxmnaDTuSMb39E7QZod0TA";

// twitter strategy middleware /!\ using local.host domain for twitter testing
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://local.host:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {

    http.get("http://local.host:3000/api/v1/search/members?uid=" + profile.id, function(res) {
	var buffer = '';
	res.on('data', function(chunk){buffer += chunk;});
	res.on('end', function(){

		var response = JSON.parse(buffer);

		if(response.count == 1){ // means we have a known member

			console.log('known member');
			done(null, response.data[0]);

		} else { //means unknown member

			console.log('unknown member, creating a new one');
			
			var newMember = JSON.stringify({
				provider : "twitter",
				uid : profile.id,
				name : profile.displayName,
				username : profile.username,
				image : profile._json.profile_image_url
			});

			var options = {
                                host: 'local.host',
				port: '3000',
                                path: '/api/v1/members',
                                method: 'POST',
                                headers : {
                 			'Content-Type': 'application/json',
					'Content-Length': newMember.length
                		}
                        };
			
			var request = http.request(options, function(res){
				var buffer='';
				res.on('data', function(chunk){buffer += chunk;});
				res.on('end', function(){
					var response = JSON.parse(buffer);
					console.log('created member');
					done(null, response);
				});
			});

			request.end(newMember);

		}

	});

    }).end();

  }
));

//helper function (simplyfy http post requests)
function parsePost(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    callback(data);
  });
}

// session stuff
passport.serializeUser(function(member, done) {
  done(null, member.uid);
});

passport.deserializeUser(function(uid, done) {
  
  http.get("http://local.host:3000/api/v1/search/members?uid=" + uid, function(res) {
        var buffer = '';
        res.on('data', function(chunk){buffer += chunk;});
        res.on('end', function(){

                var response = JSON.parse(buffer);
		var member = response.data[0];
		if(member) {
			done(null, member);
		} else {
			done(null, new Error("unable to find supposed known member"));
		}

	});
  });

});

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.engine('html', cons.swig);
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        swig.init({cache: false});
});

// routing
app.get('/', function(req, res){
  res.render('home.html', { user: req.user, route : app.route, cache: false });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

if (!module.parent) {
        app.listen(3000, function(){
                console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
        });
}
