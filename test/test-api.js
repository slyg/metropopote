// testing api interface consistency

var should = require('should'),
	http = require('http'),
	port = '3000',
	host = 'http://localhost',
	root = host + ':' + port;
	
	var options = function(){
		return {
			port: '3000',
			path: '/api/v1/members'
		};
	};


describe('api', function(){

	describe('GET /api/v1/members', function(){
	
		var data, response;
		
		var opt = options();
	
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
			data.should.be.an.instanceOf(Array);
			done();
		});
		
		it('should respond with an array containing no more than 10 items', function(done){
			data.length.should.be.within(0, 10);
			done();
		});
		
	});
	
	describe('POST /api/v1/members', function(){
		
		var data, response;
		
		var data = {
			name: 'Jean'
		};
		
		var dataString = JSON.stringify(data);
		
		var headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
		
		var opt = options();
		opt.method = 'POST';
		opt.headers = headers;
		
		
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
				
			}).end(dataString);
						
		});
		
		it('should be successfull', function(done){
			response.should.have.status(200);
			done();
		});
		
	});
	
});
