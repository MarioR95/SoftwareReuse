$(document).ready(function(){

	var url,c_url, m_url;

	$.getJSON( '/getJSON', function( data ) {

		var i=0;
		//RETRIEVE ALL CONSTRUCTORS
		recursiveGetProp(data, 'constructor', function(obj) {		
			recursiveGetProp(obj, 'name', function(obj) {
				$('#constructors').append(
						"<div class='funkyradio-default'>" +
						"	<input type='radio' name='constructor' class='constructor-info' id='constructor"+i+"' value='"+i+"'/>"+
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
						"<span id='ctype"+c_index+att_index+"'>"+data.constructor[""+c_index]['attribute-type'][att_index]+"</span>"+
						"<input class='cvalue"+c_index+"' type='text' name='c"+c_index+att_index+"' style='width:10%; padding:0 1%; margin:1%' placeholder='value...'/>"
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
						"	<input type='radio' name='method' class='method-info' id='method"+j+"' value='"+obj+"'/>"+
						"	<label for='method"+j+"'>" +
						"   	<span class='method-name'id='m"+j+"'>"+obj+"(</span>" +
						 		
						"	</label>" +
						"</div>" 
				);
				
				j++;
			});
		
			for(m_index in data['method']){
				for(att_index in data.method[""+m_index]['attribute-type']){
					$('#m'+m_index).append(
						"<span id='mtype"+m_index+att_index+"'>"+data.method[""+m_index]['attribute-type'][att_index]+"</span>"+
						"<input class='mvalue"+m_index+"' type='text' name= 'm"+m_index+att_index+"' style='width:10%; padding:0 1%; margin:1%' placeholder='value...'/>"
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
	
	$(document).on('change', 'input:radio[name="constructor"]', function() {
		c_url="ctype=[";
		var index= $(this).val();
		$(document).on('change', 'input:text[class=cvalue'+index+']', function(){
			var name= $(this).attr('name');
			var id = name.slice(1,name.length);
			c_url= c_url.concat($("#ctype"+id).text()+"_"+$(this).val()+",")	
		});
		
	});

	
	$(document).on('change', 'input:radio[name="method"]', function() {
		url=c_url;
		var name= $(this).val();
		m_url= "]&mname="+name+"&mtype=[";
		var id= $(this).attr("id");
		var index= id.substr(id.length-1);	
		$(document).on('change', 'input:text[class=mvalue'+index+']', function(){
			var name= $(this).attr('name');
			var id = name.slice(1,name.length);
			m_url= m_url.concat($("#mtype"+id).text()+"_"+$(this).val()+",")		
		});		
	});


	$("#run-btn").click(function(){
		url= url.concat(m_url+"]");
		console.log(url);
		$.get("initComponent/run?"+url, function(data){
			alert(data);
		});
	});

});