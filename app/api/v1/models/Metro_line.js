module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var metro_lineSchema = new Schema({
		name: { type: String, required: true},
		ids_metro_station: [{ type: ObjectId }],
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Metro_line = dbconnect.model('Metro_line', metro_lineSchema);

	return Metro_line;

}

