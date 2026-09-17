/* =========================================================
   JUNGLE ESCAPE
   HTML5 Endless Runner
   Inspired by Temple Run 2
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameElement = document.getElementById("game");

const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameOver = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const slideBtn = document.getElementById("slideBtn");

const distanceText = document.getElementById("distance");
const coinsText = document.getElementById("coins");
const bestText = document.getElementById("best");

const finalDistance = document.getElementById("finalDistance");
const finalCoins = document.getElementById("finalCoins");
const finalBest = document.getElementById("finalBest");

const deathReason = document.getElementById("deathReason");

const powerUp = document.getElementById("powerUp");
const powerText = document.getElementById("powerText");
const powerIcon = document.getElementById("powerIcon");


/* =========================================================
   CANVAS
========================================================= */

let W = 0;
let H = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================================================
   GAME STATE
========================================================= */

let running = false;

let distance = 0;
let coins = 0;

let best = Number(localStorage.getItem("jungleEscapeBest") || 0);

bestText.textContent = Math.floor(best) + " m";


/* =========================================================
   PLAYER
========================================================= */

const player = {

    lane: 1,

    targetLane: 1,

    y: 0,

    velocityY: 0,

    jumping: false,

    sliding: false,

    width: 42,

    height: 70,

    jumpPower: 16,

    gravity: 0.65

};


/* =========================================================
   GAME PARAMETERS
========================================================= */

let speed = 5;

let spawnTimer = 0;

let coinTimer = 0;

let obstacleTimer = 0;

let difficulty = 0;


/* =========================================================
   WORLD OBJECTS
========================================================= */

let obstacles = [];

let coinsObjects = [];

let particles = [];

let decorations = [];


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

function initAudio() {

    if (!audioContext) {

        try {
            audioContext = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        } catch (error) {
            audioContext = null;
        }

    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}


function sound(type) {

    if (!audioContext) return;

    const osc = audioContext.createOscillator();

    const gain = audioContext.createGain();

    osc.connect(gain);

    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "coin") {

        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);

    }

    else if (type === "jump") {

        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.12);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);

    }

    else if (type === "hit") {

        osc.type = "sawtooth";

        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);

    }

    else if (type === "power") {

        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.25);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);

    }

}


/* =========================================================
   WORLD POSITION
========================================================= */

function roadCenter() {
    return W / 2;
}


function laneX(lane) {

    const spacing = Math.min(W * 0.18, 125);

    return roadCenter() + (lane - 1) * spacing;
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    initAudio();

    running = true;

    distance = 0;
    coins = 0;

    speed = 5;

    difficulty = 0;

    spawnTimer = 0;
    coinTimer = 0;
    obstacleTimer = 0;

    obstacles = [];
    coinsObjects = [];
    particles = [];
    decorations = [];

    player.lane = 1;
    player.targetLane = 1;

    player.y = 0;
    player.velocityY = 0;

    player.jumping = false;
    player.sliding = false;

    menu.classList.remove("active");
    gameOver.classList.remove("active");

    gameScreen.classList.add("active");

    updateHUD();
}


/* =========================================================
   END GAME
========================================================= */

function endGame(reason) {

    if (!running) return;

    running = false;

    sound("hit");

    deathReason.textContent = reason;

    const currentDistance = Math.floor(distance);

    if (currentDistance > best) {

        best = currentDistance;

        localStorage.setItem(
            "jungleEscapeBest",
            best
        );

    }

    finalDistance.textContent =
        currentDistance + " m";

    finalCoins.textContent =
        coins;

    finalBest.textContent =
        best + " m";

    bestText.textContent =
        best + " m";

    gameScreen.classList.add("shake");

    setTimeout(() => {
        gameScreen.classList.remove("shake");
        gameOver.classList.add("active");
    }, 250);

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    distanceText.textContent =
        Math.floor(distance) + " m";

    coinsText.textContent =
        coins;

    bestText.textContent =
        Math.floor(best) + " m";

}


/* =========================================================
   LANE MOVEMENT
========================================================= */

function moveLeft() {

    if (!running) return;

    if (player.targetLane > 0) {

        player.targetLane--;

    }

}


function moveRight() {

    if (!running) return;

    if (player.targetLane < 2) {

        player.targetLane++;

    }

}


/* =========================================================
   JUMP
========================================================= */

function jump() {

    if (!running) return;

    if (!player.jumping) {

        player.velocityY =
            player.jumpPower;

        player.jumping = true;

        player.sliding = false;

        sound("jump");

    }

}


/* =========================================================
   SLIDE
========================================================= */

function slide() {

    if (!running) return;

    if (!player.jumping) {

        player.sliding = true;

        setTimeout(() => {

            player.sliding = false;

        }, 650);

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        moveLeft();

    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        moveRight();

    }

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w" ||
        event.code === "Space"
    ) {

        event.preventDefault();

        jump();

    }

    if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {

        slide();

    }

});


/* =========================================================
   BUTTON CONTROLS
========================================================= */

leftBtn.addEventListener("pointerdown", e => {

    e.preventDefault();

    moveLeft();

});

rightBtn.addEventListener("pointerdown", e => {

    e.preventDefault();

    moveRight();

});

jumpBtn.addEventListener("pointerdown", e => {

    e.preventDefault();

    jump();

});

slideBtn.addEventListener("pointerdown", e => {

    e.preventDefault();

    slide();

});


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {

    const touch = e.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


canvas.addEventListener("touchend", e => {

    const touch = e.changedTouches[0];

    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    const threshold = 35;

    if (
        Math.abs(dx) < threshold &&
        Math.abs(dy) < threshold
    ) {

        jump();

        return;

    }

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0) {
            moveRight();
        } else {
            moveLeft();
        }

    } else {

        if (dy < 0) {
            jump();
        } else {
            slide();
        }

    }

}, { passive: true });


/* =========================================================
   SPAWN OBSTACLE
========================================================= */

function spawnObstacle() {

    const lane =
        Math.floor(Math.random() * 3);

    const types = [
        "rock",
        "tree",
        "wall",
        "fire"
    ];

    const type =
        types[Math.floor(Math.random() * types.length)];

    obstacles.push({

        lane: lane,

        z: 1,

        type: type,

        passed: false

    });

}


/* =========================================================
   SPAWN COINS
========================================================= */

function spawnCoinLine() {

    const lane =
        Math.floor(Math.random() * 3);

    for (let i = 0; i < 5; i++) {

        coinsObjects.push({

            lane: lane,

            z: 1 + i * 0.07,

            collected: false,

            rotation: Math.random() * Math.PI * 2

        });

    }

}


/* =========================================================
   SPAWN DECORATION
========================================================= */

function spawnDecoration() {

    const side =
        Math.random() > 0.5 ? -1 : 1;

    decorations.push({

        side: side,

        z: 1,

        type:
            Math.random() > 0.5
                ? "tree"
                : "rock"

    });

}


/* =========================================================
   PROJECT 3D POSITION
========================================================= */

function project(z) {

    const horizon = H * 0.30;

    const bottom = H * 1.05;

    const depth = 1 - z;

    const y =
        horizon +
        Math.pow(depth, 1.35) *
        (bottom - horizon);

    const scale =
        0.18 +
        depth * 1.15;

    return {
        y,
        scale
    };

}


/* =========================================================
   DRAW BACKGROUND
========================================================= */

function drawBackground(time) {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(0, "#08172c");
    gradient.addColorStop(0.45, "#19515a");
    gradient.addColorStop(1, "#10291f");

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, W, H);


    /* Moon */

    ctx.beginPath();

    ctx.arc(
        W * 0.78,
        H * 0.16,
        Math.min(W, H) * 0.055,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255, 232, 170, 0.85)";

    ctx.fill();


    /* Mountains */

    ctx.fillStyle = "#0c3033";

    ctx.beginPath();

    ctx.moveTo(0, H * 0.42);

    for (let x = 0; x <= W; x += 80) {

        const y =
            H * 0.31 +
            Math.sin(x * 0.012) * 35 +
            Math.sin(x * 0.026) * 20;

        ctx.lineTo(x, y);

    }

    ctx.lineTo(W, H * 0.55);

    ctx.lineTo(0, H * 0.55);

    ctx.closePath();

    ctx.fill();


    /* Mist */

    const mist =
        ctx.createLinearGradient(
            0,
            H * 0.35,
            0,
            H * 0.65
        );

    mist.addColorStop(
        0,
        "rgba(150,220,205,0)"
    );

    mist.addColorStop(
        0.5,
        "rgba(150,220,205,0.08)"
    );

    mist.addColorStop(
        1,
        "rgba(150,220,205,0)"
    );

    ctx.fillStyle = mist;

    ctx.fillRect(
        0,
        H * 0.32,
        W,
        H * 0.35
    );

}


/* =========================================================
   DRAW ROAD
========================================================= */

function drawRoad() {

    const horizon = H * 0.30;

    const bottom = H * 1.1;

    const roadTop = W * 0.09;

    const roadBottom = W * 0.88;


    /* Main road */

    ctx.beginPath();

    ctx.moveTo(
        W / 2 - roadTop / 2,
        horizon
    );

    ctx.lineTo(
        W / 2 + roadTop / 2,
        horizon
    );

    ctx.lineTo(
        W / 2 + roadBottom / 2,
        bottom
    );

    ctx.lineTo(
        W / 2 - roadBottom / 2,
        bottom
    );

    ctx.closePath();

    const roadGradient =
        ctx.createLinearGradient(
            0,
            horizon,
            0,
            bottom
        );

    roadGradient.addColorStop(
        0,
        "#465146"
    );

    roadGradient.addColorStop(
        1,
        "#1b2520"
    );

    ctx.fillStyle = roadGradient;

    ctx.fill();


    /* Road edges */

    ctx.strokeStyle =
        "rgba(205, 184, 120, 0.5)";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        W / 2 - roadTop / 2,
        horizon
    );

    ctx.lineTo(
        W / 2 - roadBottom / 2,
        bottom
    );

    ctx.moveTo(
        W / 2 + roadTop / 2,
        horizon
    );

    ctx.lineTo(
        W / 2 + roadBottom / 2,
        bottom
    );

    ctx.stroke();


    /* Lane lines */

    for (let lane = 0; lane < 2; lane++) {

        const topX =
            W / 2 +
            (lane - 0.5) * roadTop;

        const bottomX =
            W / 2 +
            (lane - 0.5) * roadBottom;

        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";

        ctx.lineWidth = 2;

        ctx.setLineDash([25, 30]);

        ctx.beginPath();

        ctx.moveTo(
            topX,
            horizon
        );

        ctx.lineTo(
            bottomX,
            bottom
        );

        ctx.stroke();

        ctx.setLineDash([]);

    }

}


/* =========================================================
   DRAW TREE
========================================================= */

function drawTree(x, y, scale) {

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(scale, scale);

    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        5,
        38,
        12,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Trunk */

    ctx.fillStyle = "#583c25";

    ctx.fillRect(
        -9,
        -80,
        18,
        85
    );


    /* Leaves */

    ctx.fillStyle = "#164c35";

    const circles = [
        [-28, -90, 28],
        [28, -90, 28],
        [0, -120, 38],
        [-15, -55, 32],
        [15, -55, 32]
    ];

    circles.forEach(c => {

        ctx.beginPath();

        ctx.arc(
            c[0],
            c[1],
            c[2],
            0,
            Math.PI * 2
        );

        ctx.fill();

    });


    ctx.fillStyle =
        "rgba(77,160,102,0.45)";

    ctx.beginPath();

    ctx.arc(
        -12,
        -126,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   DRAW ROCK
========================================================= */

function drawRock(x, y, scale) {

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(scale, scale);

    ctx.fillStyle = "#515956";

    ctx.beginPath();

    ctx.moveTo(-35, 0);

    ctx.lineTo(-25, -30);

    ctx.lineTo(-5, -48);

    ctx.lineTo(25, -35);

    ctx.lineTo(38, 0);

    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.stroke();

    ctx.restore();

}


/* =========================================================
   DRAW OBSTACLE
========================================================= */

function drawObstacle(object) {

    const p = project(object.z);

    const x = laneX(object.lane);

    const y = p.y;

    const scale = p.scale;


    if (object.type === "tree") {

        drawTree(
            x,
            y,
            scale * 0.75
        );

    }

    else if (object.type === "rock") {

        drawRock(
            x,
            y,
            scale * 0.7
        );

    }

    else if (object.type === "wall") {

        ctx.save();

        ctx.translate(x, y);

        ctx.scale(scale, scale);

        ctx.fillStyle = "#70503a";

        ctx.fillRect(
            -40,
            -60,
            80,
            60
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.08)";

        for (let i = 0; i < 3; i++) {

            ctx.fillRect(
                -32 + i * 25,
                -50,
                18,
                15
            );

        }

        ctx.restore();

    }

    else if (object.type === "fire") {

        ctx.save();

        ctx.translate(x, y);

        ctx.scale(scale, scale);

        ctx.fillStyle =
            "rgba(255,80,20,0.3)";

        ctx.beginPath();

        ctx.arc(
            0,
            -30,
            42,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#ff9d24";

        ctx.beginPath();

        ctx.moveTo(-20, 0);
        ctx.lineTo(-8, -45);
        ctx.lineTo(5, -22);
        ctx.lineTo(22, -55);
        ctx.lineTo(28, 0);

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle = "#fff1a6";

        ctx.beginPath();

        ctx.moveTo(-9, 0);
        ctx.lineTo(0, -30);
        ctx.lineTo(8, 0);

        ctx.closePath();

        ctx.fill();

        ctx.restore();

    }

}


/* =========================================================
   DRAW COIN
========================================================= */

function drawCoin(object, time) {

    const p = project(object.z);

    const x = laneX(object.lane);

    const y = p.y - 45 * p.scale;

    const scale = p.scale;

    const rotation =
        time * 0.006 +
        object.rotation;

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(
        scale,
        scale
    );

    ctx.rotate(
        Math.sin(rotation) * 0.4
    );

    ctx.shadowBlur = 18;

    ctx.shadowColor =
        "rgba(255,202,61,0.7)";

    ctx.fillStyle = "#ffd34d";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle =
        "#fff1a5";

    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.fillStyle =
        "rgba(255,255,255,0.5)";

    ctx.beginPath();

    ctx.arc(
        -4,
        -4,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}


/* =========================================================
   DRAW PLAYER
========================================================= */

function drawPlayer(time) {

    const x =
        laneX(
            player.lane +
            (player.targetLane - player.lane) * 0.25
        );

    const ground =
        H * 0.84;

    const jumpOffset =
        player.y;

    const y =
        ground - jumpOffset;

    const run =
        Math.sin(time * 0.015) * 5;


    ctx.save();

    ctx.translate(x, y);


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        5,
        player.sliding ? 35 : 25,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Shield */

    if (shieldTimer > 0) {

        ctx.strokeStyle =
            "rgba(90,220,255,0.85)";

        ctx.lineWidth = 4;

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            "rgba(80,200,255,0.8)";

        ctx.beginPath();

        ctx.arc(
            0,
            -40,
            52,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.shadowBlur = 0;

    }


    /* Sliding */

    if (player.sliding) {

        ctx.fillStyle = "#d7e8e1";

        ctx.beginPath();

        ctx.roundRect(
            -28,
            -32,
            56,
            25,
            12
        );

        ctx.fill();

        ctx.fillStyle = "#246b58";

        ctx.beginPath();

        ctx.arc(
            22,
            -25,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    else {

        /* Legs */

        ctx.strokeStyle =
            "#172c28";

        ctx.lineWidth = 9;

        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(
            -8,
            -8
        );

        ctx.lineTo(
            -15 + run,
            8
        );

        ctx.moveTo(
            8,
            -8
        );

        ctx.lineTo(
            15 - run,
            8
        );

        ctx.stroke();


        /* Body */

        ctx.fillStyle =
            "#d9eee4";

        ctx.beginPath();

        ctx.roundRect(
            -19,
            -62,
            38,
            50,
            12
        );

        ctx.fill();


        /* Scarf */

        ctx.fillStyle =
            "#d94f3d";

        ctx.fillRect(
            -20,
            -48,
            40,
            9
        );


        /* Head */

        ctx.fillStyle =
            "#e5c29b";

        ctx.beginPath();

        ctx.arc(
            0,
            -77,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* Hair */

        ctx.fillStyle =
            "#172321";

        ctx.beginPath();

        ctx.arc(
            0,
            -84,
            17,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();


        /* Arms */

        ctx.strokeStyle =
            "#d9eee4";

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.moveTo(
            -17,
            -48
        );

        ctx.lineTo(
            -29,
            -27 + run
        );

        ctx.moveTo(
            17,
            -48
        );

        ctx.lineTo(
            29,
            -27 - run
        );

        ctx.stroke();

    }

    ctx.restore();

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles(
    x,
    y,
    amount,
    type
) {

    for (let i = 0; i < amount; i++) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5) *
                7,

            vy:
                (Math.random() - 0.5) *
                7,

            life: 1,

            size:
                Math.random() * 5 + 2,

            type: type

        });

    }

}


function updateParticles() {

    particles.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.12;

        p.life -= 0.025;

    });

    particles =
        particles.filter(
            p => p.life > 0
        );

}


function drawParticles() {

    particles.forEach(p => {

        ctx.globalAlpha = p.life;

        ctx.fillStyle =
            p.type === "coin"
                ? "#ffd34d"
                : "#d8eee2";

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

    ctx.globalAlpha = 1;

}


/* =========================================================
   SHIELD POWER-UP
========================================================= */

let shieldTimer = 0;

function activateShield() {

    shieldTimer = 7;

    powerUp.style.display =
        "flex";

    powerIcon.textContent = "🛡️";

    powerText.textContent =
        "SHIELD";

    sound("power");

}


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer() {

    /* Lane movement */

    player.lane +=
        (player.targetLane - player.lane) *
        0.18;


    /* Jump */

    if (player.jumping) {

        player.y +=
            player.velocityY;

        player.velocityY -=
            player.gravity;

        if (player.y <= 0) {

            player.y = 0;

            player.velocityY = 0;

            player.jumping = false;

        }

    }

}


/* =========================================================
   COLLISION
========================================================= */

function checkCollisions() {

    for (const obstacle of obstacles) {

        if (obstacle.z < 0.18) {

            const laneDifference =
                Math.abs(
                    obstacle.lane -
                    player.lane
                );

            if (laneDifference < 0.35) {

                /* Jump avoids obstacles */

                if (player.y > 55) {
                    continue;
                }

                /* Slide avoids fire/wall */

                if (
                    player.sliding &&
                    obstacle.type === "wall"
                ) {

                    continue;

                }

                if (shieldTimer > 0) {

                    shieldTimer = 0;

                    powerUp.style.display =
                        "none";

                    createParticles(
                        W / 2,
                        H * 0.75,
                        25,
                        "shield"
                    );

                    continue;

                }

                endGame(
                    "You hit an obstacle!"
                );

                return;

            }

        }

    }


    /* Coins */

    for (const coin of coinsObjects) {

        if (
            !coin.collected &&
            coin.z < 0.2 &&
            Math.abs(
                coin.lane -
                player.lane
            ) < 0.4
        ) {

            coin.collected = true;

            coins++;

            sound("coin");

            createParticles(
                laneX(coin.lane),
                H * 0.75,
                12,
                "coin"
            );

        }

    }

}


/* =========================================================
   UPDATE WORLD
========================================================= */

function updateWorld() {

    const movement =
        speed / 1000;

    obstacles.forEach(
        obstacle => {
            obstacle.z -= movement;
        }
    );

    coinsObjects.forEach(
        coin => {
            coin.z -= movement;
        }
    );

    decorations.forEach(
        decoration => {
            decoration.z -= movement;
        }
    );


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.z > -0.1
        );

    coinsObjects =
        coinsObjects.filter(
            coin =>
                coin.z > -0.1 &&
                !coin.collected
        );

    decorations =
        decorations.filter(
            decoration =>
                decoration.z > -0.1
        );

}


/* =========================================================
   SPAWNING
========================================================= */

function spawnObjects() {

    obstacleTimer--;

    coinTimer--;

    spawnTimer--;


    if (obstacleTimer <= 0) {

        spawnObstacle();

        obstacleTimer =
            Math.max(
                45,
                100 - difficulty * 2
            );

    }


    if (coinTimer <= 0) {

        spawnCoinLine();

        coinTimer = 150;

    }


    if (spawnTimer <= 0) {

        spawnDecoration();

        spawnTimer = 30;

    }

}


/* =========================================================
   DRAW DECORATIONS
========================================================= */

function drawDecorations() {

    decorations.forEach(decoration => {

        const p =
            project(decoration.z);

        const offset =
            W * 0.34;

        const x =
            W / 2 +
            decoration.side *
            offset;

        if (decoration.type === "tree") {

            drawTree(
                x,
                p.y,
                p.scale * 0.7
            );

        } else {

            drawRock(
                x,
                p.y,
                p.scale * 0.6
            );

        }

    });

}


/* =========================================================
   DRAW WORLD
========================================================= */

function drawWorld(time) {

    drawBackground(time);

    drawRoad();

    drawDecorations();


    /* Sort by depth */

    const renderObjects = [
        ...obstacles.map(
            o => ({
                type: "obstacle",
                object: o
            })
        ),

        ...coinsObjects.map(
            c => ({
                type: "coin",
                object: c
            })
        )
    ];


    renderObjects.sort(
        (a, b) =>
            b.object.z -
            a.object.z
    );


    renderObjects.forEach(item => {

        if (
            item.type === "obstacle"
        ) {

            drawObstacle(
                item.object
            );

        } else {

            drawCoin(
                item.object,
                time
            );

        }

    });


    drawPlayer(time);

    drawParticles();

}


/* =========================================================
   MAIN UPDATE
========================================================= */

let lastTime = 0;

function update(time) {

    if (!running) return;


    distance +=
        speed * 0.01;

    difficulty +=
        0.003;


    /* Speed increases */

    speed =
        Math.min(
            12,
            5 + difficulty * 0.15
        );


    updatePlayer();

    spawnObjects();

    updateWorld();

    updateParticles();

    checkCollisions();


    if (shieldTimer > 0) {

        shieldTimer -= 1 / 60;

        if (shieldTimer <= 0) {

            powerUp.style.display =
                "none";

        }

    }


    updateHUD();

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(time) {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    update(time);

    drawWorld(time);


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   BUTTONS
========================================================= */

startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);


menuBtn.addEventListener(
    "click",
    () => {

        running = false;

        gameOver.classList.remove(
            "active"
        );

        gameScreen.classList.remove(
            "active"
        );

        menu.classList.add(
            "active"
        );

    }
);


/* =========================================================
   START RENDER LOOP
========================================================= */

requestAnimationFrame(
    gameLoop
);