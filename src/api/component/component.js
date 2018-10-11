var newPath;
//module that manages local paths
var paths= require('../paths-manager');
//for handle file system
var fs = require('fs');
//for run child process
var exec = require('child_process').exec, child;
var execSync = require('child_process').execSync;
var componentOperation = require('./component-operation');
//for parse file JSON
var GSON= require('gson');
//for find file on directory
var find = require('find');
//check zip file
var ZIP_FILE = require('is-zip-file');


module.exports.loadComponent = function (response,fields, files) {
    if(files.filetoupload != undefined) {
        var currentPath = files.filetoupload.path;
        if(currentPath != undefined) {
            newPath =  paths.projectsRepoPATH+files.filetoupload.name;
            fs.copyFile(currentPath, newPath, function (err) {
                if (err)
                    errorPage("Component not saved into repository",response);
                else {
                    ZIP_FILE.isZip(newPath, function(err, isZip) {
                        if(err) {
                            console.log('Error while checking if file is zip : ' + err);
                            errorPage('Error while checking if file is zip : ',response );
                        }else {
                            console.log('Given file is zip : ' + isZip);
                            if(isZip) {
                                var source = newPath;
                                var target = paths.projectsRepoPATH;
                                unZip(source,target,fields,files,response);
                            }else {
                                errorPage("Upload a '.zip' file",response);
                            }
                        }
                    });
                }    
            });
        }else 
            errorPage("-Path File is not valid!",response); 
    }else {
        errorPage("-File format is not valid!",response); 
    }
    
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
    //remove extention path
    newPath = newPath.split('.').slice(0, -1).join('.');
    componentOperation.createProjectNode(files,fields);
    checkAndSave(fields,response);
    componentOperation.endOperations(response);
}
function checkAndSave(fields, response){
    var cls=[], dependencies=[];
    var contents;
    
   	if(fields.source != undefined) {
        child = exec('java -jar '+paths.externalToolsPATH+'JavaT.jar -path '+newPath+' -out '+paths.projectsRepoPATH,
        function (error, stdout, stderr){
          
            if(error){
            	errorPage("-Error during file parsing into exec", response);
            }else {
                console.log("-Start handle JSon file...");
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
                
                createandPostJsonDocuments(cls, fields, 'sourceCode');

                console.log("JSon file parsed correctly");

                componentOperation.doSaveSourceFile(cls,dependencies);
            }
        });
    }
    if (fields.doc != undefined) {

	   //search any file for documentation on project
       find.file(/([a-zA-Z0-9\s_\\.\-\(\):])+(.doc|.docx|.pdf|.html|.htm|.odt|.xls|.xlsx|.ods|.ppt|.pptx|.txt)$/i ,newPath, function(documents) {

            createandPostJsonDocuments(documents, fields, 'document');

            componentOperation.doSaveDocuments(documents);
       });
    }
    if(fields.test != undefined) {

        find.file(/^.*test.*$/,newPath,function (tests) {
            
            type='test';
            createandPostJsonDocuments(tests, fields, 'test');

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
    var tmpFileName;

    switch(type){
        case 'sourceCode': tmpFileName='tmpSrcCode.json';break;
        case 'document': tmpFileName='tmpDocument.json';break;
        case 'test':tmpFileName ='tmpTest.json';break;
        default:break;
    }

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

        //Read file from path to fill content attribute of json object
        var documentContent = fs.readFileSync(paths[i], 'utf8');
        document.content = documentContent;
        documents.unshift(document);
    }

    var jsonContent = JSON.stringify(documents);

    fs.writeFile('../components_json/' + tmpFileName, 
                jsonContent, 
                {encoding:'utf8', flag:'w+'},  
                function(err){
                    if(err)
                        console.log(err);
                    else{
                        postDocumentsOnSolr(tmpFileName);
                    }
                }
    );
}

function postDocumentsOnSolr(fileName) {
    execSync(paths.rootPATH + 
            'solr-7.4.0/bin/post' + 
            ' -c componentscore ' + 
            paths.rootPATH + 
            'components_json/'+fileName, 
            function(err,stdout,stderr) {
                if(err)
                    console.log(err);
            }
    );
}