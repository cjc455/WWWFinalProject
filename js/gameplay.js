var canvasWidth;
var canvasHeight;
var game;

function draw(){
	clear();
	background('#222222');
	game.updateBadGuys();
	game.drawGame();
}

function setup(){
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	
	canvas = createCanvas(canvasWidth, canvasHeight);
	background('#222222');
	canvas.parent('canvas');
	frameRate(30);
	
	game = new Game();
}

function Game(){
	this.badGuys = [];
	this.goodGuys = [new Person(canvasWidth/2, canvasHeight/2)];
	
	for(var i=0; i<20; i++){
		this.badGuys.push(new Person(null, null));
	}
}

Game.prototype.drawGame = function(){
	var len = this.badGuys.length;
	for(var i=0; i<len; i++){
		fill('#FF3B3B');
		ellipse(this.badGuys[i].x, this.badGuys[i].y, 20, 20);
	}
	
	len = this.goodGuys.length;
	for(var i=0; i<len; i++){
		fill('#51FF2E');
		ellipse(this.goodGuys[i].x, this.goodGuys[i].y, 50, 50);
	}
}

Game.prototype.updateBadGuys = function(){
	var len = this.badGuys.length;
	for(var i=0; i<len; i++){
		this.badGuys[i].update(this.goodGuys[0].x, this.goodGuys[0].y);
	}
}

function Person(x,y){
	if(!x)
		this.x = Math.random() * canvasWidth;
	else
		this.x = x;
	
	if(!y)
		this.y = Math.random() * canvasHeight;
	else
		this.y = y;
}

Person.prototype.update = function(goodX, goodY){
	var rand = Math.random();
	
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