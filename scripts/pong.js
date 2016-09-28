var animate = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 500;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
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
	update();
	render();
	animate(step);
};

var update = function() {
	player.update();
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
	this.paddle = new Paddle(765, 210, 10, 80);
}

function Computer() {
	this.paddle = new Paddle(25, 210, 10, 80);
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

Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	
	if (this.y < 0) {
		this.y = 0;
		this.y_speed = 0;
	} else if (this.y + this.height > 500) {
		this.y = 500 - this.height;
		this.y_speed = 0;
	}
};

Player.prototype.render = function() {
	this.paddle.render();
};

Player.prototype.update = function() {
	for (var key in keysDown) {
		var value = Number(key);
		if (value == 38) {
			this.paddle.move(0, -4); // up arrow
		} else if (value == 40) {
			this.paddle.move(0, 4); // down arrow
		} else {
			this.paddle.move(0, 0);
		}
	}
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

var keysDown = {};

window.addEventListener("keydown", function(event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});