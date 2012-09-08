module.exports = function(app){

	// Models dependencies
	
	var Member = require('../models/Member')(app.dbconnect);
	
	// Routes
	
	app.get('/members', function(req, res, next){
		Member.find(function (err, members) {
			if (!err) {
				res.json(members);
			} else {
				res.json(500, err);
			}
		}); 
	});
	
	app.get('/member', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.get('/member/:id', function(req, res, next){
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
	
	app.post('/member', function(req, res, next){
		if(req.body.name){
			var member = new Member({
				name : req.body.name
			});
			member.save(function(err){
				if(!err) {
					res.json(member);
				} else {
					res.json(500, err);
				}
			});
		} else {
			res.json(400, {error : "Parameter 'name' is missing"});
		}
	});
	
	app.put('/member', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.put('/member/:id', function(req, res, next){
		if(req.params.id){
			Member.findById(req.params.id, function (err, member) {
				if(!err){
					if(member){
						member.name = req.body.name;
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
	
	app.delete('/member', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.delete('/member/:id', function(req, res, next){
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