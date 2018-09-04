//module that manages local paths
var paths= require('./paths-manager');
//for handle file system
var fs = require('fs');
//for handle form 
var formidable = require('formidable')
//for term frequency
var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();
//database access
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','123456'));
var session = driver.session();
//path component repository without extention
var newPath;
//path component repository with extention
var completePath;
//fields sent form
var idProject,name,description,note,version,uri,entry_point,tags,author,technology,granularity,domain;
//for extract zip
var extract = require('extract-zip')
//for run child process
var exec = require('child_process').exec, child;
//for parse file JSON
var GSON= require('gson');
//class and dependencies
var cls = [] , dependencies = [];
//for find file on directory
var find = require('find');

var express = require('express');
var app= express();

//to handle static file from src directory
app.use(express.static("src"));

app.listen(8080, function(){
	console.log("SERVER STARTED");
});

app.get("/", function(req,res) {
	initPage(res);
});

app.post("/upload", function(req,res){
	//loadComponent(res,req.fields, req.files);
	    var form = new formidable.IncomingForm();

	    form.parse(req,function(err, fields, files){
	    	if(err){
	    		
	    	}
	    	//console.log(files.filetoupload.name);
	    	loadComponent(res,fields, files);
	    });
});


function loadComponent(response,fields, files) {
  console.log("-Load Component "+files.filetoupload.name);
  console.log(files);
  var currentPath = files.filetoupload.path;
  if(currentPath != undefined) {
    newPath =  paths.projectsRepoPATH+files.filetoupload.name;
    completePath = newPath;
    //parameters FORM (for ontology, TO DO)
    name = fields.name;
    description = fields.description;
    note = fields.note;
    version = fields.version;
    uri = fields.uri;
    entry_point = fields.entry_point;
    tags = fields.tags;
    author = fields.author;
    technology = fields.technology;
    granularity = fields.granularity;
    domain = fields.domain;
    fs.copyFile(currentPath, newPath, function (err) {
      if (err)
        errorPage("Component not saved into repository");
    });
    //start chain of function unZip() -> parseComponent() -> handleJSONFIle() -> insertComponent() -> (CONTINUE) handleJSONFIle() (because you have to do them synchronously)
    console.log(name);
    console.log("-File unzipped correctly");
    unZip(response);
    //analize frequency term (TO DO)
    //tfidf.addFileSync(newpath);
    //console.log(tfidf.tfidf('Class', 0));
  }else 
    errorPage("-File format is not valid!");  
}
//to do
function searchComponent(response) {
  //retrive all element to neo4j
  console.log("Search");
  response.write('-Work in progress');
  response.end();
}

function initPage(response) {
   //HTML PAGE
   console.log("-Index loaded successfully"); 
   response.writeHead(200,{'Content-type': 'text/html'});
   fs.readFile('./src/view/insert.html',null,function(error,data) {
     if(error) {
      response.writeHead(404);
      response.write('-Page not found');
     }else {
      response.end(data);
     }
   });
}

function unZip(response) {
  var source = newPath;
  var target = paths.projectsRepoPATH;
  extract(source, {dir: target}, function (err) {
    if(err != undefined)
      console.log(err);
  });
  console.log("-Unzipped successfully");
  console.log("-Component parsed correctly");
  parseComponent(response);
}

function parseComponent(response) {
  //remove extention path
  newPath = newPath.split('.').slice(0, -1).join('.');
  console.log(paths.externalToolsPATH);
  child = exec('java -jar '+paths.externalToolsPATH+'JavaT.jar -path '+newPath+' -out '+paths.projectsRepoPATH,
  function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error){
      errorPage("-Parse Failed", response);
    }else {
      console.log("-Parsed correctly");
      console.log("-Start handle JSon file");
      handleJSONFIle(response);
    }
  });

}

function handleJSONFIle(response) {
  var contents = fs.readFileSync(paths.projectsRepoPATH+"result.json");
  var jsonContent = [];
  jsonContent = GSON.parse(contents);
  for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
    cls[i] = jsonContent.class[i];
    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
      dependencies[j] = jsonContent.dependencies[j];
    }  
  }
  console.log("-Start to load component into Neo4j DB");
  insertComponent();
  console.log("-Insert correctly");
  fs.unlinkSync(paths.projectsRepoPATH+"result.json");
  console.log("-JSon file removing from repository");
  response.write('-Files correctly stored into DB');
  response.end();
}

function insertComponent() {
  //insert project unzip into neo4j
  session.run(queryForCreateNodeProject())
  .catch( function(error) {
    console.log(error);
    driver.close();
  });
  //search any file for documentation on project
  find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(files) {
    console.log("DOCUMENTATION: "+files);
    //insert relationship of projet and documentation
    for(i = 0; i < files.length; i++) {
      var idDocumentation = makeid();
      session.run('MATCH(p:'+idProject+') CREATE(d:'+idDocumentation+ '{pathDocument:'+"'"+files[i]+"'"+', type:"documentation"}) CREATE (p)-[r:DOCUMENTATION]->(d)')
      .catch( function(error) {
        console.log(error);
        driver.close();
      }); 
    }
  });
  var nameComponentClass;
  var nameComponentDepen;
  var indexForChangeNameDep = [];
  //insert nodeClass
  for(i= 0, k = 0; i < cls.length; k++,i++) {
    nameComponentClass = "NODE"+i;
    session.run('MERGE(n:'+nameComponentClass+' {Class_Path: '+"'"+cls[i]+"'"+', Project_Path:'+"'"+newPath+"'"+'})')
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
    for (j = 0; j < dependencies[k].length; j++) {
      nameComponentDepen = "NODE"+k+j;
      indexForChangeNameDep.push(nameComponentDepen);
      //insert nodeDep
      session
      .run('MERGE(n:'+nameComponentDepen+' {Class_Path: '+"'"+dependencies[k][j]+"'"+', Project_Path:'+"'"+newPath+"'"+'})')
      .catch( function(error) {
        console.log(error);
        driver.close();
      });
      //Create relation Class --> Dependencies
      session
      .run('MATCH (c:'+nameComponentClass+'), (d:'+nameComponentDepen+') MERGE (c)-[u:USE]->(d)')
      .catch( function(error) {
        console.log(error);
        driver.close();
      });
    }
    //set unique name for node Class in Neo4j
    session
    .run('MATCH (n:'+nameComponentClass+') SET n:'+makeid()+' REMOVE n:'+nameComponentClass+"")
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
  }
  //set unique name dependencies in neo4j
  for(i = 0; i < indexForChangeNameDep.length; i++) {
    session
    .run('MATCH (n:'+indexForChangeNameDep[i]+') SET n:'+makeid()+' REMOVE n:'+indexForChangeNameDep[i]+"")
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
  }
}

function makeid() {
  // return IDString UNIQUE
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function errorPage(mess,res) {
  fs.unlinkSync(completePath);
  console.log("-Removing component after error: "+mess);
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end(mess);
}

function queryForCreateNodeProject() {
  idProject = makeid();
  return 'CREATE(p:'+idProject+' {Path:'+"'"+newPath+"'"+', Name:'+"'"+name+"'"+', Description:'+"'"+description+"'"+', Note:'+"'"+note+"'"+', Version:'+"'"+version+"'"+', Uri:'+"'"+uri+"'"+', Entry_point:'+"'"+entry_point+"'"+', Tags:'+"'"+tags+"'"+', Author:'+"'"+author+"'"+', Technology:'+"'"+technology+"'"+', Granurality:'+"'"+granularity+"'"+', Domain:'+"'"+domain+"'"+'})';
}
