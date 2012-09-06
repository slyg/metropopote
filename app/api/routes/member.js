module.exports = function(app){

	// Models dependencies
	
	var Member = require('../models/Member')(app);
	
	// Routes
	
	app.get('/members', function(req, res, next){
		Member.find(function (err, members) {
			if (!err) {
				res.json(members);
			} else {
				res.json(err);
			}
		}); 
	});
	
	app.get('/member/:id', function(req, res, next){
		Member.findById(req.params.id, function (err, member) {
			if (!err) {
				if(member){
					res.json(member);
				} else {
					res.json({error : "Member doesn't exist"});
				}
			} else {
				res.json(err);
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
					res.json(err);
				}
			});
		} else {
			res.json({error : "Parameter 'name' is missing"});
		}
	});
	
	
	app.put('/member/:id', function(req, res, next){
		Member.findById(req.params.id, function (err, member) {
			if(!err){
				if(member){
					member.name = req.body.name;
					if(member.name){
						member.save(function(err){
							if(!err){
								res.json(member);
							} else {
								res.json(err);
							}
						});
					} else {
						res.json({error : "Parameter 'name' is missing"});
					}
				} else {
					res.json({error : "Member doesn't exist"});
				}
				
			}
		});
	});
	
	app.delete('/member/:id', function(req, res, next){
		Member.findById(req.params.id, function (err, member) {
			if(!err){
				if(member){
					member.remove(function(err){
						if(!err){
							res.send('Deletion complete');
						} else {
							res.json(err);
						}
					});
				} else {
					res.json({error : "Member doesn't exist"});
				}
			}
		});
	});

};