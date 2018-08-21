var http = require('http');
//for handle file system
var fs = require('fs');
//global var response 
var response;
//for handle form 
var formidable = require('formidable');
//for term frequency
var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();
//database access
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('Bolt://localhost',neo4j.auth.basic('neo4j','123456'));
var session = driver.session();
//path component repository without extention
var newpath;
//path component repository with extention
var completePath;
//fields form sent
var name,description,note,version,uri,entry_point,tags,author,technology,granularity,domain;
//for extract zip
var extract = require('extract-zip')
//for run child process
var exec = require('child_process').exec, child;
//for parse file JSON
var GSON= require('gson');
//class and dependencies
var cls = [];
var dependencies = [];

http.createServer(function (req, res) {
  //UPLOAD component
  response = res;
  if (req.url == '/componentupload') {
    var form = new formidable.IncomingForm();    
    form.parse(req, function (err, fields, files) {
      loadComponent(fields, files);
    });
  } else if(req.url == '/componentsearch') {
      searchComponent();
  }else {
    initPage();
  }
}).listen(8080); 

function loadComponent(fields, files) {
  console.log("**********LOAD COMPONENT**********");
  if(files.filetoupload != undefined) {
    var oldpath = files.filetoupload.path;
    newpath = '/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/' + files.filetoupload.name;
    completePath = newpath;
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

    if(newpath.localeCompare("/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/") != 0) {
        fs.copyFile(oldpath, newpath, function (err) {
          if (err)
            errorPage("Component not saved into repository");
        });
        console.log("**********UNZIP COMPONENT*********");
        unZip();
        //analize frequency term (TO DO)
        //tfidf.addFileSync(newpath);
        //console.log(tfidf.tfidf('Class', 0));
    }else {
      //no file uploaded
      errorPage("you must select a file");
    }
  }else 
    errorPage("Component not valid!");  
}
//to do
function searchComponent() {
  //retrive all element to neo4j
  console.log("search");
  response.write('Work in progress');
  response.end();
}
function initPage() {
   //HTML PAGE
   console.log("**********LOAD HTML PAGE**********"); 
   response.writeHead(200,{'Content-type': 'text/html'});
   fs.readFile('./src/view/index.html',null,function(error,data) {
     if(error) {
      response.writeHead(404);
      response.write('Page not found');
     }else {
      response.end(data);
     }
   });
}
function unZip() {
  var source = newpath;
  var target = '/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent';
  extract(source, {dir: target}, function (err) {
    if(err != undefined)
      console.log(err);
  });
  console.log("**********UNZIP SUCCESS**********");
  console.log("**********PARSE COMPONENT*********");
  parseComponent();
}
function parseComponent() {
  //remove extention path
  newpath = newpath.split('.').slice(0, -1).join('.');
  child = exec('java -jar /home/dom/Desktop/SoftwareReuse/Server-EBSearch/ExternalTools/JavaT.jar -path '+newpath+' -out /home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent',
  function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error){
      errorPage("Parse Failed");
    }else {
      console.log("**********PARSE SUCCESS**********");
      console.log("**********START HANDLE JSONFILE**********");
      handleJSONFIle();
    }
  });

}
function handleJSONFIle() {
  var contents = fs.readFileSync("/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/result.json");
  var jsonContent = [];
  jsonContent = GSON.parse(contents);
  for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
    cls[i] = jsonContent.class[i];
    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
      dependencies[j] = jsonContent.dependencies[j];
    }  
  }
  console.log("**********START LOAD COMPONENT INTO NEO4J**********");
  insertComponent();
  console.log("**********INSERT SUCCESS**********");
  fs.unlinkSync("/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/result.json");
  console.log("**********REMOVING JSON FILE FROM REPOSITORY WITH SUCCESS**********");
  response.write('FILES CORRECTLY INSERTED IN THE REPOSITORY AND THE DATABASE');
  response.end();
}
function insertComponent() {
  //session.run(queryForCreateNode());
  var nameComponentClass;
  var nameComponentDepen;
  var indexForChangeNameDep = [];
  //insert nodeClass
  for(i= 0, k = 0; i < cls.length; k++,i++) {
    nameComponentClass = "NODE"+i;
    session.run('MERGE(n:'+nameComponentClass+' {Class_Path: '+"'"+cls[i]+"'"+', Project_Path:'+"'"+newpath+"'"+'})')
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
    for (j = 0; j < dependencies[k].length; j++) {
      nameComponentDepen = "NODE"+k+j;
      indexForChangeNameDep.push(nameComponentDepen);
      //insert nodeDep
      session
      .run('MERGE(n:'+nameComponentDepen+' {Class_Path: '+"'"+dependencies[k][j]+"'"+', Project_Path:'+"'"+newpath+"'"+'})')
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
// return IDString UNIQUE
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
/*
function queryForCreateNode() {
  return 'CREATE(node:Component {Path:'+"'"+newpath+"'"+', Name:'+"'"+name+"'"+', Description:'+"'"+description+"'"+', Note:'+"'"+note+"'"+', Version:'+"'"+version+"'"+', Uri:'+"'"+uri+"'"+', Entry_point:'+"'"+entry_point+"'"+', Tags:'+"'"+tags+"'"+', Author:'+"'"+author+"'"+', Technology:'+"'"+technology+"'"+', Granurality:'+"'"+granularity+"'"+', Domain:'+"'"+domain+"'"+'})';
}*/
function errorPage(mess) {
  fs.unlinkSync(completePath);
  console.log("**********REMOVING COMPONENT FROM REPOSITORY AFTER ERROR: "+mess+"**********");
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.end(mess);
}