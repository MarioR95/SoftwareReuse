var newPath;
//module that manages local paths
var paths= require('../paths-manager');
//for handle file system
var fs = require('fs');
//for run child process
var exec = require('child_process').exec, child;
var componentOperation = require('./component-operation');
//for parse file JSON
var GSON= require('gson');
//for find file on directory
var find = require('find');


module.exports.loadComponent = function (response,fields, files) {
    var currentPath = files.filetoupload.path;
    if(currentPath != undefined) {
        newPath =  paths.projectsRepoPATH+files.filetoupload.name;
        fs.copyFile(currentPath, newPath, function (err) {
        if (err)
            errorPage("Component not saved into repository",response);
        });
        var source = newPath;
        var target = paths.projectsRepoPATH;
        unZip(source,target,fields,files,response);
    }else 
        errorPage("-File format is not valid!",response);  
}

function unZip(source,target,fields,files,response) {
    exec('java -jar ' + paths.externalToolsPATH + 'Extractor.jar '+source+' ' +target,
    function(error, stdout, stderr) {
        if (error) {
            errorPage(""+error,response);
        }else {
            console.log("-File unzipped correctly");
            //PARSE FILE INTO FOLDER 
            if(fields.java != undefined){
                if (fs.existsSync(source.split('.').slice(0, -1).join('.'))) {
                    parseJavaComponent(response,files,fields);
                    console.log("-Component parsed correctly");    
                }else {
                    errorPage("Directory unzipped not exist",response);
                }
            }else {
                console.log("Language not supported"); 
                errorPage("Language not supported",response);
            }
        } 
    });
    
    
}
function parseJavaComponent(response,files,fields) {
    var contents;
    //remove extention path
    newPath = newPath.split('.').slice(0, -1).join('.');
    componentOperation.createProjectNode(files,fields);
    checkAndSave(fields,response);
    componentOperation.endOperations(response);
    
}
function checkAndSave(fields,response){
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
                fs.unlinkSync(paths.projectsRepoPATH+'result.json');
                var jsonContent = [];
                jsonContent = GSON.parse(contents);
                for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
                    cls[i] = jsonContent.class[i];
                    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
                        dependencies[j] = jsonContent.dependencies[j];
                    }  
                }
                console.log("JSon file parsed correctly");
                componentOperation.doSaveSourceFile(cls,dependencies);
            }
        });
    }
    if (fields.doc != undefined) {
	   var documents = [];
	   //search any file for documentation on project
       find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(documents) {
           componentOperation.doSaveDocuments(documents);
       });
     
        
    }
    if(fields.test != undefined) {
        find.file(/^.*test.*$/,newPath,function (tests) {
            componentOperation.doSaveTestFile(tests);
        });
    }
}
function errorPage(mess,response) {
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.end(mess);
}