//database access
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','123456'));
var session = driver.session();
//for parse file JSON
var GSON= require('gson');
//class and dependencies
var cls = [] , dependencies = [];
//for find file on directory
var find = require('find');
//for handle file system
var fs = require('fs');
var paths= require('../paths-manager');
var newPath;
//fields sent form
var idProject,name,description,note,version,uri,entry_point,tags,author,technology,granularity,domain;

module.exports.doSave = function (response,files,fields) {
    newPath =  paths.projectsRepoPATH+files.filetoupload.name;
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
    //insert project unzip into neo4j
    session.run(queryForCreateNodeProject())
    .catch( function(error) {
        console.log(error);
        driver.close();
    });
    //search any file for documentation on project
    find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath.split('.').slice(0, -1).join('.'), function(documents) {
        console.log("NEWPATH: "+newPath);
        console.log("DOCUMENTATION: "+documents);
        //insert relationship of projet and documentation
        for(i = 0; i < documents.length; i++) {
        var idDocumentation = makeid();
        session.run('MATCH(p:'+idProject+') CREATE(d:'+idDocumentation+ '{pathDocument:'+"'"+documents[i]+"'"+', type:"documentation"}) CREATE (p)-[r:DOCUMENTATION]->(d)')
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
    console.log("-Insert correctly");
    fs.unlinkSync(paths.projectsRepoPATH+"result.json");
    console.log("-JSon file removing from repository");
    response.write('-Files correctly stored into DB');
    response.end();
}      
function makeid() {
// return IDString UNIQUE
var text = "";
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

return text;
}
function queryForCreateNodeProject() {
idProject = makeid();
return 'CREATE(p:'+idProject+' {Path:'+"'"+newPath+"'"+', Name:'+"'"+name+"'"+', Description:'+"'"+description+"'"+', Note:'+"'"+note+"'"+', Version:'+"'"+version+"'"+', Uri:'+"'"+uri+"'"+', Entry_point:'+"'"+entry_point+"'"+', Tags:'+"'"+tags+"'"+', Author:'+"'"+author+"'"+', Technology:'+"'"+technology+"'"+', Granurality:'+"'"+granularity+"'"+', Domain:'+"'"+domain+"'"+'})';
}
