var mouse = require('node_mouse_mac');
var httpServer = require('http').createServer(httpHandler);
var url = require('url');
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8888);

io.sockets.on('connection',function(socket) {
	socket.on('mouseMove', function(data) {
		mouse.show();
		mouse.moveDelta(data.dx, data.dy);
	});
});

function httpHandler(req, res) {
	var parsedUrl = url.parse(req.url, true);
	if(fs.existSync(__dirname + parsedUrl.pathname)) {
		// serve file
		fs.readFile(__dirname + parsedUrl.pathname, function(err, data) {
			if(err) {
				res.writeHead(500);
				return res.end("Critical Error!");
			}
			res.writeHead(200);
			res.end(data);
		});
	} else {
		// 404
		res.writeHead(404, "Not found");
		return res.end("Not Found");
	}
}
