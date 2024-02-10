const { parentPort, workerData } = require("worker_threads");
const url = require('url');
const shell = require('shelljs');
// const static = require('node-static');

const queryObject = workerData; 

if(!queryObject.barcode){  
  throw new Error('Barcode nicht übergeben');
}

if(!queryObject.artikelnr){  
  throw new Error('Artikelnummer nicht übergeben');
}

if(!queryObject.name){  
  throw new Error('Name nicht übergeben');
}

if(!queryObject.menge){  
  throw new Error('Menge nicht übergeben');
}

if(!queryObject.me){  
  throw new Error('Mengeneinheit nicht übergeben');
}

if(!queryObject.etiketten){  
  throw new Error('Anzahl Etiketten nicht übergeben');
}

// console.log(queryObject);

// escape Sonderzeichen 
const name = queryObject.name.split("&").join("\\&").split("\"").join("\\\"");

let command ='./generate-label.sh "' 
+ queryObject.barcode + '" "' 
+ queryObject.artikelnr + '" "'  
+ name + '" "' 
+ queryObject.menge + '" "' 
+ queryObject.me + '" "' 
+ queryObject.etiketten + '"'

if (queryObject.vorlage){
  command += ' "' + queryObject.vorlage + '"'
}
shell.exec(command);


parentPort.postMessage(queryObject);