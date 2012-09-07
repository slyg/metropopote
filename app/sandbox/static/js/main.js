

	(function(){
	    		
		var logger = $('#logger');
	
		$('form').submit(function(e) {
		
			// don't do the stuff you usually do bro
			e.preventDefault();
			
			var form = $(this),
				params = $.parseJSON(JSON.stringify(form.serializeObject()));
				
			// cooking xhr parameters
			
			var xhr = {
				type : params['_method'] || form.attr('method'),
				success	: function(res){
					form[0].reset();
					logger.prepend((typeof res == 'object') ? $.fn.logObj(res) : res + '\n\n');
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
		
		$.fn.logObj = function(zz){
			var log = '{\n';
			$.param(zz).split('&').forEach(function(param){
			    var params = param.split('=')
			    log += '\t' + params[0] + ' : ' + params[1] + '\n';
			});
			log += '}\n\n';
			return log;
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