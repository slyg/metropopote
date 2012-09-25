module.exports = function(app){

	// Models dependencies
	
	var Recipe = require('../models/Recipe')(app.dbconnect);
	
	// Routes
	
	app.post('/' + app.version + '/recipes', function(req, res, next){
		if(req.body){
			var recipe = new Recipe(req.body);
			recipe.save(function(err){
				if(!err) {
					res.json(201, recipe);
				} else {
					res.json(500, err);
				}
			});
		} else {
			res.json(400, {error : "Parameter missing"});
		}
	});
	
	app.get('/' + app.version + '/recipes', function(req, res, next){
	
		var 
			limit = req.param('limit') || 10,
			offset = req.param('offset') || 0
		;
	
		Recipe.find().limit(limit).skip(offset*limit).sort({updated : -1}).exec(function (err, recipes) {
		
			if (!err) {
		
				Recipe.count({}, function(err, count){
					if(!err){
						res.json({
							data : recipes,
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
	
	app.get('/' + app.version + '/recipes/:id', function(req, res, next){
		Recipe.findById(req.params.id, function (err, recipe) {
			if (!err) {
				if(recipe){
					res.json(recipe);
				} else {
					res.json(404, {error : "Recipe doesn't exist"});
				}
			} else {
				res.json(500, err);
			}
		}); 
	});

};