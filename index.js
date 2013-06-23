var mouse = require('node_mouse_mac');
var httpServer = require('http').createServer(httpHandler);
var url = require('url');
var io = require('socket.io').listen(httpServer);
var fs = require('fs');

httpServer.listen(8888);

io.sockets.on('connection',function(socket) {
	socket.on('mouseMove', function(data) {
		//console.log(data);
		mouse.moveDelta(data.dx, data.dy);
		mouse.show();
	});
	
	socket.on('mouseClick', function(data) {
		//console.log("CLICK!");
		mouse.buttonDown();
		setTimeout(mouse.buttonUp,50);
		//mouse.buttonUp();
	});
});

function httpHandler(req, res) {
	var parsedUrl = url.parse(req.url, true);
	if(parsedUrl.pathname === '/') {
		parsedUrl.pathname = '/index.html';
	}
	if(fs.existsSync(__dirname + parsedUrl.pathname)) {
		// serve file
	console.log(__dirname + parsedUrl.pathname);
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
