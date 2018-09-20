var solrServerURL;
var serverLocalIP;
var content = getUrlParameter('content');
var name = getUrlParameter('name');
var version = getUrlParameter('version');
var author = getUrlParameter('author');
var domain = getUrlParameter('domain');
var technology = getUrlParameter('technology');

	$(document).ready(function(){	

		$.get('/getLocalIP', function(data){
			serverLocalIP = data;
			solrServerURL = "http://"+serverLocalIP+":8983/solr/componentscore/select?q=";

			//Query only on component's content
			if(content!=undefined){
				content=content.replace(/[+]/gm, ",");


				console.log(solrServerURL+"content:"+content);
				$.get(solrServerURL+"content:"+content+"&rows=100000", 
					function(data){
						var numFound = data.response.numFound;
						if(numFound > 0){
							var components = data.response.docs;
							for (i=0; i < components.length; i++){							
								generateTableEntry(components[i], i+1);
							}
						}
					}
				);	
			}	
			else{
				//Query based on parameters values passed in URL
				executeQuery();
			}
		
			}
		);	
	});

				
	

	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};	

	


	function executeQuery(){

		if(name != undefined && name!=""){
			singleParamQuery('name');
		}
		else if(version!=undefined && version!=""){
			singleParamQuery('version');
		}
		else if(author!=undefined && author!=""){
			singleParamQuery('author');
		}
		else if(domain!=undefined && domain!=""){
			singleParamQuery('domain');
		}
		else if(technology!=undefined && technology!=""){
			singleParamQuery('technology');
		}
	
	}


	function singleParamQuery(param){
		var paramName;
		var paramValue;


		switch(param){
			case 'name': paramName='name'; paramValue=name;break;
			case 'version': paramName='version';paramValue=version;break;
			case 'author': paramName='author';paramValue=author;break;
			case 'domain': paramName='domain';paramValue=domain;break;
			case 'technology': paramName='technology';paramValue=technology;break;
		}

		paramValue=paramValue.replace(/[+]/gm, ",");

		console.log(solrServerURL+paramName+":"+paramValue);

		$.get(solrServerURL+paramName+":"+paramValue+"&rows=100000", 
		
			function(data){
				var numFound = data.response.numFound;

				if(numFound > 0){
					var components = data.response.docs;

					for (i=0; i < components.length; i++){							
						generateTableEntry(components[i], i+1);
					}
				}
			}
		);		
	}


	function generateTableEntry(component, position){
		var componentPathParts = component.path.split('/');
		var componentName = componentPathParts[componentPathParts.length-1];


		var tr = document.createElement("tr"); 
		var tdCount = document.createElement("td");
		var tdProjectName = document.createElement("td");
		var tdComponentName = document.createElement("td");
		var tdComponentType = document.createElement("td");
		var tdDescripton = document.createElement("td");
		var tdRunView = document.createElement("td");



		tdCount.innerHTML = position;
		tdProjectName.innerHTML = component.name; // This is the project name
		tdComponentName.innerHTML = componentName;
		tdComponentType.innerHTML = component.type;
		tdDescripton.innerHTML = component.description;
		
		tdRunView.appendChild(createViewForm(component.path, component.type));
		
		if(component.type!='document')
			tdRunView.appendChild(createRunForm(component.path, component.name, component.type));

		tr.appendChild(tdCount);
		tr.appendChild(tdProjectName);
		tr.appendChild(tdComponentName);
		tr.appendChild(tdComponentType);
		tr.appendChild(tdDescripton);
		tr.appendChild(tdRunView);
		$("#results-table").append(tr);
	}


	function extractProjectPath(componentPath, projectName) {
	
		var projectPath= componentPath.split("/src/");		
		if(projectPath.length == 3)	
			return projectPath[0]+"/src/"+projectPath[1]+"/";		
		else
			return projectPath[0]+"/";
	}


	function createViewForm(componentPath, componentType){



		/*
		<form action="show" method="post" enctype="multipart/form-data">
			<input type="hidden"
				value="/home/mario/Desktop/eclipse-workspace/SoftwareReuse/repository/JavaExample/src/punto_01/Moneta.java"
				name="contentPath" hidden> 
			<input type="submit"
				value="VIEW" class="btn btn-success" style="padding: 2% 4%;margin: 1%;">
		</form>
		*/

		
		var form;

		if(componentType == 'document'){
			var repoComponentPath='repository'+componentPath.split('repository')[1];


			form = document.createElement('a');
			form.setAttribute('href',repoComponentPath);

			var inputSubmit = document.createElement("input");
			inputSubmit.setAttribute('type','submit');
			inputSubmit.setAttribute('value','VIEW');
			inputSubmit.setAttribute('class','btn btn-success');
			inputSubmit.setAttribute('style','padding: 2% 4%;margin: 1%;');
			
			
			form.appendChild(inputSubmit);

		}
		else{
			form = document.createElement("form");
			form.setAttribute('action','show');
			form.setAttribute('method','post');
			form.setAttribute('enctype','multipart/form-data');
			
			var inputPath = document.createElement("input");
			inputPath.setAttribute('type','hidden');
			inputPath.setAttribute('value', componentPath);
			inputPath.setAttribute('name','contentPath');

			var inputSubmit = document.createElement("input");
			inputSubmit.setAttribute('type','submit');
			inputSubmit.setAttribute('value','VIEW');
			inputSubmit.setAttribute('class','btn btn-success');
			inputSubmit.setAttribute('style','padding: 2% 4%;margin: 1%;');

			form.appendChild(inputSubmit);
			form.appendChild(inputPath);
		}



		return form;

	}

	function createRunForm(componentPath, projectName, componentType){
		/*<form action="initComponent" method="post" enctype="multipart/form-data">
			<input type="hidden"
				value="/home/mario/Desktop/eclipse-workspace/SoftwareReuse/repository/JavaExample/src/punto_01/Moneta.java"
				name="contentPath" hidden> 
			<input type="hidden"
				value="/home/mario/Desktop/eclipse-workspace/SoftwareReuse/repository/JavaExample"
				name="projectPath" hidden> 
			<input type="submit"
				value="RUN" class="btn btn-success" style="padding: 2% 4%; margin:1%;">
		</form>
		*/

		var form = document.createElement("form");
		form.setAttribute('action','initComponent');
		form.setAttribute('method','post');
		form.setAttribute('enctype','multipart/form-data');


		var inputComponentType= document.createElement("input");
		inputComponentType.setAttribute('type','hidden');
		inputComponentType.setAttribute('value', componentType);
		inputComponentType.setAttribute('name','type');
		
		var inputComponentPath = document.createElement("input");
		inputComponentPath.setAttribute('type','hidden');
		inputComponentPath.setAttribute('value', componentPath);
		inputComponentPath.setAttribute('name','contentPath');

		var inputProjectPath = document.createElement("input");
		inputProjectPath.setAttribute('type','hidden');
		inputProjectPath.setAttribute('value', extractProjectPath(componentPath, projectName));
		inputProjectPath.setAttribute('name','projectPath');

		var inputSubmit = document.createElement("input");
		inputSubmit.setAttribute('type','submit');
		inputSubmit.setAttribute('value','RUN');
		inputSubmit.setAttribute('class','btn btn-success');
		inputSubmit.setAttribute('style','padding: 2% 4%;margin: 1%;');
		
		form.appendChild(inputComponentType);
		form.appendChild(inputComponentPath);
		form.appendChild(inputProjectPath);
		form.appendChild(inputSubmit);

		return form;

	}
