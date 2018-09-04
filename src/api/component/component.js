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

module.exports.loadComponent = function (response,fields, files) {
    console.log("-Load Component "+files.filetoupload.name);
    console.log(files);
    var currentPath = files.filetoupload.path;
    if(currentPath != undefined) {
        newPath =  paths.projectsRepoPATH+files.filetoupload.name;
        fs.copyFile(currentPath, newPath, function (err) {
        if (err)
            errorPage("Component not saved into repository");
        });
        //start chain of function unZip() -> parseComponent() -> handleJSONFIle() -> insertComponent() -> (CONTINUE) handleJSONFIle() (because you have to do them synchronously)
        console.log("-File unzipped correctly");
        unZip(response,files,fields);
    }else 
        errorPage("-File format is not valid!");  
}

function unZip(response,files,fields) {
    var source = newPath;
    var target = paths.projectsRepoPATH;
    extract(source, {dir: target}, function (err) {
      if(err != undefined)
        console.log(err);
    });
    console.log("-Unzipped successfully");
    console.log("-Component parsed correctly");
    parseComponent(response,files,fields);
}
  
function parseComponent(response,files,fields) {
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
    componentOperation.doSave(response,files,fields);
    }
});

}
function errorPage(mess) {
    fs.unlinkSync(completePath);
    console.log("**********REMOVING COMPONENT FROM REPOSITORY AFTER ERROR: "+mess+"**********");
    response.writeHead(500, {'Content-Type': 'text/plain'});
    response.end(mess);
}