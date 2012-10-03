module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var authenticated_appSchema = new Schema({
		title: { type: String, required: true },
		url : { type: String, required:true },
		updated : { type: Date, default: Date.now },
		created : { type: Date, default: Date.now }
	});

	var Authenticated_app = dbconnect.model('Authenticated_app', authenticated_appSchema);
	
	Authenticated_app.schema.path('title').validate(function (value) {
		return /^[a-zA-Z\u00E0-\u00FC -]+$/g.test(value);
	}, 'Invalid title (letters only)');

	Authenticated_app.schema.path('url').validate(function (value) {
                return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i.test(value);
        }, 'Invalid title (letters only)');

	return Authenticated_app;

}

