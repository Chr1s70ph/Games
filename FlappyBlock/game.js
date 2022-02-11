const OBSTACLE_MOVE_SPEED_MODIFIER = 3
const PLAYERMOVE_SPEED_MODIFIER = 3

var obstacles = []
var player
var Score
var isGameOver

function startGame() {
	isGameOver = false
	player = new component(30, 20, "#CC3030", 20, 105)
	Score = new component("30px", "Sans-Serif", "#000000", 15, 30, "text")
	gameArea.start()
}

var gameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		this.canvas.width = 1000
		this.canvas.height = 500
		this.context = this.canvas.getContext("2d")
		document.body.children[2].appendChild(this.canvas, document.body.childNodes[0])
		this.frameNo = 0
		this.interval = setInterval(refreshGame, 10)
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	stop: function () {
		clearInterval(this.interval)
	}
}

function component(width, height, color, x_cord, y_cord, type) {
	this.type = type
	this.width = width
	this.height = height
	this.speed_x = 0
	this.speed_y = 0
	this.x_cord = x_cord
	this.y_cord = y_cord
	this.update = function () {
		ctx = gameArea.context
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height
			ctx.fillStyle = color
			ctx.fillText(this.text, this.x_cord, this.y_cord)
		} else {
			ctx.fillStyle = color
			ctx.fillRect(this.x_cord, this.y_cord, this.width, this.height)
		}
	}
	this.newPos = function () {
		this.x_cord += this.speed_x
		this.y_cord += this.speed_y
	}
	this.intersects = function (object) {
		return !(
			object.x_cord > this.x_cord + this.width ||
			object.x_cord + object.width < this.x_cord ||
			object.y_cord > this.y_cord + this.height ||
			object.y_cord + object.height < this.y_cord
		)
	}
	this.outOfBouns = function () {
		return (
			this.y_cord > gameArea.canvas.height ||
			this.y_cord < 0 ||
			this.x_cord < 0 ||
			this.x_cord + this.width > gameArea.canvas.width
		)
	}
}

function refreshGame() {
	var x, height, gap, minHeight, maxHeight, minGap, maxGap

	gameArea.clear()
	gameArea.frameNo += 1
	if (gameArea.frameNo == 1 || everyInterval(300 / OBSTACLE_MOVE_SPEED_MODIFIER)) {
		x = gameArea.canvas.width
		minHeight = 20
		maxHeight = 200
		height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
		minGap = 50
		maxGap = 200
		gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)
		obstacles.push(new component(30, height, "#50FF50", x, 0))
		obstacles.push(new component(30, x - height - gap, "#50FF50", x, height + gap))
	}

	for (item in obstacles) {
		if (player.outOfBouns() || player.intersects(obstacles[item])) {
			isGameOver = true
			gameOver(isGameOver)
			break
		}
		// Delete Obstacles that are off the screen
		if (obstacles[item].x_cord < -obstacles[item].width) obstacles.shift()

		// Move Obstacles
		obstacles[item].x_cord -= 1 * OBSTACLE_MOVE_SPEED_MODIFIER
		obstacles[item].newPos()
		obstacles[item].update()
	}

	/*Update Score*/
	Score.text = `SCORE: ${gameArea.frameNo}`
	Score.update()
	/*Update Player*/
	player.newPos()
	player.update()
}

function everyInterval(n) {
	if ((gameArea.frameNo / n) % 1 == 0) {
		return true
	}
	return false
}

function gameOver(isGameOver) {
	gameArea.stop()
	for (const item in obstacles) delete obstacles[item]
	player = null
	gameArea.clear()

	ctx.fillStyle = "red"
	gameArea.context.textAlign = "center"
	gameArea.context.fillText(
		`Game Over`,
		gameArea.canvas.width / 2,
		gameArea.canvas.height / 2.5
	)
	ctx.fillStyle = "black"
	gameArea.context.fillText(
		`Your Score: ${gameArea.frameNo}`,
		gameArea.canvas.width / 2,
		gameArea.canvas.height / 2
	)
	gameArea.context.fillText(
		`Press Space to restart`,
		gameArea.canvas.width / 2,
		gameArea.canvas.height / 1.4
	)

	return $(document).keydown(function (eventObject) {
		if (eventObject.keyCode === 32 && isGameOver) {
			isGameOver = false
			return startGame()
		}
	})
}

function moveleft() {
	player.speed_x = -1 * PLAYERMOVE_SPEED_MODIFIER
}

function moveup() {
	player.speed_y = -1 * PLAYERMOVE_SPEED_MODIFIER
}

function moveright() {
	player.speed_x = 1 * PLAYERMOVE_SPEED_MODIFIER
}

function movedown() {
	player.speed_y = 1 * PLAYERMOVE_SPEED_MODIFIER
}

function clearmoveup() {
	player.speed_y = 0
}

function clearmoveside() {
	player.speed_x = 0
}

function clearmove() {
	player.speed_x = 0
	player.speed_y = 0
}
