var paths = require('../paths-manager');
var formidable = require('formidable');
var component = require('./component');
var fs = require('fs');
var hljs = require('highlight.js');

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
						input : require('fs').createReadStream(fields.content)
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
	app.get("/run", function(req, res) {
		var form = formidable.icomingForm();
		form.parse(req, function(fields, files) {

		});
	});
};


