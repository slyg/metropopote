// testing api interface consistency

var should = require('should'),
	http = require('http'),
	port = '3000',
	host = 'http://localhost',
	root = host + ':' + port;
	
var getOptions = function(){
	return {
		port: '3000',
		path: '/api/v1/members'
	};
};

var getTestData = function(){
	return {
		name : "Jean",
		username : "Jeannot38",
		email : "jean@coucou.fr",
		password : "parano"
	};
};


describe('api', function(){
	
	describe('POST /api/v1/members', function(){
		
		var data, response;
		var testData = getTestData();
		
		var dataString = JSON.stringify(testData);
		
		var headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
		
		var opt = getOptions();
		opt.method = 'POST';
		opt.headers = headers;
		
		
		before(function(done){
		
			http.request(opt, function (res){
			
				var buffer = '';
				
				res
					.on('data', function (chunk){ buffer += chunk; })
					.on('end', function(){
						response = res;
						data = (buffer != '') ? JSON.parse(buffer) : undefined;
						testData['_id'] = data['_id'];
						done();
					})
				;
				
			}).end(dataString);
						
		});
		
		it('should be successfull', function(done){
			response.should.have.status(201);
			done();
		});
		
		it('should respond with an object', function(done){
			data.should.be.an.instanceof(Object);
			done();
		});
		
		it('should respond with an object containing proper properties', function(done){
			data.should.have.property('name', testData.name);
			data.should.have.property('_id');
			done();
		});
		
	});
	
	describe('GET /api/v1/members', function(){
	
		var data, response;
		
		var opt = getOptions();
	
		before(function(done){
			
			http.request(opt, function (res){
			
				var buffer = '';
				
				res
					.on('data', function (chunk){
						buffer += chunk;
					})
					.on('end', function(){
						response = res;
						data = (buffer != '') ? JSON.parse(buffer) : undefined;
						done();
					})
				;
				
			}).end();
					
		});
		
		it('should be successfull', function(done){
			response.should.have.status(200);
			done();
		});
		
		it('should respond with an array', function(done){
			data.data.should.be.an.instanceOf(Array);
			done();
		});
		
		it('should respond with total count of items', function(done){
			data.should.have.property('count');
			parseInt(data.count).should.be.above(-1);
			done();
		});
		
		it('should respond with an array containing no more than 10 items by default', function(done){
			data.data.length.should.be.within(0, 10);
			done();
		});
		
	});

	
	describe('PUT /api/v1/members', function(){
		
		var data, response;
		
		var testData = getTestData();
		testData.nuserame = "Jojo";
		
		var dataString = JSON.stringify(testData);
		
		var headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
		
		
		before(function(done){
		
			http.request(getOptions(), function (res){
		
				var buffer = '';
				
				res
					.on('data', function (chunk){ buffer += chunk; })
					.on('end', function(){
						
						var opt = getOptions();
						opt.method = 'PUT';
						opt.headers = headers;
						opt.path = opt.path + '/' + JSON.parse(buffer).data[0]._id;
						
						http.request(opt, function (res){
			
							var buffer = '';
							
							res
								.on('data', function (chunk){ buffer += chunk; })
								.on('end', function(){
									response = res;
									data = (buffer != '') ? JSON.parse(buffer) : undefined;
									done();
								})
							;
							
						}).end(dataString);
						
					})
				;
				
			}).end();
										
		});
		
		it('should be successfull', function(done){
			response.should.have.status(200);
			done();
		});
		
		it('should respond with an object', function(done){
			data.should.be.an.instanceof(Object);
			done();
		});
		
		it('should respond with an object containing proper properties', function(done){
			data.should.have.property('username', testData.username);
			data.should.have.property('_id', testData._id);
			done();
		});
	
	});

	describe('DELETE /api/v1/members', function(){
		
		var data, dataText, response;
		
		before(function(done){
		
			http.request(getOptions(), function (res){
		
				var buffer = '';
				
				res
					.on('data', function (chunk){ buffer += chunk; })
					.on('end', function(){
						
						var opt = getOptions();
						opt.method = 'DELETE';
						opt.path = opt.path + '/' + JSON.parse(buffer).data[0]._id;
						
						http.request(opt, function (res){
			
							var buffer = '';
							
							res
								.on('data', function (chunk){ buffer += chunk; })
								.on('end', function(){
									response = res;
									dataText = buffer;
									done();
								})
							;
							
						}).end();
						
					})
				;
				
			}).end();
										
		});
		
		it('should be successfull', function(done){
			response.should.have.status(200);
			done();
		});
		
		it('should respond a confirmation text in body', function(done){
			dataText.should.eql('Deletion complete');
			done();
		});
	
	});

});
