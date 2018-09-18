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
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server app listening at http://%s:%s", host, port);
  createFolders();
  startServer('../solr-7.4.0/bin/solr start');
  startServer('../apache-jena-fuseki-3.8.0/fuseki start');

  //Stop Solr and Fuseki server after ctrl+c terminal command
  process.on('SIGINT', stopSolrandFuseki);

});

//INIT SERVER
app.get("/", function(req, res) {
        loadPage(res,'../index.html');    
      } 
);

//UPLOAD COMPONENT
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


function startServer(startingCmd){
  exec(startingCmd,
    function (error, stdout, stderr){
        if(error)
          console.error(error);
        else
          console.log(stdout);    
    });
}

function stopSolrandFuseki(){
  console.log("Stopping solr server...");
  exec("../solr-7.4.0/bin/solr stop -all", (err) => {
      if(err){
          console.error(err);
          return;
      }
      else{
          console.log('Solr server stopped successfully');
          process.exit();
      }
  });

  console.log("Stopping fuseki server...");
    exec("../apache-jena-fuseki-3.8.0/fuseki stop", (err) => {
      if(err){
          console.error(err);
          return;
      }
      else{
          console.log('Fuseki server stopped successfully');
      }
  });
}


function createFolders(){
  
  if(!fs.existsSync(paths.rootPATH+"/ont_repository")){
      fs.mkdirSync(paths.rootPATH+"/ont_repository", function(err){
        if(err)
          console.log(err);
      });
  }

  if(!fs.existsSync(paths.rootPATH+"/repository")){
    fs.mkdirSync(paths.rootPATH+"/repository", function(err){
      if(err)
        console.log(err);
    });
  }

  if(!fs.existsSync(paths.rootPATH+"/components_json")){
    fs.mkdirSync(paths.rootPATH+"/components_json", function(err){
      if(err)
        console.log(err);
    });
  }


}

