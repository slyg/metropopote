module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var courseSchema = new Schema({
		date_begin: { type: Date, required: true },
		date_end: { type: Date, required: true },
		comment : { type: String },
		max_portions : { type: Number, required: true },
		reserved_portions : { type: Number, default: 0 },
		id_recipe : { type: ObjectId, required: true },
		id_location : { type: ObjectId, required: true },
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Course = dbconnect.model('Course', courseSchema);
	
	Course.schema.path('reserved_portions').validate(function (value) {
		return value <= this.max_portions;
	}, 'Max portions reached');

	return Course;

}

