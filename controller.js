const fs = require('fs');
function addControllers(router,dir){
    let files = fs.readdirSync(__dirname + dir);
    let myfiles =  files.filter((item)=>{
        let test = item.substring(item.lastIndexOf('.'));
        if(test === '.js'){
            return true;
        }
        else{
            return false;
        }
    })
    
    myfiles.forEach( file => {
        console.log(`process controller: ${file}...`);
        let mapping = require(__dirname + dir + '/' + file);
        addmappings(mapping,router);
    })
}

function addmappings(mapping,router){
    for(let url in mapping){
        let path = url.substring( url.lastIndexOf(' ') + 1);
        if(url.startsWith('GET')){
            router.get(path, mapping[url])
        }
        else if(url.startsWith('POST')){
            router.post(path,mapping[url])
        }
        else {
            console.log('not used');
        }
    }
}

module.exports = function(dir){
    let controller_dir = dir || '/controllers';
    let router = require('koa-router')();
    addControllers(router, controller_dir);
    return router.routes();
}