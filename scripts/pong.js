var animate = window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var width = 800;
var height = 500;
canvas.width = width;
canvas.height = height;
var player = new Player();
var computer = new Computer();
var ball = new Ball(350, 250);

window.onload = function() {
	document.getElementById("canvasContainer").appendChild(canvas);
	animate(step);
};

var render = function() {
	context.fillStyle = "transparent";
	context.fillRect(0, 0, width, height);
	player.render();
	computer.render();
	ball.render();
};

var step = function() {
	render();
	animate(step);
};

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y; 
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

function Player() {
	this.paddle = new Paddle(25, 210, 10, 80);
}

function Computer() {
	this.paddle = new Paddle(765, 210, 10, 80);
}

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
}

Paddle.prototype.render = function() {
	context.fillStyle = "#18914A";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.render = function() {
	this.paddle.render();
};

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 1, 2 * Math.PI, false);
	context.fillStyle = "#E04747";
	context.fill();
};