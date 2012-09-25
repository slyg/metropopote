

	(function(){
	
		/* logger and forms submits */
	    		
		var logger = $('#logger');
	
		$('form').submit(function(e) {
		
			// don't do the stuff you usually do bro
			e.preventDefault();
			
			var form = $(this),
				params = $.parseJSON(JSON.stringify(form.serializeObject())),
				logId = Date.now();
				
			// cooking default xhr parameters
			
			var xhr = {
				type : params['_method'] || form.attr('method'),
				success	: function(res, status, jqXHR){
					var data;
					if (typeof res == "object") {
						data = ("data" in res) ? res.data : res;
					} else {
						data = res;
					}
					form[0].reset();
					logger.prepend(
						logWrap(
							jqXHR.status + ' : ' + ( (typeof res == 'object') ? indentStringified(JSON.stringify(data)) : data ),
							logId
						)
					).scrollTop(0);
					$('#log'+logId).slideDown(100);
				},
				error : function(res, status, jqXHR){
					logger.prepend(
						logWrap(res.status + ' : ' + res.responseText, logId)
					).scrollTop(0);
					$('#log'+logId).slideDown(100);
				},
				url : form.attr('action')
			};
			
			// isolate implementation attributes from usefull parameters
			// will return object without id and method attributes or undefined if no other parameter
			
			var filteredParameters = (function(){
				var obj = undefined;
				$.each(params, function(key){
					if(params[key]) {
						if(!(key == 'id' || key == '_method')) {
							if(obj == undefined) obj = {};
							obj[key] = params[key];
						}
					}
				});
				return obj;
			}());
			
			
			// request parameters when GET, and DELETE :
			//	- when id exists add id parameter
			// 	- when other parameters, added to uri
			
			if(xhr.type == 'get' || xhr.type == 'delete') {
				if(params.id) {
					if(params.id) xhr.url += '/' + params.id
				} else {
					if(filteredParameters) xhr.url += '?' + $.param(filteredParameters)
				}
			}
			
			// request parameters when POST :
			
			if(xhr.type == 'post') xhr.data = filteredParameters;
			
			// request parameters when PUT :
			
			if(xhr.type == 'put') {
				if(filteredParameters) xhr.data = filteredParameters;
				if(params.id) xhr.url += '/' + params.id
			}
			
			// proceed ajax call and cross fingers
			
			$.ajax(xhr);
			
		});
		
		$('#clearlog').click(function(e){
			e.preventDefault();
			logger.empty();
		});
		
	
		// Utils
		
		var logWrap = function(logContent, logId){
			return '<pre id="log'+ logId +'">' + logContent + '</pre>';
		}
		
		var indentStringified = function(zz){
			zr = zz
				.replace(/{\"/g, "{\n\t\"")
				.replace(/\},/g, "\n},")
				.replace(/,\"/g, ",\n\t\"")
				.replace(/}\]/g, "\n}\]")
				.replace(/},{/g, "},\n{")
				.replace(/\"}*$/, "\"\n}")
				.replace(/0}*$/, "0\n}");
			return zr;
		}
	
		$.fn.serializeObject = function(){
		    var o = {};
		    var a = this.serializeArray();
		    $.each(a, function() {
		        if (o[this.name] !== undefined) {
		            if (!o[this.name].push) {
		                o[this.name] = [o[this.name]];
		            }
		            o[this.name].push(this.value || '');
		        } else {
		            o[this.name] = this.value || '';
		        }
		    });
		    return o;
		};
		
		
		/* Tabs */
		
		$('.nav li').click(function(e){
			$(e.delegateTarget).addClass('active').siblings().removeClass('active');
		});
		
	
	}());