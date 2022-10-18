/**
 * ==============================================================
 * 
 * ELF 
 * (Embeded LightWeight Frontend - Template-Engine)
 * 
 * MIT Lisence - Author: Nakatsuji Masto 2022. All light.
 * 
 * ==============================================================
 */
const tool = require("hachiware_tool");
const convert = require("./convert.js");
const path = require("path");
const fs = require("fs");

const elf = function(option){

    if(!option){
        option = {};
    }

    var obj = Object.create(null);

    var colums = Object.keys(option);
    for(var n = 0 ; n < colums.length ; n++){
        var field = colums[n];
        var value = option[field];
        obj[field] = value;
    } 

    /**
     * convert
     * @param {*} scriptString 
     * @returns 
     */
    this.convert = function(scriptString){
        return new convert(this, obj, scriptString);
    };

    /**
     * loadFile
     * @param {*} filePath 
     * @returns 
     */
    this.loadFile = async function(filePath, onFullPath){

        const notfound = function(path){

            return new Promise(function(resolve){

                var str = "";
                if(obj.displayError){
                    if(obj.htmlOutput){
                        str += "<div>";
                    }
                    str += "[ERROR] include(\"" + path + "\") not found.";
                        
                    if(obj.htmlOutput){
                        str += "</div>";
                    }
                }
                
                resolve({
                    content: str,
                    context: obj,
                });
            });
        };

        if(obj.onServerCache){

            obj.currentPath = path.dirname(filePath);
            obj.filePath = path.basename(filePath);

            if(!await obj._cache.exists(filePath)){
                return notfound(filePath);
            }

            var content = await obj._cache.get(filePath);
        }
        else{

            if(!obj.currentPath){
                if(process.argv[1].indexOf(".js") > -1){
                    obj.currentPath = path.dirname(process.argv[1]) + "/" + path.dirname(filePath);
                }
                else{
                    obj.currentPath = process.argv[1] + "/" + path.dirname(filePath);
                }
            }
    
            if(onFullPath){
                obj.currentPath = path.dirname(filePath);
            }
        
            obj.filePath = path.basename(filePath);    

            if(!fs.existsSync(obj.currentPath + "/" + obj.filePath)){
                return notfound(obj.currentPath + "/" + obj.filePath);
            }

            if(!fs.statSync(obj.currentPath + "/" + obj.filePath).isFile()){
                return notfound(obj.currentPath + "/" + obj.filePath);
            }

            var content = fs.readFileSync(obj.currentPath + "/" + obj.filePath).toString();
        }

        return this.convert(content);
    };
}
module.exports = elf;