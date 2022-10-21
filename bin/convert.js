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
const sandbox = require("./sandbox.js");

const convert = function(context, option, content){

    const tagSplit = function(content){

        var tagStart = "<?elf";
        var tagEnd = "?>";

        if(option.tag){
            if(option.tag.start){
                tagStart = option.tag.start;
            }
            if(option.tag.end){
                tagEnd = option.tag.end;
            }
        }

        var bf1_ = content.split(tagStart);
        var bf2_ = [];

        for(var n = 0 ; n < bf1_.length ; n++){
            var bb_ = bf1_[n].split(tagEnd);

            if(bb_.length == 2){
                bf2_.push(bb_[0]);
                bf2_.push(bb_[1]);
            }
            else{
                bf2_.push(bb_[0]);
            }
        }

        return bf2_;
    };

    const tagConbine = function(tags){

        var str = "(async function(){ try{";

        for(var n = 0 ; n < tags.length ; n++){
            var t_ = tags[n];

            if(n % 2 == 0){
                // text area
                str += "echoB64(\"" + tool.base64Encode(t_) + "\");";
            }
            else{
                // script area
                str += t_;
            }
        }

        if(option.displayError){
            var echoStr = "";
            if(option.htmlOutput){
                echoStr += "\"<pre><code>";
            }
            else{
                echoStr += "\"\n";
            }

            echoStr += "[ERROR]\" + error.toString() + \"";
         
            if(option.htmlOutput){
                echoStr += "</core></pre>\"";
            }
            else{
                echoStr += "\n\"";
            }

            str += "}catch(error){ ___error = error; } })();";
        }
        else{
            str += "}catch(error){} })();"
        }

        return str;
    };

    var tags = tagSplit(content);
    var str =  tagConbine(tags);

    return sandbox(context, option, str);
};
module.exports = convert;