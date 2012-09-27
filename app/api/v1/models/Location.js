module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var locationSchema = new Schema({
		type: { type: String, default: "metro_station", required: true},
		id_metro_station : { type: ObjectId },
		id_delivery_address : { type: ObjectId },
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Location = dbconnect.model('Location', locationSchema);
	
	Location.schema.pre('save', function(next) {
	
		if(this.id_metro_station || this.id_delivery_address) {
			next();
		} else {
			next( new Error('Missing parameter') );
		}
	
	});

	return Location;

}

