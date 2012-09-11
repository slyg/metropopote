module.exports = function(dbconnect){

	var memberSchema = new require('mongoose').Schema({
	    name: String,
	    updated_at : Date
	});

	var Member = dbconnect.model('Member', memberSchema);
	
	Member.schema.path('name').validate(function (value) {
		return /^[a-zA-Z\u00E0-\u00FC]+$/g.test(value);
	}, 'Invalid Name');

	return Member;

}

