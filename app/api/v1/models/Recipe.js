module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var recipeSchema = new Schema({
		title: { type: String, required: true },
		ingredients : [{ type: String, lowercase: true }],
		id_owner : { type: ObjectId, required: true},
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Recipe = dbconnect.model('Recipe', recipeSchema);
	
	Recipe.schema.path('title').validate(function (value) {
		return /^[a-zA-Z\u00E0-\u00FC -]+$/g.test(value);
	}, 'Invalid title (letters only)');

	return Recipe;

}

