var animate = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 500;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var playerScore = 0;
var computerScore = 0;
var player = new Player();
var computer = new Computer();
var ball = new Ball(397.5, 247.5);

window.onload = function() {
	document.getElementById("canvasContainer").appendChild(canvas);
	animate(step);
};

var render = function() {
	context.fillStyle = "black";
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
	computer.update(ball);
	ball.update(player.paddle, computer.paddle);
};

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y; 
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
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

function Player() {
	this.paddle = new Paddle(765, 210, 10, 80);
}

Player.prototype.render = function() {
	this.paddle.render();
};

Player.prototype.update = function() {
	for (var key in keysDown) {
		var value = Number(key);
		if (value === 38) {
			this.paddle.move(0, -4); // up arrow
		} else if (value === 40) {
			this.paddle.move(0, 4); // down arrow
		} else {
			this.paddle.move(0, 0);
		}
	}
};

function Computer() {
	this.paddle = new Paddle(25, 210, 10, 80);
}

Computer.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.update = function(ball) {
	var yPos = ball.y;
	var diff = -((this.paddle.y + (this.paddle.height / 2)) - yPos);
	
	if (diff < 0 && diff < -4) {
		diff = -4;
	} else if (diff > 0 && diff > 4) {
		diff = 4;
	}
	
	this.paddle.move(0, diff);
	
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > 500) {
		this.paddle.y = 500 - this.paddle.height;
	}
};

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 3;
	this.y_speed = 0;
	this.radius = 5;
}

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 1, 2 * Math.PI, false);
	context.fillStyle = "#E04747";
	context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if (this.y - 5 < 0) { // hitting top wall
		this.y = 5;
		this.y_speed = -this.y_speed;
	} else if (this.y + 5 > 500) { // hitting bottom wall
		this.y = 495;
		this.y_speed = -this.y_speed;
	}
	
	if (this.x < 0 || this.x > 800) {
		if (this.x < 0) {
			this.x_speed = -3;
			this.y_speed = 0;
			playerScore ++;
			document.getElementById("playerScore").innerHTML = playerScore;
			if (playerScore === 11) {
				window.alert("You Won! Would you like to play again?");
				resetScore();
			}
		} else if (this.x > 800) {
			this.x_speed = 3;
			this.y_speed = 0;
			computerScore ++;
			document.getElementById("computerScore").innerHTML = computerScore;
			if (computerScore === 11) {
				window.alert("You Lost! Would you like to play again?");
				resetScore();
			}
		}
		this.x = 397.5;
		this.y = 247.5;
	}
	
	if (top_x > 400) {
		if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
			this.x_speed = -5;
			this.y_speed += (paddle1.y_speed / 2);
			this.x += this.x_speed;
		}
	} else {
		if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
			this.x_speed = 5;
			this.y_speed += (paddle2.y_speed / 2);
			this.x += this.x_speed;
		}
	}
}

function resetScore() {
	playerScore = 0;
	computerScore = 0;
	document.getElementById("playerScore").innerHTML = playerScore;
	document.getElementById("computerScore").innerHTML = computerScore;
}

var keysDown = {};

window.addEventListener("keydown", function(event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});