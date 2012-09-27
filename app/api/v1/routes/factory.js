// This factory builds default REST routes

module.exports = function(app, modelName){

	// Models dependencies
	
	var Model = require('../models/' + modelName.charAt(0).toUpperCase() + modelName.slice(1))(app.dbconnect);
	
	// Routes
	
	app.post('/' + app.version + '/' + modelName + 's', function(req, res, next){
		if(req.body){
			var model = new Model(req.body);
			model.save(function(err){
				if(!err) {
					res.json(201, model);
				} else {
					res.json(500, err);
				}
			});
		} else {
			res.json(400, {error : "Parameter missing"});
		}
	});
	
	app.get('/' + app.version + '/' + modelName + 's', function(req, res, next){
	
		var 
			limit = req.param('limit') || 10,
			offset = req.param('offset') || 0
		;
	
		Model.find().limit(limit).skip(offset*limit).sort({updated : -1}).exec(function (err, models) {
		
			if (!err) {
		
				Model.count({}, function(err, count){
					if(!err){
						res.json({
							data : models,
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
	
	app.get('/' + app.version + '/' + modelName + 's/:id', function(req, res, next){
		Model.findById(req.params.id, function (err, model) {
			if (!err) {
				if(model){
					res.json(model);
				} else {
					res.json(404, {error : "Object doesn't exist"});
				}
			} else {
				res.json(500, err);
			}
		}); 
	});
	
	app.put('/' + app.version + '/' + modelName + 's', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.put('/' + app.version + '/' + modelName + 's/:id', function(req, res, next){
		if(req.params.id){
			Model.findById(req.params.id, function (err, model) {
				if(!err){
					if(model){
						for(var key in req.body){
							model[key] = req.body[key];
						}
						model.updated = Date.now();
						model.save(function(err){
							if(!err){
								res.json(model);
							} else {
								res.json(500, err);
							}
						});
					} else {
						res.json(404, {error : "Object doesn't exist"});
					}
					
				}
			});
		} else {
			res.json(400, {error : "Parameter 'id' is missing"});
		}
	});
	
	app.delete('/' + app.version + '/' + modelName + 's', function(req, res, next){
		res.json(400, {error : "Parameter 'id' is missing"});
	});
	
	app.delete('/' + app.version + '/' + modelName + 's/:id', function(req, res, next){
		Model.findById(req.params.id, function (err, model) {
			if(!err){
				if(model){
					model.remove(function(err){
						if(!err){
							res.send('Deletion complete');
						} else {
							res.json(500, err);
						}
					});
				} else {
					res.json(404, {error : "Object doesn't exist"});
				}
			}
		});
	});

};