module.exports = function(app){

	// Models dependencies
	
	var User = require('../models/User')(app.dbconnect);
	
	// Routes
		
	app.get('/' + app.version + '/search/users', function(req, res, next){
		
		User.find(req.query, function (err, users) {

			if (!err) {
			
				res.json({
					data : users,
					count : users.length
				});		
				
			} else { res.json(500, err); }
				
		});
			
	});
	
};
