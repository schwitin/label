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

var file = new(static.Server)();

http.createServer(function (req, res) {
  const queryObject = url.parse(req.url,true).query;


  if (queryObject.barcode
    && queryObject.name
    && queryObject.amount
  ){
    shell.exec('./generate-label.sh ' + queryObject.barcode + ' '  + queryObject.name + ' ' + queryObject.amount)
   }

   req.addListener('end', function () {
           file.serve(req, res);
   }).resume();


}).listen(8181);


