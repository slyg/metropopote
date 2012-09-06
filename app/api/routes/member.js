module.exports = function(app){

	// Models dependencies
	
	var Member = require('../models/Member')(app);
	
	// Routes
	
	app.get('/members', function(req, res, next){
	
		console.log('RETRIEVE MEMBERS COLLECTION');
		
		Member.find(function (err, members) {
			if (!err) {
				res.json(members);
			} else {
				res.json({error : err});
			}
		}); 
	});
	
	app.get('/member/:id', function(req, res, next){
		console.log('RETRIEVE MEMBER ITEM');
		Member.findById(req.params.id, function (err, member) {
			if (!err) {
				res.json(member);
			} else {
				throw err;
				res.json({error : err});
			}
		}); 
	});
	
	app.post('/member', function(req, res, next){
	
		console.log('CREATE MEMBER ITEM');
		
		var member = new Member({
			name : req.body.name
		});
		
		member.save(function(err){
			if(!err) {
				res.json(member);
			} else {
				res.json({error : err});
			}
		});
	
	});
	
	app.put('/member', function(req, res, next){
		console.log('UPDATE MEMBER ITEM (not implememented)');
	});
	
	app.delete('/member', function(req, res, next){
		console.log('REMOVE MEMBER ITEM (not implememented)');
	});

};
