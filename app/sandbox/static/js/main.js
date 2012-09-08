

	(function(){
	    		
		var logger = $('#logger');
	
		$('form').submit(function(e) {
		
			// don't do the stuff you usually do bro
			e.preventDefault();
			
			var form = $(this),
				params = $.parseJSON(JSON.stringify(form.serializeObject())),
				logId = Date.now();
				
			// cooking xhr parameters
			
			var xhr = {
				type : params['_method'] || form.attr('method'),
				success	: function(res){
					form[0].reset();
					logger.prepend(
						logWrap(
							'200 : ' + ( (typeof res == 'object') ? indentStringified(JSON.stringify(res)) : res ),
							logId
						)
					).scrollTop(0);
					$('#log'+logId).slideDown(100);
				},
				error : function(res){
					logger.prepend(
						logWrap(res.status + ' : ' + res.responseText, logId)
					).scrollTop(0);
					$('#log'+logId).slideDown(100);
				}
			};
			xhr.url = form.attr('action');
			if(!(xhr.type == 'post' || form.attr('id') == "retrieve-all")) xhr.url += '/' + params['id'];
			if(xhr.type == 'post' || xhr.type == 'put') xhr.data = params;
			
			// proceed ajax call
			
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
			zz = zz
				.replace(/{\"/g, "{\n\t\"")
				.replace(/\},/g, "\n},")
				.replace(/,\"/g, ",\n\t\"")
				.replace(/}\]/g, "\n}\]")
				.replace(/},{/g, "},\n{")
				.replace(/}*$/, "\n}");
			return zz;
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
	
	}());