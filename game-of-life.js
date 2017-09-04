let GAME = {
    gameOfLife: null,

    settings: {
        "rows": 25,
        "cols": 25,
        "fps": 1,
        "cellsize": 10,
        "cellAliveBgColor": "#3d3d3d",
        "cellBorderColor": "#cccccc"
    },

    init: function() {
        GAME.setUIButtons();
        GAME.setCanvas();
        GAME.setSettingsHandles();
        GAME.setSettings();
        GAME.resetCanvasSize();
        GAME.setCanvasClickListener.call(this);
        GAME.roundCounterEl = document.querySelector("#roundCounter");
        GAME.roundCounterEl.innerHTML = 0;
        GAME.gameOfLife = new GameOfLife(GAME.settings.rows, GAME.settings.cols);
        GAME.drawGrid();
    },
    // actions for menu
    setUIButtons: function () {
        GAME.btnDraw = document.querySelector("#btnDraw");
        GAME.btnDrawRandom = document.querySelector("#btnDrawRandom");
        GAME.btnStop = document.querySelector("#btnStop");
        GAME.btnStart = document.querySelector("#btnStart");
        GAME.btnNextRound = document.querySelector("#btnNextRound");
    },
    setCanvas: function () {
        GAME.canvas = document.querySelector("#gameboard");
        GAME.ctx = GAME.canvas.getContext("2d");
    },
    setSettingsHandles: function () {
        GAME.rowsInput = document.querySelector("#rowsInput");
        GAME.colsInput = document.querySelector("#colsInput");
        GAME.fpsInput = document.querySelector("#fpsInput");
        GAME.cellsizeInput = document.querySelector("#cellsizeInput");
    },
    setSettings: function () {
        GAME.settings.rows = +GAME.rowsInput.value;
        if (GAME.settings.rows < 5) {
            GAME.settings.rows = 5;
        }
        GAME.settings.cols = +GAME.colsInput.value;
        if (GAME.settings.cols < 5) {
            GAME.settings.cols = 5;
        }
        GAME.settings.cellsize = +GAME.cellsizeInput.value;
        if (GAME.settings.cellsize < 5)  {
            GAME.settings.cellsize = 5;
        }
        GAME.readFpsSetting();
    },
    readFpsSetting: function () {
        GAME.settings.fps = +GAME.fpsInput.value;
        if (GAME.settings.fps < 1) {
            GAME.settings.fps = 1;
        } else if (GAME.settings.fps > 60) {
            GAME.settings.fps = 60;
        }
    },
    enableButtons: function () {
        GAME.btnDraw.disabled = "";
        GAME.btnDrawRandom.disabled = "";
        GAME.btnStop.disabled = "";
        GAME.btnStart.disabled = "";
        GAME.btnNextRound.disabled = "";
    },
    disableButtons: function () {
        GAME.btnDraw.disabled = "disabled";
        GAME.btnDrawRandom.disabled = "disabled";
        GAME.btnStart.disabled = "disabled";
        GAME.btnNextRound.disabled = "disabled";
    },
    disablePlayButtons: function () {
        GAME.btnNextRound.disabled = "disabled";
        GAME.btnStop.disabled = "disabled";
        GAME.btnStart.disabled = "disabled";
    },
    // menu click actions
    startActon: function () {
        GAME.readFpsSetting();
        GAME.disableButtons();
        gameLoop();
    },
    stopAction: function () {
        gameLoopStop();
        GAME.enableButtons();
    },
    drawClearAction: function () {
        GAME.setSettings();
        GAME.resetCanvasSize();
        GAME.gameOfLife.initArrays(GAME.settings.rows, GAME.settings.cols);
        GAME.clearCanvas();
        GAME.drawGrid();
        GAME.enableButtons();
        GAME.roundCounterEl.innerHTML = GAME.gameOfLife.round;
    },
    drawRandomAction: function () {
        GAME.setSettings();
        GAME.resetCanvasSize();
        GAME.gameOfLife.randomizeArray(GAME.settings.rows, GAME.settings.cols);
        GAME.clearCanvas();
        GAME.drawCells();
        GAME.drawGrid();
        GAME.enableButtons();
        GAME.roundCounterEl.innerHTML = GAME.gameOfLife.round;
    },
    nextRoundAction: function () {
        GAME.gameOfLife.calculateNextTurn();
        let isNextRoundPossible = !GAME.gameOfLife.isNextRoundTheSameAsPrevious();
        GAME.gameOfLife.endTurn();

        if (isNextRoundPossible == true) {
            GAME.clearCanvas();
            GAME.drawCells();
            GAME.drawGrid();
            GAME.roundCounterEl.innerHTML = GAME.gameOfLife.round;
        } else {
            GAME.disablePlayButtons();
            return false;
        }
    },
    // canvas actions
    resetCanvasSize: function () {
        GAME.canvas.width = GAME.settings.cellsize * GAME.settings.cols;
        GAME.canvas.height = GAME.settings.cellsize * GAME.settings.rows;
    },
    clearCanvas: function () {
        GAME.ctx.clearRect(0, 0, GAME.canvas.width, GAME.canvas.height);
    },
    drawCells: function () {
        let xStart = 0;
        let yStart = 0;
        let size = +GAME.settings.cellsize;
        GAME.ctx.fillStyle = GAME.settings.cellAliveBgColor;
        for (let i=0; i < GAME.gameOfLife.cells.length; i++) {
            xStart = 0;
            for (let k=0; k < GAME.gameOfLife.cells[i].length; k++) {
                if (GAME.gameOfLife.cells[i][k] == GameOfLife_CellStates["ALIVE"]) {
                    GAME.ctx.fillRect(xStart, yStart, size-1, size-1);
                }
                xStart += size;
            }
            yStart += size;
        }
    },
    drawGrid: function () {
        let rows = GAME.settings.rows;
        let cols = GAME.settings.cols;
        let size = GAME.settings.cellsize;
        let borderColor = GAME.settings.cellBorderColor;

        // horizontal lines
        for (let r=1; r < rows; r++) {
            GAME.ctx.beginPath();
            GAME.ctx.moveTo(0, r * size);
            GAME.ctx.lineTo(GAME.canvas.width, r * size);
            GAME.ctx.strokeStyle = borderColor;
            GAME.ctx.lineWidth = 1;
            GAME.ctx.closePath();
            GAME.ctx.stroke();
        }
        // vertical lines
        for (let c=1; c < cols; c++) {
            GAME.ctx.beginPath();
            GAME.ctx.strokeStyle = borderColor;
            GAME.ctx.moveTo(c * size, 0);
            GAME.ctx.lineTo(c * size, GAME.canvas.height);
            GAME.ctx.lineWidth = 1;
            GAME.ctx.closePath();
            GAME.ctx.stroke();
        }
    },
    reverseAndRedrawSingleCell: function (x, y) {
        if (y === void 0) { return; }
        if (x === void 0) { return; }

        let size = GAME.settings.cellsize;
        let clickedRow = Math.ceil(y / size) - 1;
        let clickedColumn = Math.ceil(x / size) - 1;
        let xStart = clickedColumn * size + 1;
        let yStart = clickedRow * size + 1;

        if (GAME.gameOfLife.cells[clickedRow][clickedColumn] == GameOfLife_CellStates["ALIVE"]) {
            GAME.gameOfLife.cells[clickedRow][clickedColumn] = GameOfLife_CellStates["DEAD"];
            GAME.ctx.clearRect(xStart, yStart, size-2, size-2);
        } else {
            GAME.gameOfLife.cells[clickedRow][clickedColumn] = GameOfLife_CellStates["ALIVE"];
            GAME.ctx.fillStyle = GAME.settings.cellAliveBgColor;
            GAME.ctx.fillRect(xStart, yStart, size-2, size-2);
        }

        GAME.enableButtons();
        GAME.roundCounterEl.innerHTML = GAME.gameOfLife.round = 0;
    },
    // events
    setCanvasClickListener: function () {
        GAME.canvas.addEventListener("click", function (e) {
            let yClickedPosition = e.pageY - GAME.canvas.offsetTop;
            let xClickedPosition = e.pageX - GAME.canvas.offsetLeft;

            GAME.reverseAndRedrawSingleCell(xClickedPosition, yClickedPosition);
        }, false);
    }
};

window.onload = function () {
    GAME.init();
    setButtonEvents();
    GAME.drawRandomAction();
}

var then = Date.now();
var myReq;

var gameLoop = function () {
    myReq = requestAnimationFrame(gameLoop);

    let now = Date.now();
    let delta = now - then;
    let interval = 1000 / GAME.settings.fps;

    if (delta > interval) {
        then = now - (delta % interval);
        let isNextRoundPossible = GAME.nextRoundAction();
        if (isNextRoundPossible == false) {
            cancelAnimationFrame(myReq);
            GAME.enableButtons();
        }
    }
}

var gameLoopStop = function () {
    cancelAnimationFrame(myReq);
    GAME.enableButtons();
}

var setButtonEvents = function () {
    GAME.btnStart.addEventListener("click", function () {
        GAME.startActon();
    }, false);

    GAME.btnStop.addEventListener("click", function () {
        GAME.stopAction();
    }, false);

    GAME.btnDraw.addEventListener("click", function () {
        GAME.drawClearAction();
    }, false);

    GAME.btnDrawRandom.addEventListener("click", function () {
        GAME.drawRandomAction();
    }, false);

    GAME.btnNextRound.addEventListener("click", function () {
        GAME.nextRoundAction();
    }, false);
};