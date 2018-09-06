var newPath;
//module that manages local paths
var paths= require('../paths-manager');
//for handle file system
var fs = require('fs');
//for extract zip
var extract = require('extract-zip');
//for run child process
var exec = require('child_process').exec, child;
var componentOperation = require('./component-operation');
//for parse file JSON
var GSON= require('gson');
//for find file on directory
var find = require('find');
var sync = require('sync');


module.exports.loadComponent = function (response,fields, files) {
    console.log("-Load Component "+files.filetoupload.name);
    var currentPath = files.filetoupload.path;
    if(currentPath != undefined) {
        newPath =  paths.projectsRepoPATH+files.filetoupload.name;
        fs.copyFile(currentPath, newPath, function (err) {
        if (err)
            errorPage("Component not saved into repository");
        });
        var source = newPath;
        var target = paths.projectsRepoPATH;
        //EXTRACT ZIP
        extract(source, {dir: target}, function (err) {
          if(err)
            console.log("Errore"+err);
          console.log("-File unzipped correctly");
          //PARSE FILE INTO FOLDER 
          if(fields.java != undefined){
          	console.log("@@@@@@@@@HO INSERITO UN PROJETTO JAVA");
          	parseJavaComponent(response,files,fields);
            console.log("-Component parsed correctly");
          }else 
          	console.log("Language not supported");
        });
		
    }else 
        errorPage("-File format is not valid!");  
}


  
function parseJavaComponent(response,files,fields) {
    var contents;
    //remove extention path
    newPath = newPath.split('.').slice(0, -1).join('.');
    console.log(paths.externalToolsPATH);
    componentOperation.createProjectNode(files,fields);
    beforeStoring(fields);
    componentOperation.endOperations(response);
    
}


function beforeStoring(fields){
   	if(fields.source != undefined) {
   		var cls=[], dependencies=[];
        child = exec('java -jar '+paths.externalToolsPATH+'JavaT.jar -path '+newPath+' -out '+paths.projectsRepoPATH,
        function (error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(error){
            	errorPage("-Error during file parsing into exec", response);
            }else {
                console.log("-File parsed correctly");
                console.log("-Start handle JSon file...");
                contents = fs.readFileSync(paths.projectsRepoPATH+"result.json");
                var jsonContent = [];
                jsonContent = GSON.parse(contents);
                for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
                    cls[i] = jsonContent.class[i];
                    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
                        dependencies[j] = jsonContent.dependencies[j];
                    }  
                }
                console.log("JSon file parsed correctly");
                fs.unlink(paths.projectsRepoPATH+'result.json');
                componentOperation.doSaveSourceFile(cls,dependencies);
            }
        });
    }
    if (fields.doc != undefined) {
	   var documents = [];
	   //search any file for documentation on project
       console.log("PATH"+newPath);
       find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(documents) {
           console.log("NEWPATH: "+newPath);
           console.log("DOCUMENTATION: "+documents);
           componentOperation.doSaveDocuments(documents);
       });
     
        
    }
    if(fields.test != undefined) {
        find.file(/^.*test.*$/,newPath,function (tests) {
            console.log("exist directory test");
            console.log("Test files "+tests);
            componentOperation.doSaveTestFile(tests);
        });
    }
}


function errorPage(mess) {
    fs.unlinkSync(completePath);
    console.log("**********REMOVING COMPONENT FROM REPOSITORY AFTER ERROR: "+mess+"**********");
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.end(mess);
}