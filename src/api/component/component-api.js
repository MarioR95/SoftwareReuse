var paths= require('../paths-manager');
var formidable = require('formidable')
var component = require('./component');
module.exports.upload = function (app) {
    app.post("/upload", function(req,res){
            var form = new formidable.IncomingForm();
    
            form.parse(req,function(err, fields, files){
                if(err){
                    console.log(err);
                }
                component.loadComponent(res,fields,files);
            });
    });
};