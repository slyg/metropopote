module.exports = function(dbconnect){

	var memberSchema = new require('mongoose').Schema({
	    name: { type: String },
	    username: { type: String, required: true, index: { unique: true } },
	    email: { type: String, required: true, index: { unique: true }, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
	    password : { type: String, required: true },
	    customer_reputation : { type: Number, default: 0 },
	    cook_reputation : { type: Number, default: 0 },
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Member = dbconnect.model('Member', memberSchema);
	
	Member.schema.path('name').validate(function (value) {
		return /^[a-zA-Z\u00E0-\u00FC ]+$/g.test(value);
	}, 'Invalid name (letters only)');
	
	Member.schema.path('username').validate(function (value) {
		return /^[0-9a-zA-Z\u00E0-\u00FC]+$/g.test(value);
	}, 'Invalid username (letters and numbers only)');

	return Member;

}

