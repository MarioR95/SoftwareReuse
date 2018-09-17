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

var type;


module.exports.loadComponent = function (response,fields, files) {

    console.log("-Load Component "+files.filetoupload.name);
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
    console.log("Source: "+source);
    console.log("Target "+target);
    console.log("Name: "+fields.name);

    exec('java -jar ' + paths.externalToolsPATH + 'Extractor.jar '+source+' ' +target,
    function(error, stdout, stderr) {
        if (error) {
            errorPage(""+error,response);
        }else {
            console.log("-File unzipped correctly");
            //PARSE FILE INTO FOLDER 
            if(fields.java != undefined){
                
                //console.log("SOURCE: "+source.split('.').slice(0, -1).join('.'));
                //console.log(""+fs.existsSync(source.split('.').slice(0, -1).join('.')));
                if (fs.existsSync(source.split('.').slice(0, -1).join('.'))) {
                    parseJavaComponent(response,files,fields);
                    console.log("-Component parsed correctly");    
                }else {
                    errorPage("Directory unzipped not exist",response);
                }
            }else 
                console.log("Language not supported"); 
        } 
    });
    
    
}
function parseJavaComponent(response,files,fields) {
    var contents;
    //remove extention path
    newPath = newPath.split('.').slice(0, -1).join('.');
    //console.log(paths.externalToolsPATH);
    componentOperation.createProjectNode(files,fields);
    checkAndSave(fields,response);
    componentOperation.endOperations(response);
    
}
<<<<<<< HEAD


function checkAndSave(fields){
    var cls=[], dependencies=[];
=======
function checkAndSave(fields,response){
>>>>>>> 0889f79c45e722a089b1c027b34c138f1dd073cf
   	if(fields.source != undefined) {
        child = exec('java -jar '+paths.externalToolsPATH+'JavaT.jar -path '+newPath+' -out '+paths.projectsRepoPATH,
        function (error, stdout, stderr){
            //console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
            if(error){
            	errorPage("-Error during file parsing into exec", response);
            }else {
                //console.log("-File parsed correctly");
                //console.log("-Start handle JSon file...");
                contents = fs.readFileSync(paths.projectsRepoPATH+"result.json");
                //fs.unlinkSync(paths.projectsRepoPATH+'result.json');
                var jsonContent = [];
                jsonContent = GSON.parse(contents);
                for(i = 0; i < Object.keys(jsonContent.class).length; i++) {
                    cls[i] = jsonContent.class[i];
                   
                    for(j = 0; j < Object.keys(jsonContent.dependencies).length;j++) {
                        dependencies[j] = jsonContent.dependencies[j];
                    }  
                }
                type='sourcecode';
                createJsonDocuments(cls, fields, type);
                console.log("JSon file parsed correctly");
                componentOperation.doSaveSourceFile(cls,dependencies);
            }
        });
    }
    if (fields.doc != undefined) {
	   var documents = [];
	   //search any file for documentation on project
       console.log("PATH"+newPath);
       find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(documents) {
            //console.log("NEWPATH: "+newPath);
            //console.log("DOCUMENTATION: "+documents);
           
            type='document';
            createJsonDocuments(cls, fields, type);

           componentOperation.doSaveDocuments(documents);
       });
    }
    if(fields.test != undefined) {
        find.file(/^.*test.*$/,newPath,function (tests) {
            //console.log("exist directory test");
            //console.log("Test files "+tests);
            
            type='test';
            createJsonDocuments(cls, fields, type);

            componentOperation.doSaveTestFile(tests);
        });
    }
}
function errorPage(mess,response) {
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.end(mess);
}



function createJsonDocuments(paths, formFields, type){
    var documents = [];
    var document = new Object();

    for(var i=0; i < paths.length; i++){

        document.path=paths[i];
        document.type=type;
        document.name=formFields.name;
        document.version=formFields.version;
        document.author=formFields.author;
        document.domain=formFields.domain;
        document.technology=formFields.technology;
        document.description=formFields.description;
        document.notes=formFields.note;
        document.uri=formFields.uri;
        document.entrypoint=formFields.entry_point;

        var content = fs.readFileSync(paths[i], {encoding:'utf8'}, function(error,data) {
            if(error) {
                console.log(error);
            }else {
                
                return data;
            }
        });

        document.content=content;
        documents.push(document);

    }

    fs.writeFile('../components_json/tmp.json', JSON.stringify(documents), {flag:'w+'},  function(err){
        if(err)
            console.log(err);
        else
            console.log("The file was saved!");

    });
    console.log(documents);
}