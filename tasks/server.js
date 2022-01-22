// Importing necessary modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Port on which the server will create
const PORT = 8080;

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'application/font-sfnt',
};

// Creating a server and listening at port 1800
http
  .createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const rawpath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
    const sanitizePath = path.normalize(rawpath).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname + '/../public', sanitizePath);

    if (!fs.existsSync(pathname)) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
    } else {
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error in getting the file.`);
        } else {
          const ext = path.parse(pathname).ext;
          res.setHeader('Content-type', mimeType[ext] || 'text/plain');
          res.end(data);
        }
      });
    }
  })
  .listen(PORT);

console.log(`Server listening on port http://localhost:${PORT}`);
