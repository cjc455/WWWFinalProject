var canvasWidth;
var canvasHeight;
var game;

var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;
var NONE = 5;

function draw(){
	if(game){
		game.updateBadGuys();
		game.updateGoodGuys();
		game.updateBullets();
		game.checkDeath();
		
		socket.emit('frame', game);
	}
}

function setup(){
	noLoop();
	canvasWidth = 900;
	canvasHeight = 700;
	
	canvas = createCanvas(canvasWidth, canvasHeight);
	background('#222222');
	canvas.parent('canvas');
	frameRate(30);
}

function Game(){
	this.badGuys = [];
	this.goodGuys = [];
	this.bullets = [];
	
	for(var i=0; i<10; i++){
		this.badGuys.push(new Person(null, null));
	}
}

Game.prototype.checkDeath = function(){
	var len1 = this.badGuys.length;
	var len2 = this.goodGuys.length;
	for(var i=0; i<len1; i++){
		for(var j = 0; j<len2; j++){
			if(Math.abs(this.badGuys[i].x - this.goodGuys[j].x) < 25 && Math.abs(this.badGuys[i].y - this.goodGuys[j].y) < 25)
				noLoop();
		}
	}
}

function drawGame(game){
	var len = game.badGuys.length;
	var i = 0;
	for(i=0; i<len; i++){
		fill('#FF3B3B');
		ellipse(game.badGuys[i].x, game.badGuys[i].y, 20, 20);
	}
	
	len = game.goodGuys.length;
	for(i=0; i<len; i++){
		fill(game.goodGuys[i].color);
		ellipse(game.goodGuys[i].x, game.goodGuys[i].y, 50, 50);
	}
	
	len = game.bullets.length;
	for(i=0; i<len; ++i){
		fill('#F2F2F2');
		ellipse(game.bullets[i].x, game.bullets[i].y, 10, 10);
	}
}

Game.prototype.updateBullets = function(){
	var len = this.bullets.length;
	for(var i=0; i<len; i++){
		this.bullets[i].bulletMove();
		var x = this.bullets[i].x;
		var y = this.bullets[i].y;
		
		if(x < 0 || x > canvasWidth || y < 0 || y > canvasHeight)
		{
			this.bullets.splice(i,1);
			len--;
		}
		
		var len2 = this.badGuys.length;
		for(var j=0; j<len2; j++){
			var badGuy = this.badGuys[j];
			if(Math.abs(x - badGuy.x) < 10 && Math.abs(y - badGuy.y) < 10){
				this.badGuys.splice(j,1);
				len2--;
			}
		}
	}
}

Game.prototype.updateBadGuys = function(){
	var len = this.badGuys.length;
	for(var i=0; i<len; i++){
		this.badGuys[i].badGuyMove();
	}
}

Game.prototype.updateGoodGuys = function(){
	var len = this.goodGuys.length;
	for(var i=0; i<len; i++){
		this.goodGuys[i].goodGuyMove();
	}
}

function Person(name, color, x, y, id){
	this.id = id;
	this.name = name;
	this.color = color;
	
	var rand1 = Math.random();
	var rand2 = Math.random();
	
	if(!x && rand1 < .5)
		this.x = Math.random() * canvasWidth * .4;
	else if(!x)
		this.x = canvasWidth - Math.random() * canvasWidth * .4;
	else
		this.x = x;
	
	if(!y && rand2 < .5)
		this.y = Math.random() * canvasHeight * .4;
	else if(!y)
		this.y = canvasHeight - Math.random() * canvasHeight * .4;
	else
		this.y = y;
	
	this.dir;
}

Person.prototype.goodGuyMove = function(){
	if(this.dir == LEFT && validMove(this, LEFT))
		this.x -= 5;
	else if(this.dir == RIGHT && validMove(this, RIGHT))
		this.x += 5;
	else if(this.dir == UP && validMove(this, UP))
		this.y -= 5;
	else if(this.dir == DOWN && validMove(this, DOWN))
		this.y += 5;
}

Person.prototype.badGuyMove = function(){
	var rand = Math.random();
	var goodX = 500; var goodY = 500;
	
	if(rand > .75){
		if(this.x < goodX)
			this.x += 5;
		else
			this.x -= 5;
	}
	else if(rand > .5){
		if(this.y < goodY)
			this.y += 5;
		else
			this.y -= 5;
	}
}

function Bullet(x,y, dir){
	this.x = x;
	this.y = y;
	this.dir = dir;
}

Bullet.prototype.bulletMove = function(){
	if(this.dir == LEFT)
		this.x -= 15;
	else if(this.dir == RIGHT)
		this.x += 15;
	else if(this.dir == UP)
		this.y -= 15;
	else if(this.dir == DOWN)
		this.y += 15;
}

function validMove(person, dir){
	if(dir == LEFT && person.x > 15)
		return true;
	
	if(dir == RIGHT && person.x < (canvasWidth-15))
		return true;
	
	if(dir == UP && person.y > 15)
		return true;
	
	if(dir == DOWN && person.y < (canvasHeight-15))
		return true;
	
	return false;
}







