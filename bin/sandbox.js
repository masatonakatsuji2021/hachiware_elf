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
const path = require("path");
const fs = require("fs");
const _require = require;

const sandbox = function(context, __option, str){

    const elf = require("./index.js");

    return new Promise(function(resolve){

        var __string = "";

        if(__option.data){
            var colums = Object.keys(__option.data);
            for(var n = 0 ; n < colums.length ; n++){
                var field = colums[n];
                var value = __option.data[field];

                this[field] = value;
            }
        }

        var ___error;

        /**
         * echo
         * @param {*} echoStrB64 
         */
        const echoB64 = function(echoStrB64){
            __string += tool.base64Decode(echoStrB64);    
        };
        
        /**
         * sanitize
         * @param {*} sanitizeStr 
         * @return sanitied Text
         */
        const sanitize = function(sanitizeStr){

            const snList = {
                "<": "&lt;",
                ">": "&gt;",
                "‘": "&#39;",
                "“": "&quot;",
                "&": "&amp;",
                " ": "&nbsp;",
                "¥":"&yen;",
                "¢": "&cent;",
                "£": "&pound;",
                "¦": "&brvbar;",
                "©": "&copy;",
                "®": "&reg;",
                "°": "&deg;",
                "±": "&plusmn;",
                "×": "&times;",
                "÷": "&divide;",
                "µ": "&micro;",
                "·": "&middot;",
                "§": "&sect;",
                "«": "&laquo;",
                "»": "&raquo;",
                "²": "&sup2;",
                "³": "&sup3;",
                "¹": "&sup1;",
                "¼": "&frac14;",
                "½": "&frac12;",
                "¾": "&frac34;",
            };

            var colums = Object.keys(snList);

            for(var __n = 0 ; __n < colums.length ; __n++){
                var before = colums[__n];
                var after = snList[before];
                sanitizeStr = sanitizeStr.split(before).join(after);
            }

            return sanitizeStr;
        };

        /**
         * echo
         * @param {*} echoStr 
         * @param {*} noSanitizing
         */
        const echo = function(echoStr, noSanitizing){

            echoStr = echoStr.toString();

            if(!noSanitizing){
                echoStr = sanitize(echoStr);
            }

            __string += echoStr;
        };

        /**
         * debug
         * @param {*} objects 
         */
        const debug = function(objects){

            var str = "<div class=\"debug\"><pre><code>";

            if(typeof objects == "object"){
                str += JSON.stringify(objects, null, "  ");
            }

            str += "</code></pre></div>";

            __string += str;
        };
        
        /**
         * sleep
         * @param {*} interval 
         * @param {*} callback 
         * @returns 
         */
         const sleep = function(interval, callback){

            return new Promise(function(resolve){
                setTimeout(function(){
                    if(callback){
                        var res = callback();
                    }
                    resolve(res);
                }, interval);
            });
        };

        /**
         * wait
         * @param {*} callback 
         * @returns 
         */
        const wait = function(callback){

            return new Promise(function(resolve){
                callback(resolve);
            });
        };

        /**
         * include
         * @param {*} filePath 
         * @returns 
         */
        const include = async function(filePath){

            if(filePath.substring(0, 1) == "/"){
                var _path = filePath;
            }
            else{
                var _path = __option.currentPath + "/" + filePath;
            }

            var child = new elf(__option);    
            var res = await child.loadFile(_path, true);

            var colums = Object.keys(res.context);
            for(var n = 0 ; n < colums.length ; n++){
                var field = colums[n];
                var value = res.context[field];

                if(
                    field == "global" ||
                    field == "clearInterval" ||
                    field == "clearTimeout" ||
                    field == "setInterval" ||
                    field == "setTimeout" ||
                    field == "queueMicrotask" ||
                    field == "clearImmediate" ||
                    field == "setImmediate" ||
                    field == "currentPath" ||
                    field == "filePath"
                ){
                    continue;
                }

                this[field] = value;
            }

            return res.content;
        };

        var require = undefined;

        if(__option.onRequire){

            /**
             * require
             * @param {*} modulePath 
             * @returns 
             */
            var require = function(modulePath){

                var _path =  __option.currentPath + "/" + modulePath;

                if(__option._resources){
                    
                    if(!context.existResources(_path)){
                        _path = modulePath;
                        return _require(_path);
                    }

                    var content = context.getResources(_path);

                    var res = eval(content);

                    return res;
                }
                else{

                    if(!fs.existsSync(_path)){
                        _path = modulePath;
                    }    

                    return _require(_path);
                }
            };
            require = require.bind(this);
        }

        try{

            var evals = eval(str);

            if(___error){
                throw(___error);
            }

            evals.then(function(){
                resolve({
                    content: __string,
                    context: this,
                });
            });
    
        }catch(error){

            if(__option.displayError){
                var errorMsg = "";
                if(__option.htmlOutput){
                    errorMsg += "<pre><code>";
                }
                else{
                    errorMsg += "\n";
                }

                errorMsg += "[ERROR] File : " + __option.filePath + "\n" + error.toString();

                if(__option.htmlOutput){
                    errorMsg += "</code></pre>";    
                }
                else{
                    errorMsg += "\n";
                }
            }

            resolve({
                content: __string + errorMsg,
                error: error,
                onError: true,
                context: this,
            });
        }
    
    });
};
module.exports = sandbox;