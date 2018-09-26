var paths= require('./api/paths-manager');
var fs = require('fs');
var express = require('express');
var app= express();
var exec = require('child_process').exec, child;
var componentAPI = require('./api/component/component-api');
const internalIp = require('internal-ip');
var url = require('url');
var GSON= require('gson');


var server;
var serverLocalIP;
var fusekiResult; //This variable contains Fuseki query response for ontology


//To handle static file from public directory
app.use(express.static("../public"));
app.use(express.static("../"));


server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server app listening at http://%s:%s", host, port);
  createFolders();
  startServer('../solr-7.4.0/bin/solr start');
  startServer('../apache-jena-fuseki-3.8.0/fuseki start');

 
  internalIp.v4().then(ip => {
      console.log("Server local IP address:"+ip);
      serverLocalIP=ip;
  });

  //Stop Solr and Fuseki server after ctrl+c terminal command
  process.on('SIGINT', stopSolrandFuseki);

});

//INIT SERVER
app.get("/", function(req, res) {
        loadPage(res,'../index.html');   
      } 
);

app.get("/getFusekiResult", function(req,res){
  res.end(fusekiResult);
});

app.get("/getLocalIP", function(req,res){
  res.end(serverLocalIP);
});


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
  
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if(query['content'] != undefined){
    loadPage(res, '../public/view/search.html');	
  }
  else{
    for(attribute in query){
      if(query[attribute] != '' && query[attribute] != undefined)
        runFusekiQuery(res, attribute, query[attribute]);
    }
  }
  
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

function runFusekiQuery(res, paramName, paramValue){

  paramName = capitalizeFirstLetter(paramName);

  var queryEntryPoint = "http://localhost:3030/OntRepository/query -X POST --data 'query=";
  var prefixes =  ' PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'+
                  ' PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>'+
                  ' PREFIX pref: <http://www.semanticweb.org/domenico/ontologies/2018/8/ont#>'+
                  ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
                  ' PREFIX owl: <http://www.w3.org/2002/07/owl#> ';
  var query = 'SELECT ?name '+
              'WHERE {'+
                    '?subject pref:'+paramName+ ' "'+paramValue +'". ' +
                    '?subject pref:Name ?name' +
              '}';
  var applicationType = "-H 'Accept: application/sparql-results+json,*/*;q=0.9'"

  exec('curl '+queryEntryPoint+prefixes+query+"' "+applicationType, 
        function(err, stdout, stderr){
          if(err)  
            console.log(err);
          else{
            var jsonFusekiResponse = stdout;
            
            var queryobject = GSON.parse(jsonFusekiResponse);
          
            if(queryobject.results.bindings.length > 0)
              fusekiResult = queryobject.results.bindings[0].name.value;
            else
              fusekiResult = '';

          }
          loadPage(res, '../public/view/search.html');	
        }
  );

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

