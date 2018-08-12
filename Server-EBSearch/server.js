var http = require('http');
//for handle file system
var fs = require('fs');
//for handle form 
var formidable = require('formidable');
//for term frequency
var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();
//database access
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('Bolt://localhost',neo4j.auth.basic('neo4j','123456'));
var session = driver.session();
//fields form sent
var newpath,name,description,note,version,uri,entry_point,tags,author,technology,granularity,domain;
//for extract zip
var extract = require('extract-zip')
//for run child process
var exec = require('child_process').exec, child;
//for code Syncronus
var Sync = require('sync');
//for parse file JSON
var GSON= require('gson');
//class and dependencies
var cls = [];
var dependencies = [];
http.createServer(function (req, res) {
  //UPLOAD component
  if (req.url == '/componentupload') {
    var form = new formidable.IncomingForm();    
    form.parse(req, function (err, fields, files) {
      loadComponent(req,res,err, fields, files);
    });
  } else if(req.url == '/componentsearch') {
      searchComponent(res);
  }else {
    initPage(res);
  }
}).listen(8080); 
function loadComponent(req,res,err, fields, files) {
  var oldpath = files.filetoupload.path;
  newpath = '/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/' + files.filetoupload.name;
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
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
      unZip();
      parseComponent();
    //analize frequency term
    //tfidf.addFileSync(newpath);
    //console.log(tfidf.tfidf('Class', 0));
  }else {
    //no file uploaded
    res.write("you must select a file");
    res.end();
  }
}
function searchComponent(res) {
  //retrive all element to neo4j
  console.log("search");
  res.write('all component directory');
  session
  .run("MATCH (N) RETURN N.Name")
  .then(function(result) {
    result.records.forEach(function(record){
       
       console.log(record.get("N.Name"));
       
    });
  })
  res.end();
}
function initPage(res) {
   //HTML PAGE 
   res.writeHead(200,{'Content-type': 'text/html'});
   fs.readFile('./src/view/index.html',null,function(error,data) {
     if(error) {
       res.writeHead(404);
       res.write('Page not found');
     }else {
       res.end(data);
     }
   });
}
function unZip() {
  var source = newpath;
  var target = '/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent';
  extract(source, {dir: target}, function (err) {
    if(err != undefined)
      console.log(err);
  })
}
function parseComponent() {
  //remove extention path
  newpath = newpath.split('.').slice(0, -1).join('.');
  child = exec('java -jar /home/dom/Desktop/SoftwareReuse/Server-EBSearch/ExternalTools/JavaT.jar -path '+newpath+' -out /home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent',
  function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error !== null){
      console.log('exec error: ' + error);
    }
    handleJSONFIle();
  });

}
function handleJSONFIle() {
  var contents = fs.readFileSync("/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/result.json");
  var jsonContent = [];
  jsonContent = GSON.parse(contents);
  for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
    console.log(jsonContent.class[i]+ " USA: ");
    cls[i] = jsonContent.class[i];
    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
      dependencies[j] = jsonContent.dependencies[j];
      for(k = 0; k < Object.keys(jsonContent.dependencies[j]).length; k++) {
        if(jsonContent.dependencies[j] != undefined || jsonContent.dependencies[j] != null)
          console.log("DEP "+jsonContent.dependencies[j][k]);
      }
    }  
  }
  insertComponent();
  fs.unlinkSync("/home/dom/Desktop/SoftwareReuse/Server-EBSearch/repositoryComponent/result.json");
}
function insertComponent() {
  //session.run(queryForCreateNode());
  var nameComponentClass;
  var nameComponentDepen;
  //insert nodeClass
  for(i = 0; i < cls.length; i++) {
    nameComponentClass = "NODE"+i;
    session.run('MERGE(n:'+nameComponentClass+' {Class_Path: '+"'"+cls[i]+"'"+'})')
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
    for(k = 0; k < dependencies.length; k++) {
      for (j = 0; j < dependencies[k].length; j++) {
        nameComponentDepen = "NODE";
        console.log("Name DEp "+dependencies[k][j]);
        session
        .run('MERGE(n:'+nameComponentDepen+' {Class_Path: '+"'"+dependencies[k][j]+"'"+'})')
        .catch( function(error) {
          console.log(error);
          driver.close();
        });
        session
        .run('MATCH (c:'+nameComponentClass+'), (d:'+nameComponentDepen+') MERGE (c)-[u:USE]->(d)')
        .catch( function(error) {
          console.log(error);
          driver.close();
        });
        //console.log("Match tra"+'MATCH (c:'+nameComponentClass+'), (d:'+nameComponentDepen+') MERGE (c)-[u:USE]->(d)');
      }
    }
    //set unique name for node Class
    session
    .run('MATCH (n:'+nameComponentClass+') SET n:'+makeid()+' REMOVE n:'+nameComponentClass+"")
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
  }
  //set node dependencies with unique name
  session
    .run('MATCH (n:NODE) SET n:'+makeid()+' REMOVE n:NODE')
    .catch( function(error) {
      console.log(error);
      driver.close();
    });
}
function queryForCreateNode() {
  return 'CREATE(node:Component {Path:'+"'"+newpath+"'"+', Name:'+"'"+name+"'"+', Description:'+"'"+description+"'"+', Note:'+"'"+note+"'"+', Version:'+"'"+version+"'"+', Uri:'+"'"+uri+"'"+', Entry_point:'+"'"+entry_point+"'"+', Tags:'+"'"+tags+"'"+', Author:'+"'"+author+"'"+', Technology:'+"'"+technology+"'"+', Granurality:'+"'"+granularity+"'"+', Domain:'+"'"+domain+"'"+'})';
}
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}