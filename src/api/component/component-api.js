var paths = require('../paths-manager');
var formidable = require('formidable');
var component = require('./component');
var fs = require('fs');
var hljs = require('highlight.js');
var exec = require('child_process').exec;
var jsdom= require('jsdom');
var {JSDOM} = jsdom;

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

	hljs.registerLanguage('java', require("highlight.js/lib/languages/java"));
	
	app.post("/show", function(req, res) {
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			if (err)
				console.log(err);
			/*ADD THIS SNIPPET TO SHOW DOCS
			 * <embed src="file_name.pdf" width="800px" height="2100px" />
			 */
			
			var lineReader = require('readline').createInterface({
						input : require('fs').createReadStream(fields.contentPath)
			});
			lineReader.on('line', function (line) {
				res.write("<pre><code class='java'>"+hljs.highlightAuto(line).value+"</code></pre>", function(err){
					res.end();
				});
			});	
		});
		
	});

};

module.exports.runContent = function(app) {
	app.post("/initComponent", function(req, res) {
		var form = formidable.IncomingForm();
		form.parse(req, function(err, fields) {
			exec('java -jar ' + paths.externalToolsPATH + 'ClassInspector.jar -path ' + fields.projectPath + ' -sourcefile ' + fields.contentPath + ' -out ' + paths.projectsRepoPATH,
					function(error, stdout, stderr) {
						if (error) {
							console.log("-File not visited. ERROR during the inspection");
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
		});
	});
	
	app.get("/getJSON", function(req,res){
	     res.writeHead(200, {'Content-Type': 'application/json'});
		 res.end(fs.readFileSync(paths.projectsRepoPATH+"dump_class.json"));
	});

	
	app.get("/initComponent/run",function(req,res){
		var form= formidable.IncomingForm();
		form.parse(req, function(err,fields){
			var url;
			
			
		});
	
	});
};


