module.exports = function(dbconnect){

	var Schema = require('mongoose').Schema,
    	ObjectId = Schema.ObjectId;

	var reservationSchema = new Schema({
		coupon: { type: String, required: true},
		portions: { type: Number, min: 1, max: 50, required: true },
		owner : { type: ObjectId, required: true},
		course : { type: ObjectId, required: true},
	    updated : { type: Date, default: Date.now },
	    created : { type: Date, default: Date.now }
	});

	var Reservation = dbconnect.model('Reservation', reservationSchema);
	
	Reservation.schema.path('portions').validate(function (value) {
		return value % 1 === 0;
	}, 'Invalid portions number (Integer only)');

	return Reservation;

}

