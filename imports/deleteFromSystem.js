const fs = require("fs");
const path = require("path");
function deleteFromSystem(place, filename){
    let dir = "";
    if(place === "thumbnail"){
        dir = "./public/thumbnails"
    }else if(place === "upload"){
        dir = "./public/uploads"
    }else{
        return "Cannot find directory!";
    }
    fs.unlink(path.join(dir, filename), (err) =>{
        if(err){
            return;
        }
    });
}


module.exports = deleteFromSystem;