// board
let board;
let boardWidth = 1200;
let boardHeight = 800;
let context;

//Aiden
let aidenWidth = 200;
let aidenHeight = 220;
let aidenX = 50;
let aidenY = boardHeight - aidenHeight - 100;
let aidenImg;


let aiden = {
    x : aidenX,
    y : aidenY,
    width : aidenWidth,
    height : aidenHeight
}

// land
//let landWidth = 800;
//let landHeight = 100
//let landX = 0;
//let landY = boardHeight - landHeight;
//let landImg;


// barriers
let barrierArray = [];

let barrier1Width = 80;
let barrier2Width = 120;
let barrier3Width = 150;

let barrierHeight = 170;
let barrierX = 1100;
let barrierY = boardHeight - barrierHeight;

let barrier1Img;
let barrier2Img;
let barrier3Img;

//physic
let velocityX = -6; // barrier moving speed
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // used for drawing on the board

    //draw initial Aiden
    //context.fillStyle = "green";
    //context.fillRect(aiden.x, aiden.y, aidenWidth, aidenHeight);

    aidenImg = new Image();
    aidenImg.src = "Aiden.png";
    aidenImg.onload = function() {
        context.drawImage(aidenImg, aiden.x, aiden.y, aidenWidth, aidenHeight);
    }

    barrier1Img = new Image();
    barrier1Img.src = "rock.png";

    barrier2Img = new Image();
    barrier2Img.src = "bush.png";

    barrier3Img = new Image();
    barrier3Img.src = "sheep.png";

    requestAnimationFrame(update);
    setInterval(placeBarrier, 1000); //1000milisecunds = 1 secunds
    document.addEventListener("keydown", moveAiden);
}

function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Aiden
    velocityY += gravity;
    aiden.y = Math.min(aiden.y + velocityY, aidenY); // apply gravity to current aiden.y 
    context.drawImage(aidenImg, aiden.x, aiden.y, aidenWidth, aidenHeight);

    //Barrier
    for (let i = 0; i < barrierArray.length; i++) {
        let barrier = barrierArray[i];
        barrier.x += velocityX
        context.drawImage(barrier.img, barrier.x, barrier.y, barrier.width, barrier.height);
        
        if (detectCollision(dino,barrier)) {
            gameOver = true
            aidenImg.src = "Aiden-dead.png"
            aidenImg.onload = function () {
                context.drawImage(aidenImg, aiden.x, aiden.y, aiden.width, aiden,height);
            }
        }
    
    }
    // score
    context.fillStyle = "black";
    context.font = "40px courier";
    score++;
    context.fillText(score, 5, 20);

}

function moveAiden(e) {
    if (gameOver) {
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp" ) && aiden.y == aidenY) {
        // jump
        velocityY = -15;
    }
    else if (e.code == "ArrowDown" && aiden.y == aidenY) {
        //duck
        velocity = +2
    }

}

function placeBarrier() {
    
    if (gameOver) {
       return;
    }

    //place barrier
    let barrier = {
        img : null,
        x : barrierX,
        y : barrierY,
        width: null,
        height : barrierHeight

    }

    let placeBarriersChance = Math.random();

    if (placeBarriersChance > .90) { // 10% of chance to get barrier3
        barrier.img = barrier3Img;
        barrier.width = barrier3Width;
        barrierArray.push(barrier);
    }
    else if (placeBarriersChance > .70) { // 30% of chance to get barrier2
        barrier.img = barrier2Img;
        barrier.width = barrier2Width;
        barrierArray.push(barrier);
    }
    else if (placeBarriersChance > .50) { // 50% of chance to get barrier1
        barrier.img = barrier1Img;
        barrier.width = barrier1Width;
        barrierArray.push(barrier);
    }

    if (barrierArray.length > 10) {
        barrierArray.shift(); // remove the first element from the array

    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}