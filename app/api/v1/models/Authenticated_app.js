module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var authenticated_appSchema = new Schema({
		title: { type: String, required: true },
		updated : { type: Date, default: Date.now },
		created : { type: Date, default: Date.now }
	});

	var Authenticated_app = dbconnect.model('Authenticated_app', authenticated_app);
	
	Recipe.schema.path('title').validate(function (value) {
		return /^[a-zA-Z\u00E0-\u00FC -]+$/g.test(value);
	}, 'Invalid title (letters only)');

	return Authenticated_app;

}

