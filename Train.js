
let coin = document.querySelector("#apple");

let board = document.querySelector(".grid");

let helps = document.querySelector("#help");
let helpScreen = document.querySelector("#helpScreen");
function howToPlay(){
    helpScreen.classList.toggle("how_to_play");
}
help.addEventListener("click",howToPlay); 

// sound effects
const coinSound= new Audio("soundEffect/coin_effect.wav");
coinSound.volume = 0.3;
const movingSound = new Audio("soundEffect/moving_effect.mp3");
movingSound.volume = 0.4;
const whistle = new Audio("soundEffect/whistle_effect.wav");
whistle.volume = 0.3;
const trainHits = new Audio("soundEffect/train_crash_game_over.mp3");
trainHits.volume = 0.3;

let TrainElements = [];

let directionUp = document.querySelector("#dup");
let directionDown = document.querySelector("#ddown");
let directionLeft = document.querySelector("#dleft");
let directionRight = document.querySelector("#dright");

let count = 0;
let score = document.querySelector("#score");
score.innerText = "Score: " +  count;

let topActive = true;
let downActive = false;
let leftActive = true;
let rightActive = true;

let angle = 0;

let deathMode = document.querySelector("#deathMode");
let unDeathMode = document.querySelector("#unDeathMode");

let death = false;
let unDeath = true;

function deathActivation(){
    death = true;
    unDeath = false;
    unDeathMode.classList.add("strikeThrough");
    deathMode.removeEventListener("click",deathActivation);
    unDeathMode.removeEventListener("click",unDeathActivation);
}

function unDeathActivation(){
    unDeath = true;
    death = false;
    deathMode.classList.add("strikeThrough");
    deathMode.removeEventListener("click",deathActivation);
    unDeathMode.removeEventListener("click",unDeathActivation);
}

deathMode.addEventListener("click",deathActivation);
unDeathMode.addEventListener("click",unDeathActivation);

let gameOver = false;



let trainArr = [{x : 12, y : 12}];
let myDir = {
    x: 0,
    y : 0
};

let  apple = {
    x : 15,
    y : 2
};
 
let u = "w";
let d = "s";
let l = "a";
let r = "d";

//speed 
speed = 3;
paint = 0;

velocity = document.querySelector("input");
velocity.addEventListener("change",(event) =>{
    speed = velocity.value;
    if(speed > 15)
        speed = 15;
});

let wrongchars = new Set();

function main(ctime){ 

    requestAnimationFrame(main)

    if ((ctime - paint) < 1000 / speed) {
        return;
    }

    paint = ctime;
    if(!gameOver){
        game(myDir,apple);
        if(myDir.x != 0 || myDir.y != 0)
            movingSound.play();
    }
    else
        movingSound.pause();
}
requestAnimationFrame(main);

function game(di,a){
    
    //coin collected 
    if(trainArr[0].y === a.x && trainArr[0].x === a.y){
        coinSound.play();


        while(coinLocation()){
            a.x = Math.floor((Math.random()*16)+1);
            a.y = Math.floor((Math.random()*16)+1);
        }

        count++;
        score.innerText = "Score: " +  count;
        trainArr.unshift({x : trainArr[0].x + di.x , y : trainArr[0].y + di.y});
        console.log(trainArr.length);
    }
    //coin position
    coin.style.gridRowStart = a.x;
    coin.style.gridColumnStart = a.y;
    coin.classList.add("coin");

    // body moemnet
    for(let i = trainArr.length - 2; i >= 0; i--){
        trainArr[i+1] = {...trainArr[i]};
    }

    trainArr[0].x += di.x;
    trainArr[0].y += di.y;

    //postion
    
    trainArr.forEach((bogie,index) =>{

        if(!TrainElements[index]){
            let Train = document.createElement("div");
            board.appendChild(Train);
            TrainElements[index] = Train;
        }

        let Train = TrainElements[index];
        Train.classList.remove(
            "trainHead",
            "trainBody",
            "trainCaboose"
        );

        if(index === 0){
            Train.classList.add("trainHead");
            Train.style.transform = `rotate(${angle}deg)`;
        }
        else if(index == trainArr.length - 1){
            Train.classList.add("trainCaboose");
        }
        else{
            Train.classList.add("trainBody");
        }

        Train.style.gridColumnStart = bogie.x;
        Train.style.gridRowStart = bogie.y;
    });

    //clear directions
    directionUp.innerText = "";
    directionDown.innerText = "";
    directionLeft.innerText = "";
    directionRight.innerText = "";

    //hiding the 4th direction
    if(topActive){
        directionUp.style.gridColumnStart = trainArr[0].x;
        directionUp.style.gridRowStart = trainArr[0].y - 1;
        directionUp.innerText = u;
        directionUp.classList.add("direction");
    }
    if(downActive){
        directionDown.style.gridColumnStart = trainArr[0].x;
        directionDown.style.gridRowStart = trainArr[0].y + 1;
        directionDown.innerText = d;
        directionDown.classList.add("direction");
    }
    if(leftActive){
        directionLeft.style.gridColumnStart = trainArr[0].x-1;
        directionLeft.style.gridRowStart = trainArr[0].y;
        directionLeft.innerText = l;
        directionLeft.classList.add("direction");
    }
    if(rightActive){
        directionRight.style.gridColumnStart = trainArr[0].x+1;
        directionRight.style.gridRowStart = trainArr[0].y;
        directionRight.innerText = r;
        directionRight.classList.add("direction");
    }
    
    // hiding the direction at walls 
    if(trainArr[0].x == 1)
        directionLeft.innerText = "";
    if(trainArr[0].x == 16)
        directionRight.innerText = "";
    if(trainArr[0].y == 1)
        directionUp.innerText = "";
    if(trainArr[0].y == 16)
        directionDown.innerText = "";

    // no death mode
    if(unDeath){
        if(trainArr[0].x < 1 || trainArr[0].x > 16){
            trainArr[0].x = (trainArr[0].x < 1 ? 16 : 1);
        }
        if(trainArr[0].y < 1 || trainArr[0].y > 16){
            trainArr[0].y = (trainArr[0].y < 1? 16 : 1);
        }
        if(trainCollision())
            resetGame();
    }
    // death mode
    if(death){
        if(hitWalls() || trainCollision()){
           /* trainHits.play();
            gameOver = true;
            let scoreCard = document.createElement("div");
            scoreCard.innerText = "Wrong typed characters\n";
            wrongchars.forEach((c) =>{
                scoreCard.innerText += " " + c;
            });
            scoreCard.innerText += "\nScore: " + count;
            board.replaceChildren(scoreCard);
            scoreCard.classList.add("wchars");
            setTimeout(()=>{
                scoreCard.innerText = "";
                scoreCard.classList.remove("wchars");
                board.replaceChildren(
                    coin,
                    directionUp,
                    directionDown,
                    directionLeft,
                    directionRight
                );
                wrongchars = new Set();
                count = 0;
                score.innerText = "Score: " + count;
                trainArr = [{x:12 , y:12}]
                di.x = 0;
                di.y = 0;
                TrainElements = []
                angle = 0;
                gameOver = false;
                u = "w";
                d = "s";
                l = "a";
                r = "d";
                topActive = true;
                leftActive = true;
                rightActive = true;
                downActive = false;
            },5000);
            */
            resetGame();
        }
    }   

    
};

addEventListener('keydown', event => {
        let key = event.key;
        //myDir.x = 0;
        //myDir.y = 0;
        if(key === u && topActive){ 
            myDir.x = 0;
            myDir.y = -1;
            up();
            downActive = false;
            leftActive = true;
            rightActive = true;
            angle = 0;
            whistle.play();
        }
        else if(key === d && downActive){
            myDir.x = 0;
            myDir.y = 1;
            down();
            topActive = false;
            leftActive = true;
            rightActive = true;
            angle = 180;
            whistle.play();
        }
        else if(key === r && rightActive){
            myDir.x = 1;
            myDir.y = 0;
            right();
            leftActive = false;
            topActive = true;
            downActive = true;
            angle = 90;
            whistle.play();
        }
        else if(key === l && leftActive){    
            myDir.y = 0;
            myDir.x = -1;
            left();
            rightActive = false;
            topActive = true;
            downActive = true;
            angle = 270;
            whistle.play();
        }
        else{
            wrongchars.add(key);
        }
        
    });

function up(){
    let old = u;
    while( u == old || u == d || u == r || u == l){
        u = String.fromCharCode(random());
    }
     console.log(u);
}
function down(){
    let old = d;
    while(d == old || d == u  || d == r || d == l){
        d = String.fromCharCode(random());
    }
     console.log(d);
}
function left(){
    let old = l;
    while(l == old || l == u || l == d || l == r ){
        l = String.fromCharCode(random());
    }
     console.log(l);
}
function right(){
    let old = r;
    while( r == old || r == u || r == d || r == l){
        r = String.fromCharCode(random());
    }
     console.log(r);
}

function random(){
    return Math.floor(Math.random()*(122 - 97 + 1) +  97);
}


function trainCollision(){
    for(let i = 1; i < trainArr.length; i++){
        if(trainArr[0].x == trainArr[i].x && trainArr[0].y == trainArr[i].y)
            return true;
    }
    return false;
}

function hitWalls(){
    if(trainArr[0].x < 1 || trainArr[0].x > 16 || trainArr[0].y < 1 || trainArr[0].y > 16)
        return true;
    return false;
}

function coinLocation(){
    for(let i = 0; i < trainArr.length; i++){
        if(trainArr[i].y == apple.x && trainArr[i].x == apple.y)
            return true;
    }
    return false;
}

function resetGame(){
    trainHits.play();
    gameOver = true;
    let scoreCard = document.createElement("div");
    scoreCard.innerText = "Wrong typed characters\n";
    wrongchars.forEach((c) =>{
        scoreCard.innerText += " " + c;
    });
    scoreCard.innerText += "\nScore: " + count;
    board.replaceChildren(scoreCard);
    scoreCard.classList.add("wchars");
    setTimeout(()=>{
        scoreCard.innerText = "";
        scoreCard.classList.remove("wchars");
        board.replaceChildren(
            coin,
            directionUp,
            directionDown,
            directionLeft,
            directionRight
        );
        wrongchars = new Set();
        count = 0;
        score.innerText = "Score: " + count;
        trainArr = [{x:12 , y:12}]
        myDir.x = 0;
        myDir.y = 0;
        TrainElements = []
        angle = 0;
        gameOver = false;
        u = "w";
        d = "s";
        l = "a";
        r = "d";
        topActive = true;
        leftActive = true;
        rightActive = true;
        downActive = false;
    },5000);
}