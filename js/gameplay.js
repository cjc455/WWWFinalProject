var canvasWidth;
var canvasHeight;
var game;
var img;

var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;
var NONE = 5;
var ticks = 0;
var waves = 1;

function draw(){
	if(game){
		if(ticks == 300){
			ticks = 0;
			waves++;
			game.createBadGuys(waves * 5);
		}
		game.updateBadGuys();
		game.updateGoodGuys();
		game.updateBullets();
		game.checkDeath();
		
		ticks++;
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
		this.badGuys.push(new Person(null, null, null, null, null));
	}
}

Game.prototype.createBadGuys = function(num){
	for(var i=0; i<num; i++){
		this.badGuys.push(new Person(null, null, null, null, null));
	}
}

Game.prototype.checkDeath = function(){
	var len1 = this.badGuys.length;
	for(var i=0; i<len1; i++){
		for(var j = 0; j< this.goodGuys.length; j++){
			if(this.goodGuys[j].alive == true && Math.abs(this.badGuys[i].x - this.goodGuys[j].x) < 15 && Math.abs(this.badGuys[i].y - this.goodGuys[j].y) < 15){
				this.goodGuys[j].alive = false;
			}
		}
	}
	
	for(var i=0; i<this.goodGuys.length; i++){
		if(this.goodGuys[i].alive == true)
			break;
		else{
			if(i == this.goodGuys.length-1){
				noLoop();
				socket.emit('gameOver', (waves-1)*10 + ticks/30);
			}
		}
	}
}

function drawGame(game){
	var len = game.badGuys.length;
	var i = 0;
	for(i=0; i<len; i++){
		fill('#FF3B3B');
		ellipse(game.badGuys[i].x, game.badGuys[i].y, 15, 15);
	}
	
	len = game.goodGuys.length;
	for(i=0; i<len; i++){
		if(game.goodGuys[i].alive == true){
			fill(game.goodGuys[i].color);
			ellipse(game.goodGuys[i].x, game.goodGuys[i].y, 30, 30);
		}
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
	this.alive = true;
	
	var rand = Math.random()
	
	if(x)
		this.x = x;
	else{
		if(rand > .75)
			this.x = 0;
		else if(rand > .5)
			this.x = canvasWidth;
		else
			this.x = canvasWidth * Math.random();
	}
	
	if(y)
		this.y = y;
	else{
		if(rand < .25)
			this.y = 0;
		else if(rand <= .5)
			this.y = canvasHeight;
		else
			this.y = canvasHeight * Math.random();
	}
	
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
	
	var len = game.goodGuys.length;
	var min = Math.sqrt(Math.pow(game.goodGuys[0].x - this.x, 2) + Math.pow(game.goodGuys[0].y - this.y, 2));
	var index = 0;
	for(var i=1; i < len; i++){
		var goodGuy = game.goodGuys[i];
		if(goodGuy.alive == true){
			var dist = Math.sqrt(Math.pow(goodGuy.x - this.x, 2) + Math.pow(goodGuy.y - this.y, 2));
			if(dist < min){
				index = i;
				min = dist;
			}
		}
	}
	
	var goodX = game.goodGuys[index].x;
	var goodY = game.goodGuys[index].y;
	
	if(rand > .5){
		if(this.x < goodX)
			this.x += 3;
		else
			this.x -= 3;
	}
	else{
		if(this.y < goodY)
			this.y += 3;
		else
			this.y -= 3;
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
	if(dir == LEFT && person.x > 25)
		return true;
	
	if(dir == RIGHT && person.x < (canvasWidth-25))
		return true;
	
	if(dir == UP && person.y > 25)
		return true;
	
	if(dir == DOWN && person.y < (canvasHeight-25))
		return true;
	
	return false;
}







