var mouse = require('node_mouse_mac');
var keyboard = require('node_keyboard_mac');
var httpServer = require('http').createServer(httpHandler);
var url = require('url');
var io = require('socket.io').listen(httpServer);
var fs = require('fs');
//var mime = require('mime');

httpServer.listen(8888);

io.set('heartbeats', false);
io.set('log level', 1);

io.sockets.on('connection',function(socket) {
	//var lastmove = new Date();
	socket.on('mouseMove', function(data) {
		//var now = new Date();
		console.log(data);
		//if ((now - lastmove) > 1000) {
			mouse.moveDelta(data.dx, data.dy);
			mouse.show();
			//lastmove = now;
		//}
	});
	
	socket.on('mouseClick', function(data) {
		console.log("CLICK!");
		mouse.buttonDown();
		setTimeout(mouse.buttonUp,50);
		//mouse.buttonUp();
	});
	
	// need to add code to handle modifiers
	// (shift, ctl, alt, cmd)
	socket.on('keyPress', function(data) {
		console.log("key!");
		var code = Math.round(data.keyCode);
		if(isNaN(code))
			return;
		//keyboard.keyDown(code);
		//setTimeout(keyboard.keyUp, 50, code);
	});
});

function httpHandler(req, res) {
	var parsedUrl = url.parse(req.url, true);
	if(parsedUrl.pathname === '/') {
		parsedUrl.pathname = '/index.html';
	}
	if(fs.existsSync(__dirname + parsedUrl.pathname)) {
		// serve file
	//console.log(__dirname + parsedUrl.pathname);
		fs.readFile(__dirname + parsedUrl.pathname, function(err, data) {
			if(err) {
				res.writeHead(500);
				return res.end("Critical Error!");
			}
			//res.setHeader("Content-Type", mime.lookup(parsedUrl.pathname));
			res.writeHead(200);
			res.end(data);
		});
	} else {
		// 404
		res.writeHead(404, "Not found");
		return res.end("Not Found");
	}
}
