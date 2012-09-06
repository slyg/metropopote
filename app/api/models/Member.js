var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
    name: String
});

module.exports = function(app){
	return app.dbconnect.model('Member', memberSchema);
}

