const VALUE_MINE = -1;
const VALUE_NO_MINE = 0;
const _DEBUG_ = false;
class Minesweeper {
	constructor(pHeight, pWidth, pMineProbability) {
		this.height = pHeight;
		this.width = pWidth;
		this.mineProbability = pMineProbability;
		this.coreGenField();
		this.coreGenMines();
		this.coreGenMineCount();

		// GUI
		this.container = document.getElementById("container");
	}

	coreGenField() {
		this.field = new Array(this.width);

		for (let i = 0; i < this.width; i++) {
			this.field[i] = new Array(this.height);
		}
	}

	coreGenMines() {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				this.field[i][j] = (Math.random() < this.mineProbability) ? VALUE_MINE : VALUE_NO_MINE;
			}
		}
	}

	/**
	 * Some fancy counting things I don't understand
	 * written by: https://github.com/itzFlubby
	 */
	coreGenMineCount() {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				let mineCount = 0;
				if (this.field[i][j] === VALUE_MINE) { continue; }
				for (let k = ((i === 0) ? 0 : -1); k < ((i === (this.width - 1)) ? 1 : 2); k++) {
					for (let l = ((j === 0) ? 0 : -1); l < ((j === (this.height - 1)) ? 1 : 2); l++) {
						if ((this.field[i + k][j + l]) === VALUE_MINE) {
							mineCount++;
						}
					}
				}
				this.field[i][j] = mineCount;
			}
		}
	}

	makeRows() {
		container.style.setProperty('--grid-rows', this.height);
		container.style.setProperty('--grid-cols', this.width);
		let widthIndex = 0;
		let heightIndex = 0;
		for (let cell_count = 0; cell_count < (this.height * this.width); cell_count++) {
			let cell = document.createElement("div");
			cell.addEventListener("mouseup", this.fieldClick)
			cell.value = this.field[widthIndex][heightIndex];
			cell.index_x = widthIndex; cell.index_y = heightIndex; cell.index = cell_count;
			if (_DEBUG_) { cell.innerText = cell.value; cell.style.backgroundColor = cell.value === -1 ? "red": "light_gray"} // TODO: remove when finnisehed
			container.appendChild(cell).className = "grid-item";
			widthIndex++;
			if (widthIndex === this.width) {
				heightIndex++;
				widthIndex = 0;
			}
		}
	}

	fieldClick(e) {
		if (e.button == 0) { // Left-Click
			console.log(this.innerText);
			if(this.flag_set !== true && this.innerText === ""){
				minesweeper.revealField(this.index);
				minesweeper.checkZeroCluster(this.value, this.index_x, this.index_y);
			}
		} else if (e.button == 2) { // Right-Click
			console.log(this);
			if(this.flag_set !== true && this.innerText === ""){
				this.flag_set = true
				this.style.backgroundColor = "#0000cc";
			} else if(this.innerText === "") {
				this.flag_set = false
				this.style.backgroundColor = null;
			}
		}
	}

	revealField(index) {
		setTimeout(100)
		this.container.children[index].innerText = this.container.children[index].value === -1 ? "💣" : this.container.children[index].value;
		if (this.container.children[index].value === VALUE_MINE) {
			/**
			 * TODO: handle the boom boom bäm bitsch
			 */
			 this.container.children[index].style.backgroundColor = "red";
		} else {
			this.container.children[index].style.backgroundColor = "lime";
		}
	}

	checkZeroCluster(value, index_x, index_y) {
		if (value !== 0) {
			return;
		}
		let scan_queue = [index_x + index_y * this.height];
		let scan_index = 0;
		do {
			const scan_x = scan_queue[scan_index] % this.width;
			const scan_y = parseInt(scan_queue[scan_index] / this.height);
			for (let scan_x_offset = ((scan_x === 0) ? 0 : -1); scan_x_offset < ((scan_x === (this.width - 1)) ? 1 : 2); scan_x_offset++) {
				for (let scan_y_offset = ((scan_y === 0) ? 0 : -1); scan_y_offset < ((scan_y === (this.height - 1)) ? 1 : 2); scan_y_offset++) {
					const index = scan_x + scan_x_offset + (scan_y + scan_y_offset) * this.height;
					if ((container.children[index].value) === 0) {
						minesweeper.revealFieldsAround(index);
						if (!scan_queue.includes(index)) {
							scan_queue.push(index);
							minesweeper.revealField(index);
						}
					}
				}
			}
			scan_index++;
		} while (scan_index !== scan_queue.length);
	}

	revealFieldsAround(index) {
		const scan_x = index % this.width;
		const scan_y = parseInt(index / this.height);
		for (let scan_x_offset = ((scan_x === 0) ? 0 : -1); scan_x_offset < ((scan_x === (this.width - 1)) ? 1 : 2); scan_x_offset++) {
			for (let scan_y_offset = ((scan_y === 0) ? 0 : -1); scan_y_offset < ((scan_y === (this.height - 1)) ? 1 : 2); scan_y_offset++) {
				minesweeper.revealField(scan_x + scan_x_offset + (scan_y + scan_y_offset) * this.height);
			}
		}
	}
	beautifyGrid() {
		this.container.children[0].style.borderRadius = "1rem 0 0 0";
		this.container.children[this.width - 1].style.borderRadius = "0 1rem 0 0";
		this.container.children[this.width * (this.height - 1)].style.borderRadius = "0 0 0 1rem";
		this.container.lastChild.style.borderRadius = "0 0 1rem 0";
	}
}


let minesweeper = null;
function startGame() {
	document.addEventListener('contextmenu', event => event.preventDefault());
	minesweeper = new Minesweeper(20, 20, 0.23)
	minesweeper.makeRows()
	minesweeper.beautifyGrid()
	// gameArea.start()
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

