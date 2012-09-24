module.exports = function(app){

	// Models dependencies
	
	var Member = require('../models/Member')(app.dbconnect);
	
	// Routes
	
	app.get('/' + app.version + '/members', function(req, res, next){
	
		var 
			limit = req.param('limit') || 10,
			offset = req.param('offset') || 0
		;
	
		Member.find().limit(limit).skip(offset*limit).sort({updated_at : -1}).exec(function (err, members) {
		
			if (!err) {
		
				Member.count({}, function(err, count){
					if(!err){
						res.json({
							data : members,
							count : count
						});
					} else {
						res.json(500, err);
					}
				});
			
			} else {
				res.json(500, err);
			}

		}); 
	});
	
	app.get('/' + app.version + '/members/:id', function(req, res, next){
		Member.findById(req.params.id, function (err, member) {
			if (!err) {
				if(member){
					res.json(member);
				} else {
					res.json(404, {error : "Member doesn't exist"});
				}
			} else {
				res.json(500, err);
			}
		}); 
	});
	
	app.post('/' + app.version + '/members', function(req, res, next){
		if(req.body.name){
			var member = new Member({
				name : req.body.name,
				updated_at : Date.now()
			});
			member.save(function(err){
				if(!err) {
					res.json(201, member);
				} else {
					res.json(500, err);
				}
			});
		} else {
			res.json(400, {error : "Parameter 'name' is missing"});
		}
	});
	
	app.put('/' + app.version + '/members', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.put('/' + app.version + '/members/:id', function(req, res, next){
		if(req.params.id){
			Member.findById(req.params.id, function (err, member) {
				if(!err){
					if(member){
						member.name = req.body.name;
						member.updated_at = Date.now();
						if(member.name){
							member.save(function(err){
								if(!err){
									res.json(member);
								} else {
									res.json(500, err);
								}
							});
						} else {
							res.json(400, {error : "Parameter 'name' is missing"});
						}
					} else {
						res.json(404, {error : "Member doesn't exist"});
					}
					
				}
			});
		} else {
			res.json(400, {error : "Parameter 'id' is missing"});
		}
	});
	
	app.delete('/' + app.version + '/members', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.delete('/' + app.version + '/members/:id', function(req, res, next){
		Member.findById(req.params.id, function (err, member) {
			if(!err){
				if(member){
					member.remove(function(err){
						if(!err){
							res.send('Deletion complete');
						} else {
							res.json(500, err);
						}
					});
				} else {
					res.json(404, {error : "Member doesn't exist"});
				}
			}
		});
	});

};