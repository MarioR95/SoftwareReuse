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
var driver = neo4j.driver('Bolt://localhost:11005',neo4j.auth.basic('neo4j','123456'));
var session = driver.session();
//fields form sent
var newpath,name,description,note,version,uri,entry_point,tags,author,technology,granularity,domain;
//for extract zip
var extract = require('extract-zip')
//for run child process
var exec = require('child_process').exec, child;
//for code Syncronus
var Sync = require('sync');
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
      
      if (fs.existsSync(newpath)) {
        //unzip component
        unZip();
        console.log("esisto");
        parseComponent();
      }
     
    //analize frequency term
    //tfidf.addFileSync(newpath);
    //console.log(tfidf.tfidf('Class', 0));
    //insert into neo4j
    session.run(queryForCreateNode());
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
function queryForCreateNode() {
    return 'CREATE(node:Component {Path:'+"'"+newpath+"'"+', Name:'+"'"+name+"'"+', Description:'+"'"+description+"'"+', Note:'+"'"+note+"'"+', Version:'+"'"+version+"'"+', Uri:'+"'"+uri+"'"+', Entry_point:'+"'"+entry_point+"'"+', Tags:'+"'"+tags+"'"+', Author:'+"'"+author+"'"+', Technology:'+"'"+technology+"'"+', Granurality:'+"'"+granularity+"'"+', Domain:'+"'"+domain+"'"+'})';
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
  });
}