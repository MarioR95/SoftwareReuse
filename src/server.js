var paths= require('./api/paths-manager');
var fs = require('fs');
var express = require('express');
var app= express();
var exec = require('child_process').exec, child;
var componentAPI = require('./api/component/component-api');
var server;

//To handle static file from public directory
app.use(express.static("../public"));

server = app.listen(8080, function(){
  console.log("WEB SERVER STARTED");
  //start solr server
  child = exec('../solr-7.4.0/bin/solr start',
    function (error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error){
          console.log("SOLR SERVER NOT STARTED")
        }
    });
    console.log("SOLR SERVER STARTED");
});

//INIT SERVER
app.get("/", function(req,res) {
	loadPage(res,'../index.html');
});

componentAPI.upload(app);
//INSERT MODULE
app.get("/insert",function(req, res){
	 loadPage(res,'../public/view/insert.html')
});

//SEARCH AND RUN MODULE
app.get("/results", function(req,res){
	componentAPI.showContent(app);
	componentAPI.runContent(app);
	loadPage(res, '../public/view/search.html');	
});




/*
 * Function that load a page from url. 
 * @PARAM: url: the full path that identify the html file into file system 
 * @RETURN: html page loaded successfully or a 404 page.*/
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

