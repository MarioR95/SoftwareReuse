var paths = require('../paths-manager');
var formidable = require('formidable');
var component = require('./component');
var fs = require('fs');
var Prism = require('prismjs');
var loadLanguages = require('prismjs/components/');
loadLanguages(['java']);
var exec = require('child_process').exec;

var projectPath;


module.exports.upload = function(app) {
	app.post("/upload", function(req, res) {
		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {
			if (err) {
				console.log(err);
			}
			component.loadComponent(res, fields, files);
		});
	});
};

//SHOW CONTENT  
module.exports.showContent = function(app) {

	app.post("/show", function(req, res) {

		var form = new formidable.IncomingForm();
		
		form.parse(req, function(err, fields, files) {
			if (err)
				console.log(err);
			/*ADD THIS SNIPPET TO SHOW DOCS
			 * <embed src="file_name.pdf" width="800px" height="2100px" />
			 */
			res.write("<html !DOCTYPE>"+
					"<head>"+
						"<link href='css/java-style.css' rel='stylesheet'>"+
						"<script type='text/javascript' src='js/javacode-handler.js'></script>"+
					"</head>"+
					"<body >"
		
			);
			if(fields.type=="file"){
					res.write("<embed src='"+fields.componentPath+"'/>", function(err){
						res.end();
					});
			}else{
				fs.readFile(fields.contentPath, {encoding: 'utf-8'}, function(error,data) {
					if(error) {
					   res.writeHead(404);
					   res.write('-Component Not Loaded.');
					}else {
						res.write("<pre class='language-java'><code>"+Prism.highlight(data, Prism.languages.java, 'java')+"</code></pre>", function(err){
							res.end();
						});
					}
				});	
			}
					
		}); 
		
});

};

module.exports.runContent = function(app) {

	var componentPath;	

	//HANDLE SOURCE CODE FILE
	app.post("/initComponent", function(req, res) {
		var form = formidable.IncomingForm();
		form.parse(req, function(err, fields) {
			projectPath= fields.projectPath;
			var tmp= fields.contentPath.split(".java")[0].split("src");
			componentPath= tmp[tmp.length-1].split("/").join("-").substr(1);
			var component_type= fields.type;
			if(component_type == "sourceCode"){
				exec('java -jar ' + paths.externalToolsPATH + 'ClassInspector.jar -path ' + fields.projectPath + ' -sourcefile ' + fields.contentPath + ' -out ' + paths.projectsRepoPATH,
				function(error, stdout, stderr) {
					if (error) {
						console.log("-File not visited. ERROR during the inspection");
						console.log(error);
					} else {
						console.log("-File visited correctly");
						fs.readFile(paths.rootPATH+'public/view/run.html',null,function(error,data) {
							if(error) {
							   	res.writeHead(404);
							  	res.write('-Page not found');
							}else {
								res.end(data);
							}
						});
					}
				});
			}
			else if(component_type == "test"){
				exec("java -cp .:"+paths.externalToolsPATH+"junit-4.10.jar:"+projectPath+"bin/ org.junit.runner.JUnitCore "+componentPath.replace("-","."), 
				function(error,stdout,stderr){
					if(error){
						console.log("-File not tested. ERROR during the execution");
						console.log(error);
					}else{
						console.log("-File tested correctly");
						fs.readFile(paths.rootPATH+'public/view/search.html',null,function(error,data) {
							if(error) {
								res.writeHead(404);
								res.write('-Page not found');
							}else {
								res.write(stdout,function(err){
									res.end(err);
								});
							}
						});
						
					}
				
				})
			}

		});
	});
	
	//READ JSON FILE FROM FILE SYSTEM 
	app.get("/getJSON", function(req,res){
	     res.writeHead(200, {'Content-Type': 'application/json'});
		 res.end(fs.readFileSync(paths.projectsRepoPATH+componentPath+".json"));
		 fs.unlink(paths.projectsRepoPATH+componentPath+".json", function(err){
			 if(err){
				 console.log(err);
			 }
		 });
	});

	//RUN THE SOURCE FILE COMPONENT
	app.get("/initComponent/run",function(req,res){
		exec("java -jar "+paths.externalToolsPATH+"ClassExecutor.jar -binpath "+projectPath+"bin/ -sourcefile "+componentPath.replace("-",".")+" -cargtype "+req.query.ctype+" -mname "+req.query.mname+" -margtype "+req.query.mtype ,
		function(err,stdout, stderr){
			if(err){
				console.log(err);
			}
			res.writeHead(200, {'Content-Type': 'plain/text'});
			res.end(stdout);
		}); 
	});


	//HANDLE TEST FILE
	app.post("/initTestComponent", function(req,res){
		var form = formidable.IncomingForm();
		form.parse(req, function(err, fields) {
			projectPath= fields.projectPath;
			var tmp= fields.contentPath.split(".java")[0].split("src");
			componentPath= tmp[tmp.length-1].split("/").join("-").substr(1);
			
		});
	})
};


