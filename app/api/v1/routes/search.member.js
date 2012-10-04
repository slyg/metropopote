module.exports = function(app){

	// Models dependencies
	
	var Member = require('../models/Member')(app.dbconnect);
	
	// Routes
		
	app.get('/' + app.version + '/search/members', function(req, res, next){
		
		Member.find(req.query, function (err, members) {

			if (!err) {
			
				res.json({
					data : members,
					count : members.length
				});		
				
			} else { res.json(500, err); }
				
		});
			
	});
	
};
