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
    componentOperation.createProjectNode(files,fields);
    checkAndSave(fields,response);
    componentOperation.endOperations(response);
    
}


function checkAndSave(fields){
    var cls=[], dependencies=[];

    
   	if(fields.source != undefined) {
        child = exec('java -jar '+paths.externalToolsPATH+'JavaT.jar -path '+newPath+' -out '+paths.projectsRepoPATH,
        function (error, stdout, stderr){
          
            if(error){
            	errorPage("-Error during file parsing into exec", response);
            }else {
                ì
                contents = fs.readFileSync(paths.projectsRepoPATH+"result.json");
               
                type='sourcecode';
                createandPostJsonDocuments(cls, fields, type);

                console.log("JSon file parsed correctly");

                componentOperation.doSaveSourceFile(cls,dependencies);
            }
        });
    }
    if (fields.doc != undefined) {

	   //search any file for documentation on project
       console.log("PATH"+newPath);
       find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(documents) {
           
            type='document';
            createandPostJsonDocuments(documents, fields, type);

            componentOperation.doSaveDocuments(documents);
       });
    }
    if(fields.test != undefined) {

        find.file(/^.*test.*$/,newPath,function (tests) {
            
            type='test';
            createandPostJsonDocuments(tests, fields, type);

            componentOperation.doSaveTestFile(tests);
        });
    }
}
function errorPage(mess,response) {
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.end(mess);
}



function createandPostJsonDocuments(paths, formFields, type){
    var documents = [];
    var document;


    for(var i=0; i < paths.length; i++){
        document = new Object();

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
        documents.unshift(document);

    }


    fs.writeFile('../components_json/tmp.json', JSON.stringify(documents), {flag:'w+'},  function(err){
        if(err)
            console.log(err);
        else{
            console.log("tmp.json was saved!");
            postDocumentsOnSolr();
        }
    });

}


function postDocumentsOnSolr() {
    exec(paths.rootPATH + 'solr-7.4.0/bin/post' + ' -c componentscore ' + paths.rootPATH + 'components_json/tmp.json', function(err,stdout,stderr) {
        if(err)
            console.log(err);
        else
            console.log("Documents posted correctly");
    });
    
}