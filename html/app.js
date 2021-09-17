#!/usr/bin/env node

// https://www.npmjs.com/package/node-static
// https://nodejs.org/en/knowledge/HTTP/servers/how-to-serve-static-files/
// https://stackoverflow.com/questions/44647778/how-to-run-shell-script-file-using-nodejs
// https://nodejs.org/en/knowledge/HTTP/clients/how-to-access-query-string-parameters/
// https://www.npmjs.com/package/shelljs

const http = require('http');
const url = require('url');
const shell = require('shelljs')
const static = require('node-static');

// phantomjs
// sudo npm -i --save file-url
// var fileUrl = require('file-url');
// console.log(fileUrl('template.html'));


var file = new(static.Server)();

var queryObjects = [];

// Wir starten die Endlosschleife, die 
// alle angekommenen Aufträge druckt
printIncoming();
var isPrinting = false;
var log = '';


http.createServer(function (req, res) {
  const queryObject = url.parse(req.url,true).query; 
  
  if (queryObject.barcode
    && queryObject.artikelnr
    && queryObject.name
    && queryObject.menge
    && queryObject.me
    && queryObject.etiketten
  ){    
    if (queryObject.debug){
      // wir drucken den aktuellen Auftrag
      // und geben die im vorherigen Request generierte Datei zurück
      print(queryObject);
      req.addListener('end', function () {
        file.serve(req, res);
      }).resume();
    }else{
      // Wir merken den aktuellen Auftrag und geben sofort
      // HTTP 200 zurück. 
      queryObjects.push(queryObject);
      res.writeHead(200, {'Content-Type': 'text/html'});
      if(queryObject.log){
        res.write(log);
      }else{
        log = '';
      }
      res.end();
    }
  }else{
    res.writeHead(400);
    res.end();
  }

}).listen(8181);


async function printIncoming(){
  while(true){
    await sleep(500);
    if (isPrinting){
      continue;
    }
    const queryObject = queryObjects.shift();
    if (queryObject){
      print(queryObject);
    }    
  }
}


function print(queryObject){
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
  
  isPrinting = true;
  shell.exec(command,  {silent:true}, function(code, stdout, stderr) {
    log = log.concat('<br>======= COMMAND =============<br>').concat(command).replace(/(?:\r\n|\r|\n)/g, '<br>');
    log = log.concat('<br>======= EXITCODE ============<br>').concat(code).replace(/(?:\r\n|\r|\n)/g, '<br>');
    log = log.concat('<br>======= STDOUT ==============<br>').concat(stdout).replace(/(?:\r\n|\r|\n)/g, '<br>');
    log = log.concat('<br>======= STDERR ==============<br>').concat(stderr).replace(/(?:\r\n|\r|\n)/g, '<br>');    
    isPrinting = false;
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



