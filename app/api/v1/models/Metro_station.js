module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var metro_stationSchema = new Schema({
		name: { type: String, required: true},
		ids_metro_line: [{ type: ObjectId }],
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Metro_station = dbconnect.model('Metro_station', metro_stationSchema);

	return Metro_station;

}

