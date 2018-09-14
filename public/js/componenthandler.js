$(document).ready(function(){
	$.getJSON( '/getJSON', function( data ) {
		console.log(data);
		console.log(data['constructor']);
		console.log(data.constructor['1']['attribute-type']);
	
		var i=0;
		//RETRIEVE ALL CONSTRUCTORS
		recursiveGetProp(data, 'constructor', function(obj) {		
			recursiveGetProp(obj, 'name', function(obj) {
				$('#constructors').append(
						"<div class='funkyradio-default'>" +
						"	<input type='radio' name='constructor' class='component-info' id='constructor"+i+"'/>"+
						"	<label for='constructor"+i+"'>" +
						"   	<span class='constructor-name'id='c"+i+"'>"+obj+"( </span>" +
						 
						"	</label>" +
						"</div>" 
				);
				
				i++;
			});
		
			for(c_index in data['constructor']){
				for(att_index in data.constructor[""+c_index]['attribute-type']){
					$('#c'+c_index).append(
						"<span id='ctype"+att_index+"'>"+data.constructor[""+c_index]['attribute-type'][att_index]+"</span>"+
						"<input type='text' style='width:10%; padding:0 1%; margin:1%' placeholder='value...'/>"
					);	
				}
				$("#c"+c_index).append("<span> )</span>");
			}
			
		});

		
		
		var j=0;
		//RETRIEVE ALL METHODS
		recursiveGetProp(data, 'method', function(obj) {
			recursiveGetProp(obj, 'name', function(obj) {
				$('#methods').append(
						"<div class='funkyradio-default'>" +
						"	<input type='radio' name='method' class='component-info' id='method"+j+"'/>"+
						"	<label for='method"+j+"'>" +
						"   	<span class='method-name'id='m"+j+"'>"+obj+"( </span>" +
						 
						"	</label>" +
						"</div>" 
				);
				
				j++;
			});
		
			for(m_index in data['method']){
				for(att_index in data.method[""+m_index]['attribute-type']){
					$('#m'+m_index).append(
						"<span id='mtype"+att_index+"'>"+data.method[""+m_index]['attribute-type'][att_index]+"</span>"+
						"<input type='text' style='width:10%; padding:0 1%; margin:1%' placeholder='value...'/>"
					);	
				}
				$("#m"+m_index).append("<span> )</span>");
			}
			
		});
		
		
		
	});
	
	
	
	
	function recursiveGetProp(obj, lookup, callback) {
	    for (property in obj) {
	        if (property == lookup) {
	            callback(obj[property]);
	        } else if (obj[property] instanceof Object) {
	            recursiveGetProp(obj[property], lookup, callback);
	        }
	    }
	}

	
	

});