//module that manages local paths
var paths= require('./api/paths-manager');
//for handle file system
var fs = require('fs');
var express = require('express');
var app= express();
var exec = require('child_process').exec, child;
var componentAPI = require('./api/component/component-api');
var server;

//to handle static file from public directory
app.use(express.static("../public"));

server = app.listen(8080, function(){
  console.log("SERVER STARTED");
  //start solr server
  child = exec('../solr-7.4.0/bin/solr start',
    function (error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error){
          console.log("SERVER NOT STARTED")
        }
    });
    console.log("SOLR STARTED");
});

app.get("/", function(req,res) {
  loadPage(res,'../index.html');
});

app.get("/insert",function(req, res){
	 loadPage(res,'../public/view/insert.html')
});


app.get("/results", function(req,res){
	//componentAPI.search();
	loadPage(res, '../public/view/search-result.html');
});

componentAPI.upload(app);
componentAPI.showContent(app);
componentAPI.runContent(app);

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

