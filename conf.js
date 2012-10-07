module.exports = {

	app : {
		host : "local.host",
		port : "3000",
		auth_check : require('crypto').createHash('sha512').update("lamarck-caulincourt").digest('hex')
	},
	twitter : {
		consumerKey : "cEEX9ZxFerB7SeGPhx3Hcw",
		consumerSecret : "0sRjUGPdQQjcreGQvvk7KxmnaDTuSMb39E7QZod0TA"
	}

};
