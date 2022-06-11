const VALUE_MINE = -1;
const VALUE_NO_MINE = 0;
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
				this.field[i][j] = (Math.random() > this.mineProbability) ? VALUE_MINE : VALUE_NO_MINE;
			}
		}
	}

	coreGenMineCount() {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				let mineCount = 0;
				if (this.field[i][j] === VALUE_MINE) { continue; }
				if ((i !== 0 && j !== 0) && (i !== (this.width - 1) && j !== (this.height - 1))) {
					for (let k = 0; k < 3; k++) {
						for (let l = 0; l < 3; l++) {
							if ((this.field[i - 1 + k][j - 1 + l]) === VALUE_MINE) {
								mineCount++;
							}
						}
					}
				} else {
					// TODO : edge-cases
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
		for (let c = 0; c < (this.height * this.width); c++) {
		  let cell = document.createElement("div");
		  widthIndex++;
		  if (widthIndex === (this.width - 1)) {
			heightIndex++;
			widthIndex = 0;
		  }
		  cell.innerText = this.field[widthIndex][heightIndex];
		  container.appendChild(cell).className = "grid-item";
		};
	  };

}

let minesweeper = null;
function startGame() {
	minesweeper = new Minesweeper(20, 20, 0.5)
	minesweeper.makeRows()
	console.log("It works")
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

