//module that manages local paths
var paths= require('./api/paths-manager');
//for handle file system
var fs = require('fs');
var express = require('express');
var app= express();

//to handle static file from src directory
app.use(express.static("../public"));

app.listen(8080, function(){
	console.log("SERVER STARTED");
});

app.get("/", function(req,res) {
	initPage(res);
});

var componentAPI = require('./api/component/component-api');
componentAPI.upload(app);

function initPage(response) {
   //HTML PAGE
   console.log("-Index loaded successfully"); 
   response.writeHead(200,{'Content-type': 'text/html'});
   fs.readFile('../public/view/insert.html',null,function(error,data) {
     if(error) {
      response.writeHead(404);
      response.write('-Page not found');
     }else {
      response.end(data);
     }
   });
}

