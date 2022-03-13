const keycodes = {
	alt: 18,
	tab: 9,
	shift: 16,
	enter: 13,
	ctrl: 17,
	home: 36,
	page_down: 34,
	end: 35,
	escape: 27,
	page_up: 33,
	caps_lock: 20,
	pause: 19,
	backspace: 8,
	delete: 46,
	right_arrow: 39,
	down_arrow: 40,
	left_arrow: 37,
	up_arrow: 38,
	insert: 45,
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	select_key: 93,
	left_window_key: 91,
	right_window_key: 92,
	numpad_0: 96,
	numpad_1: 97,
	numpad_2: 98,
	numpad_3: 99,
	numpad_4: 100,
	numpad_5: 101,
	numpad_6: 102,
	numpad_7: 103,
	numpad_8: 104,
	numpad_9: 105,
	multiply: 106,
	divide: 111,
	decimal_point: 110,
	add: 107,
	subtract: 109,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	single_quote: 222,
	close_bracket: 221,
	open_bracket: 219,
	back_slash: 220,
	equal_sign: 187,
	comma: 188,
	dash: 189,
	period: 190,
	forward_slash: 191,
	grave_accent: 192,
	num_lock: 144,
	scroll_lock: 145,
	semi_colon: 186,
	space: 32
}

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
		if (eventObject.keyCode === keycodes.space && isGameOver) {
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
