GameOfLife_CellStates = {
    0: "DEAD",
    1: "ALIVE",
    "ALIVE": 1,
    "DEAD": 0,
};
Object.preventExtensions(GameOfLife_CellStates);

class GameOfLife {
    constructor(rows, cols) {
        this.rows = rows || 10;
        this.cols = cols || 10;
        this.cells = null;
        this.cellsNextTurn = null;
        this.isNextTurnPossible = true;
        this.round = 0;
        this.initArrays(this.rows, this.cols);
    }
    initArrays(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.round = 0;
        this.cells = [];
        this.cellsNextTurn = [];

        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            this.cellsNextTurn[row] = [];

            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col] = 0;
                this.cellsNextTurn[row][col] = 0;
            }
        }
    }
    randomizeArray(rows, cols) {
        this.initArrays(rows, cols);

        let rand;
        for (let row=0; row < this.rows; row++) {
            for (let col=0; col < this.cols; col++) {
                rand = Math.round(Math.random() * Math.random());
                if (rand) {
                    this.cells[row][col] = GameOfLife_CellStates["ALIVE"];
                }
            }
        }

        this.round = 1;
    }
    calculateNextTurn () {
        for (let r=0; r < this.cells.length; r++) {
            for (let c=0; c < this.cells[r].length; c++) {
                let aliveNeighboursCounter = 0;

                // neighbours above
                if (r-1 >= 0) {
                    // top left
                    if (c-1 >= 0 && this.cells[r-1][c-1] == GameOfLife_CellStates["ALIVE"]) {
                        aliveNeighboursCounter++;
                    }
                    // top middle
                    if (this.cells[r-1][c] == 1) {
                        aliveNeighboursCounter++;
                    }
                    // top right
                    if (c+1 < this.cells[r-1].length && this.cells[r-1][c+1] == GameOfLife_CellStates["ALIVE"]) {
                        aliveNeighboursCounter++;
                    }
                }

                // neighbours in the middle
                if (c-1 >= 0 && this.cells[r][c-1] == GameOfLife_CellStates["ALIVE"]) {
                    aliveNeighboursCounter++;
                }
                if (c+1 < this.cells[r].length && this.cells[r][c+1] == GameOfLife_CellStates["ALIVE"]) {
                    aliveNeighboursCounter++;
                }

                // neighbours below
                if (r+1 < this.cells.length) {
                    // bottom left
                    if (c-1 >= 0 && this.cells[r+1][c-1] == GameOfLife_CellStates["ALIVE"]) {
                        aliveNeighboursCounter++;
                    }
                    // bottom middle
                    if (this.cells[r+1][c] == GameOfLife_CellStates["ALIVE"]) {
                        aliveNeighboursCounter++;
                    }
                    // bottom right
                    if (c+1 < this.cells[r+1].length && this.cells[r+1][c+1] == GameOfLife_CellStates["ALIVE"]) {
                        aliveNeighboursCounter++;
                    }
                }

                let currCellState = this.cells[r][c];
                let newCellState;
                // any live cell with 0-1 neighbours dies from underpopulation
                // any live cell with 4 or more neighbours dies from overcrowding
                // any live cell with two or three neighbours stays alive
                // any blank cell with exactly three live neighbours becomes a new live cell
                if (currCellState == GameOfLife_CellStates["DEAD"] && aliveNeighboursCounter == 3) {
                    newCellState = GameOfLife_CellStates["ALIVE"];
                } else if (currCellState == GameOfLife_CellStates["ALIVE"] && (aliveNeighboursCounter === 2 || aliveNeighboursCounter === 3)) {
                    newCellState = GameOfLife_CellStates["ALIVE"];
                } else {
                    newCellState = GameOfLife_CellStates["DEAD"];
                }

                this.cellsNextTurn[r][c] = newCellState;
            }
        }
    }
    isNextRoundTheSameAsPrevious() {
        for (let row=0; row < this.cells.length; row++) {
            for (let col=0; col < this.cells[row].length; col++) {
                if (this.cells[row][col] !== this.cellsNextTurn[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
    endTurn() {
        if (this.cellsNextTurn === void 0) { return; }
        
        this.cells = [];

        for (let row=0; row < this.cellsNextTurn.length; row++) {
            this.cells[row] = [];
            for (let col=0; col < this.cellsNextTurn[row].length; col++) {
                this.cells[row][col] = this.cellsNextTurn[row][col];
            }
        }

        this.round++;
    }
}