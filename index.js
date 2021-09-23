let canvas;
let context;

/* Definições do grid */
let lines = 8;
let columns = 6;
let grid;

/* Definições do jogo */
let isRunning;
let points = 0; // Controle da pontuação
let combo = 0; // Controle da maior combinação
let timeRemaining = 100; // Tempo p/ movimento
let connectedCubes = []; // Array dos cubos percorridos para verificar a pontuação
let startTime; // Hora de inicio

/* Definições dos cubos */
let coveredCube_1;
let coveredCube_2;
class Cube {
    constructor(line, column, color, isActive) {
        this.line = line;
        this.column = column;
        this.color = color;
        this.isActive = isActive;
    }
}

// Cores
let colors = [
    'rgb(255,   0,   0)', /* vermelho */ 
    'rgb(246, 255,   0)', /* amarelo */ 
    'rgb(  0, 138,   0)', /* verde */ 
    'rgb(230, 168,  34)', /* laranja */ 
    'rgb( 20, 186, 204)', /* azul */ 
    'rgb(224,   9, 178)'  /* rosa */
];

// Método para mover um cubo específico para os lados
function move(cube, qnt) {
    let line = cube.line;
    let column = cube.column;
    let color = cube.color;

    if (column == 0 && qnt == -1) return cube;
    if (column + 1 == columns && qnt == 1) return cube;

    let cubeSide = grid[line][column + qnt];
    if (cubeSide.color != "black") return cube;

    // apagar o anterior
    cube.color = "black";
    cube.isActive = false;
    drawCube(cube);

    // redesenhar o novo
    cube = cubeSide;
    cube.isActive = true;
    cube.color = color;
    drawCube(cube);

    // dar a nova referência
    return cubeSide;
}

// Método para mover os cubos para os lados
function moveSideways(qnt) {
    if (!currentCube_1.isActive && !currentCube_2.isActive) return;
    timeRemaining = 100;
    
    // Ambos podem ser movidos
    if (currentCube_1.isActive && currentCube_2.isActive) {
        let column_left = currentCube_1.column;

        if (qnt == 1) {
            currentCube_2 = move(currentCube_2, qnt);
            currentCube_1 = move(currentCube_1, qnt);
        }
        else {
            currentCube_1 = move(currentCube_1, qnt);
            currentCube_2 = move(currentCube_2, qnt);
        }

        let tmp = currentCube_1.color;
        currentCube_1.color = currentCube_2.color;
        currentCube_2.color = tmp;
        drawCube(currentCube_1);
        drawCube(currentCube_2);
    }
    else if (currentCube_1.isActive) 
        currentCube_1 = move(currentCube_1, qnt); // Somente 'currentCube_1' pode ser movido
    else if (currentCube_2.isActive) 
        currentCube_2 = move(currentCube_2, qnt); // Somente 'currentCube_2' pode ser movido
}

// Método para movimentação pelo teclado
document.addEventListener ('keydown', (event) => {
    let name = event.key;
    if (isRunning) {
        switch(name) {
            case 'ArrowLeft': moveSideways(-1); break;
            case 'ArrowRight': moveSideways(1); break;
            case 'ArrowDown': moveDown(); break;
        }
    }
});

// Método para verificar se pode continuar
function canContinue() {
    for (let i = 0; i < columns; i++)
        if (grid[0][i].color != "black") return false;
    return true;
}

// Método para corrigir o grid
function fixGrid() {
    let moved = true;
    while (moved) {
        moved = false;
        for (let l = lines - 1; l > 0; l--) {
            for (let c = 0; c < columns; c++) {
                let current = grid[l][c];
                let top = grid[l - 1][c];

                if (current.color == "black" && top.color != "black") {
                    current.color = top.color;
                    top.color = "black";
                    drawCube(current);
                    drawCube(top);
                    moved = true;
                }
            }
        }
    }
}

// Método para corrigir a pontuação
function fixScore() {
    let length = connectedCubes.length;
    points += length * 50;
    if (length > combo) combo = length;

    document.getElementById("points").innerHTML = points;
    document.getElementById("biggestComb").innerHTML = combo;
}

// Método para apagar os cubos
function dropCubes() {
    for (let i = 0; i < connectedCubes.length; i++) {
        let cube = connectedCubes[i];
        cube.color = "black";
        cube.isActive = false;
        drawCube(cube);
    }
}

// Método para verificar se o cubo já foi percorrido
function alreadyCovered(cube) {
    for (let i = 0; i < connectedCubes.length; i++) {
        let connectedCube = connectedCubes[i];
        if (cube.line == connectedCube.line)
            if (cube.column == connectedCube.column)
                return true;
    }
    return false;
}

// Método para obter os cubos conectados
function getConnectedCubes(cube) {
    let cubesSide = [];
    let line = cube.line;
    let column = cube.column;
    let color = cube.color;

    if (line != 0) cubesSide.push(grid[line - 1][column]);
    if (line + 1 != lines) cubesSide.push(grid[line + 1][column]);
    if (column != 0) cubesSide.push(grid[line][column - 1]);
    if (column + 1 != columns) cubesSide.push(grid[line][column + 1]);

    for (let i = 0; i < cubesSide.length; i++) {
        let cube_ = cubesSide[i];
        if (cube_.color != "black") {
            if (cube_.color == color) {
                if(!alreadyCovered(cube_)) {
                    connectedCubes.push(cube_);
                    getConnectedCubes(cube_);
                }
            }
        }
    }
}

// Método para verificar se existe uma conexão entre 4 ou mais cubos
function hasConnection() {
    for (let l = lines - 1; l >= 0; l--) {
        for (let c = 0; c < columns; c++) {
            let cubeAt = grid[l][c];
            if (cubeAt.color != "black") {
                connectedCubes = [cubeAt];
                getConnectedCubes(cubeAt);
                if (connectedCubes.length >= 4) return true;
                connectedCubes = [];
            }
        }
    }
    return false;
}

// Método para tentar descer o cubo
function moveCubeDown(cube) {
    let line = cube.line;
    let column = cube.column;
    let color = cube.color;

    if (line + 1 == lines) throw 'Exception'; // está na última linha
    let nextCube = grid[line + 1][column];

    if (nextCube.color != "black") throw 'Exception'; // próximo já contém cubo

    // apagar o anterior
    cube.color = "black";
    cube.isActive = false;
    drawCube(cube);

    // desenhar o novo
    cube = nextCube;
    cube.isActive = true;
    cube.color = color;
    drawCube(cube);
    
    // dar a nova referência
    return nextCube;
}

// Método para descer os cubos
function moveDown() {
    timeRemaining = 100;

    try { currentCube_1 = moveCubeDown(currentCube_1); }
    catch { currentCube_1.isActive = false; }
    
    try { currentCube_2 = moveCubeDown(currentCube_2); }
    catch { currentCube_2.isActive = false; }

    if (!currentCube_1.isActive && !currentCube_2.isActive) {
        while (hasConnection()) {
            fixScore();
            dropCubes();
            fixGrid();
        }

        if (canContinue()) initCubes();
        else {
            isRunning = false;
            document.getElementById("end").style = "display: block;";
            document.getElementById("game").style = "display: none;";
            document.getElementById("pontuacao").style = "display: none;";

            let endTime = new Date();
            let diff = endTime.getTime() - startTime.getTime();
            let S = Math.floor(diff / 1000);
            let M = Math.floor(S / 60);
            S %= 60;
            let H = Math.floor(M / 60);
            M %= 60;

            H = formatNumber(H);
            M = formatNumber(M);
            S = formatNumber(S);
            
            document.getElementById("endPoints").innerHTML = points;
            document.getElementById("endCombo").innerHTML = combo;
            document.getElementById("endTime").innerHTML = H + ":" + M + ":" + S;
        }
    }
}

// Método para movimentar os cubos
async function movementTimer() {
    while (isRunning) {
        timeRemaining--;
        await sleep(1);

        if (timeRemaining == 0) moveDown();
    }
}

// Método para criar dois cubos
function initCubes() {
    let initialColumn = Math.floor(Math.random() * (columns - 1));
    currentCube_1 = grid[0][initialColumn];
    currentCube_2 = grid[0][initialColumn + 1];

    currentCube_1.color = getRandomColor();
    currentCube_2.color = getRandomColor();
    currentCube_1.isActive = true;
    currentCube_2.isActive = true;

    drawCube(currentCube_1);
    drawCube(currentCube_2);
}

// Método para desenho do cubo
function drawCube(cube) {
    let x = cube.column * 53;
    let y = cube.line * 53;
    let color = cube.color;

	context.fillStyle = color;
	context.fillRect(x + 2.5, y + 2.5, 45, 45);

    context.lineWidth = 1.5;
    context.strokeStyle = color == "black" ? "white" : color;
    context.strokeRect(x, y, 50, 50);
    context.stroke();
}

// Método para obter uma cor aleatória
function getRandomColor() {
    let index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

// Método para inicialização e desenho da grid
function drawGrid() {
    grid = new Array(lines);
    for (let l = 0; l < lines; l++) {
        grid[l] = new Array(columns);
        for (let c = 0; c < columns; c++) {
            grid[l][c] = new Cube(l, c, "black", false);
            drawCube(grid[l][c]);
        }
    }
}

// Método para inicialização do jogo
function startGame() {
    canvas = document.getElementById("canvasGame");
    context = canvas.getContext('2d');
    
    isRunning = true;
    startTime = new Date();

    document.getElementById("menu").style = "display: none;";
    document.getElementById("game").style = "display: block;";
    document.getElementById("pontuacao").style = "display: block;";

    drawGrid();
    initCubes();
    movementTimer();
}

// Método para reiniciar o jogo
function restartGame() {
    points = 0;
    combo = 0;
    fixScore();

    document.getElementById("end").style = "display: none;";
    context.clearRect(0, 0, 318, 424);

    startGame();
}

// Método para esperar uma quantia de tempo
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Método para decoração do menu
let spans_ = document.getElementsByTagName("span");
async function rainbowTitle() {
    while (!isRunning) {
        let colors_ = [];
        for (let i = 0; i < 5; i++) 
            colors_.push(window.getComputedStyle(spans_[i], null).getPropertyValue("color"));

        for (let i = 0; i < 5; i++) 
            spans_[i].style = "color: " + colors_[i == 0 ? 4 : i - 1] + ";";

        await sleep(200);
    }
}
rainbowTitle();

// Método para formatar o número p/ duas casas
function formatNumber(number) {
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
}