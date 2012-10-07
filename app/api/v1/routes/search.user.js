module.exports = function(app){

	// Models dependencies
	
	var User = require('../models/User')(app.dbconnect);
	
	// Routes
		
	app.get('/' + app.version + '/search/users', function(req, res, next){
	

		var
			limit = req.param('limit') || 10,
			offset = req.param('offset') || 0
		;

		// removing reserved properties

		var query = req.query;
		if(query.limit) delete query.limit;
		if(query.offset) delete query.offset;
	
		User.find(query).limit().limit(limit).skip(offset*limit).exec(function (err, users) {

			if (!err) {
			
				res.json({
					data : users,
					count : users.length
				});		
				
			} else { res.json(500, err); }
				
		});
			
	});
	
};
