module.exports = function(app){

	// Models dependencies
	
	var Recipe = require('../models/Recipe')(app.dbconnect);
	
	// Routes
		
	app.get('/' + app.version + '/recipes/:id/ingredients', function(req, res, next){
		
		Recipe.findById(req.params.id, function (err, recipe) {
		
			if (!err) {
			
				if(recipe){
					
					if(recipe.ingredients){
					
						res.json({
							data : recipe.ingredients,
							count : recipe.ingredients.length
						});
					
					} else { res.json(404, {error : "Recipe doesn't contain any ingredient"}); }
					
				} else { res.json(404, {error : "Recipe doesn't exist"}); }
				
			} else { res.json(500, err); }
				
		});
			
	});
	
};