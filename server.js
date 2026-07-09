const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = Number(process.env.PORT || 8080);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

const server = http.createServer((request, response) => {
  let url = decodeURIComponent(request.url.split('?')[0]);
  if (url === '/' || url === '') url = '/index.html';

  const filePath = path.join(root, url);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, '404.html'), (notFoundError, notFoundData) => {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(notFoundData || 'Not found');
      });
      return;
    }

    response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log(`Local server: http://localhost:${port}`);
});
