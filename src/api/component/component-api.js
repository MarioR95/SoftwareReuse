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
/* 			var lineReader = require('readline').createInterface({
						input : require('fs').createReadStream(fields.contentPath)
			});
			lineReader.on('line', function (line) {
				res.write("<pre class='language-java'><code>"+Prism.highlight(line, Prism.languages.java, 'java')+"</code></pre>", function(err){
					res.end();
				});
			});	 */
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
		}); 
		
});

};

module.exports.runContent = function(app) {

	var componentPath;

	app.post("/initComponent", function(req, res) {
		var form = formidable.IncomingForm();
		form.parse(req, function(err, fields) {
			projectPath= fields.projectPath;
			var tmp= fields.contentPath.split(".java")[0].split("src");
			componentPath= tmp[tmp.length-1].split("/").join("-").substr(1);
			console.log(componentPath);
			if (!fs.existsSync(paths.projectsRepoPATH+componentPath+".json")) {
				exec('java -jar ' + paths.externalToolsPATH + 'ClassInspector.jar -path ' + fields.projectPath + ' -sourcefile ' + fields.contentPath + ' -out ' + paths.projectsRepoPATH,
				function(error, stdout, stderr) {
					if (error) {
						console.log("-File not visited. ERROR during the inspection");
						console.log(error)
						fs.readFile(paths.rootPATH+'index.html',null,function(error,data) {
							if(error) {
							   res.writeHead(404);
							   res.write('-Page not found');
							}else {
								 res.end(data);
							}
						});
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
			}else{
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
	});
	
	app.get("/getJSON", function(req,res){
	     res.writeHead(200, {'Content-Type': 'application/json'});
		 res.end(fs.readFileSync(paths.projectsRepoPATH+componentPath+".json"));
	});

	
	app.get("/initComponent/run",function(req,res){
		console.log(req.query.ctype);
		console.log(req.query.mname);
		console.log(req.query.mtype);
		
		exec("java -jar "+paths.externalToolsPATH+"ClassExecutor.jar -binpath "+projectPath+"bin/ -sourcefile "+componentPath.replace("-",".")+" -cargtype "+req.query.ctype+" -mname "+req.query.mname+" -margtype "+req.query.mtype ,
		 function(err,stdout, stderr){
			if(err){
				console.log(err);
			}
			res.writeHead(200, {'Content-Type': 'plain/text'});

			if(stderr != undefined){
				res.end(stdout);
			}
			res.end(stdout);
		 }); 
	});
};


