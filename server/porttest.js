var http = require('http');
const port = 3000;

var server = http.createServer(function (req, res) {
  res.end('test');
});

server.on('listening', function () {
  console.log('ok, server is running on port ', port);
});

server.listen(port);