var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var path = require('path');
var fs = require('fs');
var port = 8080;

function handler(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/game.html';
  }
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // Now read and write back the file with the appropriate content type
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Dynamically setting content type
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

app.listen(port, function() {
    console.log("Running on port: " + port);
});

var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;
var NONE = 5;

var canvasWidth = 900;
var canvasHeight = 700;

function Game(){
	this.goodGuys = [];
	this.badGuys = [];
	this.bullets = [];
}

function Person(name, x, y, id){
	this.id = id;
	this.name = name;
	this.color = colors[colorID];
	colorID++;
	this.x = x;
	this.y = y;
	this.dir = NONE;
}

function Bullet(x,y, dir){
	this.x = x;
	this.y = y;
	this.dir = dir;
}

var game = new Game();
var hostID;
var colorID = 0;
var colors = ['#51FF2E', '#FFB71C', '#1CE1FF', '#FFFC40'];

io.on("connection", function(socket) {
    console.log("A user (" + socket.id + ") connected");
	
	socket.on('addPlayer', function(name){
		var numPlayers = game.goodGuys.length;
		var row = numPlayers % 4;
		var col = numPlayers / 4;
		
		var player = new Person(name, canvasWidth/3 + row*50, canvasHeight/3 + col*50, socket.id);
		game.goodGuys.push(player);
		io.emit('addPlayer', game.goodGuys);
		
		
		if (game.goodGuys.length == 1 || name == "Tyler"){
			hostID = socket.id;
            io.to(socket.id).emit("isHost");
		}
	});
	
	socket.on('gameStart', function(){
		io.emit('clearScreen');
		io.to(hostID).emit('hostStart', game.goodGuys);
	});
	
	socket.on('frame', function(clientGame){
		io.emit('drawGame', clientGame);
	});
	
	socket.on('keyPress', function(dir){
		var len = game.goodGuys.length;
		for(var i=0; i<len; i++){
			if(game.goodGuys[i].id == socket.id){
				io.to(hostID).emit('keyPress', i, dir);
				break;
			}
		}
	});
	
	socket.on('bullet', function(dir){
		var len = game.goodGuys.length;
		for(var i=0; i<len; i++){
			if(game.goodGuys[i].id == socket.id){
				io.to(hostID).emit('bullet', i, dir);
				break;
			}
		}
	});
});



