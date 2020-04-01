'use strict'

console.time('starting');
console.clear();

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<h1>Server: Hi Vadik</h1>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
  console.log('running server pid:', process.pid);
  console.log('MODE:', process.env.MODE_ENV);
});

console.timeEnd('starting');
