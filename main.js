"use strict";

function Bar(pos, size, potentialSpeed, interval) {
	this.pos = [].concat(pos);
	this.size = [].concat(size);
	this.speed = [ 0, 0 ];
	this.potentialSpeed = [].concat(potentialSpeed);
	this.interval = interval;
	this.intervalID = setInterval(() => { this.speed = [ 0, 0 ]; }, this.interval);
}
Bar.prototype.down = function () {
	clearInterval(this.intervalID);
	this.potentialSpeed.forEach((element, index, array) => {
		 this.pos[index] += element;
		 this.speed[index] = element;
	});
	this.intervalID = setInterval(() => { this.speed = [ 0, 0 ]; }, this.interval);
}
Bar.prototype.up = function () {
	clearInterval(this.intervalID);
	this.potentialSpeed.forEach((element, index, array) => {
		 this.pos[index] -= element;
		 this.speed[index] = -element;
	});
	this.intervalID = setInterval(() => { this.speed = [ 0, 0 ]; }, this.interval);
}

function Ball(pos, size, speed, interval, bars) {
	this.pos = [].concat(pos);
	this.size = [].concat(size);
	this.speed = [].concat(speed);
	this.interval = interval;
	setInterval(() => { this.move(bars) }, this.interval);
}
Ball.prototype.move = function (bars) {
	this.speed.forEach((element, index, array) => {
		 this.pos[index] += element * this.interval / 1000;
	});

	bars.forEach((element, index, array) => {
		let collision = true;
		element.pos.forEach((element2, index2, array2) => {
			let distance = element2 - this.pos[index2];
			if (collision && !(-element.size[index2] <= distance && distance <= this.size[index2])) {
				collision = false;
			}
		});
		if (collision) {
			element.speed.forEach((element2, index2, array2) => {
				this.speed[index2] = 2 * element2 - this.speed[index2];
			});
		}
	});
}

const barMargin = 10;
const barSize = [ 10, 50 ];
const barPotentialSpeed = [ 0, 20 ];
const barInterval = 500;
const ballSize = [ 10, 10 ];
const ballSpeed = [ 200, 0 ];
const ballInterval = 10;
let bars = [
	new Bar([ barMargin, (canvas.height - barSize[1]) / 2 ], barSize, barPotentialSpeed, barInterval),
	new Bar([ canvas.width - barMargin - barSize[0], (canvas.height - barSize[1]) / 2 ], barSize, barPotentialSpeed, barInterval)
];
let ball = new Ball([ (canvas.width - ballSize[0]) / 2, (canvas.height - ballSize[1]) / 2 ], ballSize, ballSpeed, ballInterval, bars);

requestAnimationFrame(function draw() {
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(255, 255, 255)";
	bars.forEach((element, index, array) => {
		ctx.fillRect(element.pos[0], element.pos[1], element.size[0], element.size[1]);
	});
	ctx.fillRect(ball.pos[0], ball.pos[1], ball.size[0], ball.size[1]);
	requestAnimationFrame(draw);
});

addEventListener("keydown", (event) => {
	switch (event.code) {
	case "KeyS":
		bars[0].down();
		break;
	case "KeyW":
		bars[0].up();
		break;
	case "ArrowDown":
		bars[1].down();
		break;
	case "ArrowUp":
		bars[1].up();
		break;
	}
});