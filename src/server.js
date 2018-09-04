//module that manages local paths
var paths= require('./api/paths-manager');
//for handle file system
var fs = require('fs');
var express = require('express');
var app= express();
//
var componentAPI = require('./api/component/component-api');


//to handle static file from public directory
app.use(express.static("../public"));

app.listen(8080, function(){
	console.log("SERVER STARTED");
});

app.get("/", function(req,res) {
	loadPage(res,'../index.html');
});

app.get("/insert",function(req, res){
	 loadPage(res,'../public/view/insert.html')
});


componentAPI.upload(app);


function loadPage(response,url) {
   //HTML PAGE
   console.log("-Page loaded successfully"); 
   response.writeHead(200,{'Content-type': 'text/html'});
   fs.readFile(url,null,function(error,data) {
     if(error) {
      response.writeHead(404);
      response.write('-Page not found');
     }else {
      response.end(data);
     }
   });
}

