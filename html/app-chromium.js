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

const indexUrl = 'file:///home/stalker/Development/etikett/html/index.html';

const puppeteer = require('puppeteer-core');


var file = new(static.Server)();

var queryObjects = [];

let page;
startBrowser();
// console.log(page);
  

// Wir starten die Endlosschleife, die 
// alle angekommenen Aufträge druckt
printIncoming();


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
      // und geben die in der URL angeforderte Datei zurück
      // Der Browser wartet bis der Auftrag fertig ist.
      print(queryObject);
      req.addListener('end', function () {
        file.serve(req, res);
      }).resume();
    }else{
      // Wir merken den aktuellen Auftrag und geben sofort
      // HTTP 200 zurück. 
      queryObjects.push(queryObject);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end();
    }
  }else{
    res.writeHead(400);
    res.end();
  }

}).listen(8181);


async function printIncoming(){
  while(true){ 
    for (var i = 0; i < queryObjects.length; i++) {
      let queryObject = queryObjects[i];
      queryObjects.shift();
      print(queryObject);
      await sleep(3000);
    }
    await sleep(500);
  }
}

async function startBrowser(){
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium'});
  page = await browser.newPage();
  console.log(page);
  // return page;
  // await page.goto(indexUrl);
}

async function html2png(){
  console.time("html2png");
  await page.goto(indexUrl);
  await page.screenshot({path: 'screenshot.png'});
  console.timeEnd("html2png");
}


function print(queryObject){    
  const name = queryObject.name.replace("&", "\\&").replace("\"", "\\\"");
  const command ='./generate-label.sh "' + queryObject.barcode + '" "' + queryObject.artikelnr + '" "'  + name + '" "' + queryObject.menge + '" "' + queryObject.me + '" "' + queryObject.etiketten + '"'
  console.log(command)
  shell.exec(command)
  html2png();
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



