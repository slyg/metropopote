module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var courseSchema = new Schema({
		date: { type: Date, required: true },
		date_range: { type: Number, default: 0.50 },
		comment : { type: String },
		max_portions : { type: Number, required: true },
		reserved_portions : { type: Number, default: 0 },
		recipe : { type: ObjectId, required: true },
		location : { type: ObjectId, required: true },
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Course = dbconnect.model('Course', courseSchema);
	
	Course.schema.path('reserved_portions').validate(function (value) {
		return value <= this.max_portions;
	}, 'Max portions reached');

	return Course;

}

