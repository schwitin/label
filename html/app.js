const express = require("express");
const { Worker } = require("worker_threads");
const shell = require('shelljs');
const url = require('url');
const fs = require('fs');

const app = express();
const port = 8181;
const pathToLabels = '/run/user/1000';

// Verzeichnis mit generierten Dateien freigeben
app.use(express.static(pathToLabels));

// update
shell.exec('git pull');

// Alle notwendigen Rersourcen in das Zielverzeichmis (RAM fs) kopiern
fs.copyFile('JsBarcode.code128.min.js', `${pathToLabels}/JsBarcode.code128.min.js`, (err) => {if(err){throw err}});
fs.copyFile('etikett_mit_logo.html', `${pathToLabels}/etikett_mit_logo.html`, (err) => {if(err){throw err}});
fs.copyFile('etikett_ohne_logo.html', `${pathToLabels}/etikett_ohne_logo.html`, (err) => {if(err){throw err}});
fs.copyFile('DejaVuSans-Bold.ttf', `${pathToLabels}/DejaVuSans-Bold.ttf`, (err) => {if(err){throw err}});
fs.copyFile('logo.png', `${pathToLabels}/logo.png`, (err) => {if(err){throw err}});
fs.copyFile('impex-trading.svg', `${pathToLabels}/impex-trading.svg`, (err) => {if(err){throw err}});

// Generiert Etikett(en) in einem sparaten Thread
app.get("/index.png", async (req, res) => {
  const queryObject = url.parse(req.url,true).query; 
  // console.log(queryObject);
  const worker = new Worker("./worker.js", {workerData:queryObject});
  worker.on("message", (data) => {
    res.status(200).send('');
  });
  worker.on("error", (msg) => {
    console.log(msg);
    res.status(400).send(`${msg}`);
  });
});


// Zeigt letzte 50 Logmeldungen
app.get("/log", async (req, res) => {
  
  const command = "journalctl --unit=label.service -n 50 --no-pager"
  
  shell.exec(command,  {silent:true}, function(code, stdout, stderr) {
    const response = "<html><body><pre>" + stdout + "</pre></body></html>"
    res.status(200).send(response);
  });
});


// Zeigt generierte label Dateien als Links
app.get("/ls", async (req, res) => {
  
  const command = `find ${pathToLabels} -name "label-*" -printf "<a href='%f'>%f</a><br>" 2>/dev/null`
  
  shell.exec(command,  {silent:true}, function(code, stdout, stderr) {
    const response = "<html><body><pre>" + stdout + "</pre></body></html>"
    res.status(200).send(response);
  });
});


// Startet label.service neu
app.get("/restart", async (req, res) => {
  
  const command = `sudo systemctl restart label.service`
  
  shell.exec(command,  {silent:true}, function(code, stdout, stderr) {
    const response = "<html><body><pre>" + stdout + " " + stderr + "</pre></body></html>"
    res.status(200).send(response);
  });
});

// Startet rpi neu
app.get("/reboot", async (req, res) => {  
  const command = `sudo reboot`
  shell.exec(command);
});

// Startet fährt rpi herunter
app.get("/halt", async (req, res) => {  
  const command = `sudo halt`
  shell.exec(command);
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});