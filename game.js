/* =========================================================
   JUNGLE ESCAPE
   Stable Endless Runner
========================================================= */


/* =========================================================
   DOM
========================================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const menu =
    document.getElementById("menu");

const shop =
    document.getElementById("shop");

const gameScreen =
    document.getElementById("gameScreen");

const gameOver =
    document.getElementById("gameOver");


const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const menuBtn =
    document.getElementById("menuBtn");

const skinsBtn =
    document.getElementById("skinsBtn");

const backMenuBtn =
    document.getElementById("backMenuBtn");


const leftBtn =
    document.getElementById("leftBtn");

const rightBtn =
    document.getElementById("rightBtn");

const jumpBtn =
    document.getElementById("jumpBtn");

const slideBtn =
    document.getElementById("slideBtn");


const distanceText =
    document.getElementById("distance");

const coinsText =
    document.getElementById("coins");

const bestText =
    document.getElementById("best");

const menuCoins =
    document.getElementById("menuCoins");

const shopCoins =
    document.getElementById("shopCoins");


const finalDistance =
    document.getElementById("finalDistance");

const finalCoins =
    document.getElementById("finalCoins");

const finalBest =
    document.getElementById("finalBest");


const deathReason =
    document.getElementById("deathReason");


const powerUp =
    document.getElementById("powerUp");

const powerIcon =
    document.getElementById("powerIcon");

const powerText =
    document.getElementById("powerText");


const skinGrid =
    document.getElementById("skinGrid");


/* =========================================================
   CANVAS
========================================================= */

let W = 0;
let H = 0;

let DPR =
    Math.min(
        window.devicePixelRatio || 1,
        2
    );


function resizeCanvas() {

    W = window.innerWidth;
    H = window.innerHeight;

    DPR =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        Math.floor(W * DPR);

    canvas.height =
        Math.floor(H * DPR);

    canvas.style.width =
        W + "px";

    canvas.style.height =
        H + "px";

    ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =========================================================
   STORAGE
========================================================= */

let bankCoins =
    Number(
        localStorage.getItem(
            "jungleCoins"
        ) || 0
    );


let best =
    Number(
        localStorage.getItem(
            "jungleBest"
        ) || 0
    );


let selectedSkin =
    localStorage.getItem(
        "jungleSkin"
    ) || "forest";


let ownedSkins =
    JSON.parse(
        localStorage.getItem(
            "jungleOwnedSkins"
        ) || '["forest"]'
    );


/* =========================================================
   SKINS
========================================================= */

const skins = {

    forest: {

        name: "Forest",

        price: 0,

        body: "#d9eee4",

        scarf: "#d94f3d",

        hair: "#172321",

        glow: null

    },

    ember: {

        name: "Ember",

        price: 250,

        body: "#f26b3d",

        scarf: "#ffca4d",

        hair: "#351713",

        glow: "#ff6b38"

    },

    frost: {

        name: "Frost",

        price: 500,

        body: "#72c9ee",

        scarf: "#e7f8ff",

        hair: "#17324a",

        glow: "#66d9ff"

    },

    volt: {

        name: "Volt",

        price: 900,

        body: "#f4d84c",

        scarf: "#ffffff",

        hair: "#403600",

        glow: "#ffe45c"

    },

    shadow: {

        name: "Shadow",

        price: 1500,

        body: "#463b63",

        scarf: "#d06cff",

        hair: "#09070e",

        glow: "#bd62ff"

    }

};


/* =========================================================
   SHOP
========================================================= */

function renderShop() {

    skinGrid.innerHTML = "";

    Object.entries(skins).forEach(
        ([id, skin]) => {

            const owned =
                ownedSkins.includes(id);

            const selected =
                selectedSkin === id;


            const card =
                document.createElement("div");

            card.className =
                "skin-card" +
                (selected
                    ? " selected"
                    : "");


            card.innerHTML = `

                <div class="skin-preview">

                    <div
                        class="skin-character"
                        style="filter:
                        ${
                            skin.glow
                                ? `drop-shadow(0 0 10px ${skin.glow})`
                                : "none"
                        }"
                    >

                        <div
                            class="skin-head"
                        ></div>

                        <div
                            class="skin-hair"
                            style="
                            background:${skin.hair};
                            "
                        ></div>

                        <div
                            class="skin-body"
                            style="
                            background:${skin.body};
                            "
                        ></div>

                        <div
                            class="skin-leg left"
                        ></div>

                        <div
                            class="skin-leg right"
                        ></div>

                    </div>

                </div>


                <h3>
                    ${skin.name}
                </h3>


                <p>
                    ${
                        skin.price === 0
                            ? "FREE"
                            : `🪙 ${skin.price}`
                    }
                </p>


                <button
                    class="skin-btn
                    ${
                        selected
                            ? "equipped"
                            : owned
                                ? ""
                                : "buy"
                    }"
                    data-skin="${id}"
                >

                    ${
                        selected
                            ? "✓ EQUIPPED"
                            : owned
                                ? "SELECT"
                                : `BUY 🪙 ${skin.price}`
                    }

                </button>

            `;


            const button =
                card.querySelector(
                    ".skin-btn"
                );


            button.addEventListener(
                "click",
                () => {

                    if (owned) {

                        selectedSkin = id;

                        localStorage.setItem(
                            "jungleSkin",
                            id
                        );

                        renderShop();

                        return;

                    }


                    if (
                        bankCoins >=
                        skin.price
                    ) {

                        bankCoins -=
                            skin.price;

                        ownedSkins.push(id);

                        selectedSkin = id;


                        localStorage.setItem(
                            "jungleCoins",
                            bankCoins
                        );


                        localStorage.setItem(
                            "jungleOwnedSkins",
                            JSON.stringify(
                                ownedSkins
                            )
                        );


                        localStorage.setItem(
                            "jungleSkin",
                            selectedSkin
                        );


                        updateWallet();

                        renderShop();

                    }

                }
            );


            skinGrid.appendChild(card);

        }
    );

}


function updateWallet() {

    menuCoins.textContent =
        bankCoins;

    shopCoins.textContent =
        bankCoins;

}


updateWallet();

renderShop();


/* =========================================================
   GAME STATE
========================================================= */

let running = false;

let distance = 0;

let runCoins = 0;

let speed = 0;

let elapsed = 0;

let spawnTimer = 0;

let coinTimer = 0;


/*
    สำคัญ:

    เกมจะไม่สามารถชนทันทีหลังเริ่ม

    safeStart = เวลาปลอดภัย
*/

let safeStart = 2.2;


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

    jumpPower: 15,

    gravity: 0.72

};


/* =========================================================
   OBJECTS
========================================================= */

let obstacles = [];

let coinObjects = [];

let particles = [];


/* =========================================================
   POWER
========================================================= */

let shieldTimer = 0;


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;


function initAudio() {

    if (!audioContext) {

        try {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        } catch {

            audioContext = null;

        }

    }

    if (
        audioContext &&
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


function playSound(type) {

    if (!audioContext)
        return;


    const osc =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );


    const now =
        audioContext.currentTime;


    if (type === "coin") {

        osc.frequency.setValueAtTime(
            650,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            1100,
            now + 0.1
        );

        gain.gain.setValueAtTime(
            0.06,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.12
        );

        osc.start(now);

        osc.stop(
            now + 0.12
        );

    }


    if (type === "jump") {

        osc.frequency.setValueAtTime(
            240,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            520,
            now + 0.12
        );

        gain.gain.setValueAtTime(
            0.04,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.15
        );

        osc.start(now);

        osc.stop(
            now + 0.15
        );

    }


    if (type === "hit") {

        osc.type =
            "sawtooth";

        osc.frequency.setValueAtTime(
            130,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            45,
            now + 0.25
        );

        gain.gain.setValueAtTime(
            0.08,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.25
        );

        osc.start(now);

        osc.stop(
            now + 0.25
        );

    }

}


/* =========================================================
   ROAD
========================================================= */

function laneX(lane) {

    const spacing =
        Math.min(
            W * 0.18,
            125
        );

    return (
        W / 2 +
        (lane - 1) *
        spacing
    );

}


/* =========================================================
   START
========================================================= */

function startGame() {

    initAudio();


    running = true;


    distance = 0;

    runCoins = 0;

    speed = 5;

    elapsed = 0;

    spawnTimer = 1.3;

    coinTimer = 2.0;

    safeStart = 2.2;


    obstacles = [];

    coinObjects = [];

    particles = [];


    player.lane = 1;

    player.targetLane = 1;

    player.y = 0;

    player.velocityY = 0;

    player.jumping = false;

    player.sliding = false;


    shieldTimer = 0;

    powerUp.style.display =
        "none";


    menu.classList.remove(
        "active"
    );

    shop.classList.remove(
        "active"
    );

    gameOver.classList.remove(
        "active"
    );

    gameScreen.classList.add(
        "active"
    );


    updateHUD();

}


/* =========================================================
   END GAME
========================================================= */

function endGame(reason) {

    if (!running)
        return;


    running = false;


    playSound("hit");


    const earned =
        runCoins;


    bankCoins +=
        earned;


    localStorage.setItem(
        "jungleCoins",
        bankCoins
    );


    const currentDistance =
        Math.floor(distance);


    if (
        currentDistance >
        best
    ) {

        best =
            currentDistance;


        localStorage.setItem(
            "jungleBest",
            best
        );

    }


    finalDistance.textContent =
        currentDistance +
        " m";


    finalCoins.textContent =
        earned;


    finalBest.textContent =
        best +
        " m";


    deathReason.textContent =
        reason;


    updateWallet();


    gameScreen.classList.add(
        "shake"
    );


    setTimeout(() => {

        gameScreen.classList.remove(
            "shake"
        );

        gameOver.classList.add(
            "active"
        );

    }, 250);

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    distanceText.textContent =
        Math.floor(distance) +
        " m";


    coinsText.textContent =
        runCoins;


    bestText.textContent =
        best +
        " m";

}


/* =========================================================
   MOVEMENT
========================================================= */

function moveLeft() {

    if (!running)
        return;

    if (
        player.targetLane >
        0
    ) {

        player.targetLane--;

    }

}


function moveRight() {

    if (!running)
        return;

    if (
        player.targetLane <
        2
    ) {

        player.targetLane++;

    }

}


function jump() {

    if (!running)
        return;


    if (
        !player.jumping &&
        !player.sliding
    ) {

        player.velocityY =
            player.jumpPower;

        player.jumping = true;

        playSound("jump");

    }

}


function slide() {

    if (!running)
        return;


    if (
        !player.jumping
    ) {

        player.sliding = true;


        setTimeout(
            () => {

                player.sliding =
                    false;

            },
            600
        );

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "ArrowLeft" ||
            event.key.toLowerCase() ===
            "a"
        ) {

            moveLeft();

        }


        if (
            event.key ===
            "ArrowRight" ||
            event.key.toLowerCase() ===
            "d"
        ) {

            moveRight();

        }


        if (
            event.key ===
            "ArrowUp" ||
            event.key.toLowerCase() ===
            "w" ||
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            jump();

        }


        if (
            event.key ===
            "ArrowDown" ||
            event.key.toLowerCase() ===
            "s"
        ) {

            slide();

        }

    }
);


/* =========================================================
   BUTTONS
========================================================= */

leftBtn.addEventListener(
    "pointerdown",
    e => {

        e.preventDefault();

        moveLeft();

    }
);


rightBtn.addEventListener(
    "pointerdown",
    e => {

        e.preventDefault();

        moveRight();

    }
);


jumpBtn.addEventListener(
    "pointerdown",
    e => {

        e.preventDefault();

        jump();

    }
);


slideBtn.addEventListener(
    "pointerdown",
    e => {

        e.preventDefault();

        slide();

    }
);


/* =========================================================
   TOUCH
========================================================= */

let touchX = 0;

let touchY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        const t =
            event.changedTouches[0];

        touchX =
            t.clientX;

        touchY =
            t.clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const t =
            event.changedTouches[0];

        const dx =
            t.clientX -
            touchX;

        const dy =
            t.clientY -
            touchY;


        if (
            Math.abs(dx) < 30 &&
            Math.abs(dy) < 30
        ) {

            jump();

            return;

        }


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (dx > 0)
                moveRight();

            else
                moveLeft();

        } else {

            if (dy < 0)
                jump();

            else
                slide();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   SPAWN OBSTACLE
========================================================= */

function spawnObstacle() {

    /*
        ระบบใหม่:

        จะไม่สุ่มสิ่งกีดขวาง 3 เลนพร้อมกัน

        อย่างน้อย 1 เลนต้องว่างเสมอ
    */


    const blockedCount =
        Math.random() < 0.18
            ? 2
            : 1;


    const lanes =
        [0, 1, 2];


    lanes.sort(
        () => Math.random() - 0.5
    );


    for (
        let i = 0;
        i < blockedCount;
        i++
    ) {

        const typePool = [

            "rock",

            "wall",

            "fire",

            "tree"

        ];


        const type =
            typePool[
                Math.floor(
                    Math.random() *
                    typePool.length
                )
            ];


        obstacles.push({

            lane: lanes[i],

            z: 1.0,

            type: type,

            passed: false,

            width:
                type === "tree"
                    ? 0.42
                    : 0.36

        });

    }

}


/* =========================================================
   COINS
========================================================= */

function spawnCoins() {

    const lane =
        Math.floor(
            Math.random() * 3
        );


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        coinObjects.push({

            lane: lane,

            z:
                1.0 +
                i * 0.08,

            collected: false

        });

    }

}


/* =========================================================
   PROJECT
========================================================= */

function project(z) {

    const horizon =
        H * 0.30;


    const bottom =
        H * 1.05;


    const depth =
        1 - z;


    const y =
        horizon +
        Math.pow(
            depth,
            1.35
        ) *
        (
            bottom -
            horizon
        );


    const scale =
        0.18 +
        depth *
        1.15;


    return {

        y,

        scale

    };

}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );


    gradient.addColorStop(
        0,
        "#08172c"
    );


    gradient.addColorStop(
        0.45,
        "#19515a"
    );


    gradient.addColorStop(
        1,
        "#10291f"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* Moon */

    ctx.beginPath();

    ctx.arc(
        W * 0.78,
        H * 0.16,
        Math.min(W,H) *
        0.055,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,232,170,0.85)";

    ctx.fill();


    /* Mountains */

    ctx.fillStyle =
        "#0c3033";


    ctx.beginPath();

    ctx.moveTo(
        0,
        H * 0.42
    );


    for (
        let x = 0;
        x <= W;
        x += 80
    ) {

        const y =
            H * 0.31 +
            Math.sin(
                x * 0.012
            ) * 35;


        ctx.lineTo(
            x,
            y
        );

    }


    ctx.lineTo(
        W,
        H * 0.55
    );

    ctx.lineTo(
        0,
        H * 0.55
    );

    ctx.closePath();

    ctx.fill();

}


/* =========================================================
   ROAD
========================================================= */

function drawRoad() {

    const horizon =
        H * 0.30;

    const bottom =
        H * 1.1;


    const roadTop =
        W * 0.09;

    const roadBottom =
        W * 0.88;


    ctx.beginPath();


    ctx.moveTo(
        W/2 -
        roadTop/2,
        horizon
    );


    ctx.lineTo(
        W/2 +
        roadTop/2,
        horizon
    );


    ctx.lineTo(
        W/2 +
        roadBottom/2,
        bottom
    );


    ctx.lineTo(
        W/2 -
        roadBottom/2,
        bottom
    );


    ctx.closePath();


    const gradient =
        ctx.createLinearGradient(
            0,
            horizon,
            0,
            bottom
        );


    gradient.addColorStop(
        0,
        "#465146"
    );


    gradient.addColorStop(
        1,
        "#1b2520"
    );


    ctx.fillStyle =
        gradient;


    ctx.fill();


    /* Edges */

    ctx.strokeStyle =
        "rgba(205,184,120,0.5)";


    ctx.lineWidth = 4;


    ctx.beginPath();


    ctx.moveTo(
        W/2 -
        roadTop/2,
        horizon
    );


    ctx.lineTo(
        W/2 -
        roadBottom/2,
        bottom
    );


    ctx.moveTo(
        W/2 +
        roadTop/2,
        horizon
    );


    ctx.lineTo(
        W/2 +
        roadBottom/2,
        bottom
    );


    ctx.stroke();


    /* Lane lines */

    for (
        let lane = 0;
        lane < 2;
        lane++
    ) {

        const topX =
            W/2 +
            (lane - 0.5) *
            roadTop;


        const bottomX =
            W/2 +
            (lane - 0.5) *
            roadBottom;


        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";


        ctx.lineWidth = 2;

        ctx.setLineDash(
            [25,30]
        );


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
   OBSTACLE DRAWING
========================================================= */

function drawObstacle(
    object
) {

    const p =
        project(
            object.z
        );


    const x =
        laneX(
            object.lane
        );


    const y =
        p.y;


    const s =
        p.scale;


    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.scale(
        s,
        s
    );


    if (
        object.type ===
        "rock"
    ) {

        ctx.fillStyle =
            "#58615d";


        ctx.beginPath();

        ctx.moveTo(
            -34,
            0
        );

        ctx.lineTo(
            -24,
            -35
        );

        ctx.lineTo(
            -5,
            -48
        );

        ctx.lineTo(
            25,
            -34
        );

        ctx.lineTo(
            35,
            0
        );

        ctx.closePath();

        ctx.fill();

    }


    if (
        object.type ===
        "tree"
    ) {

        ctx.fillStyle =
            "#5a3d25";


        ctx.fillRect(
            -8,
            -80,
            16,
            80
        );


        ctx.fillStyle =
            "#164c35";


        const leaves = [

            [-25,-75,27],

            [25,-75,27],

            [0,-110,36],

            [-10,-45,28]

        ];


        leaves.forEach(
            item => {

                ctx.beginPath();

                ctx.arc(
                    item[0],
                    item[1],
                    item[2],
                    0,
                    Math.PI*2
                );

                ctx.fill();

            }
        );

    }


    if (
        object.type ===
        "wall"
    ) {

        ctx.fillStyle =
            "#75533a";


        ctx.fillRect(
            -40,
            -60,
            80,
            60
        );


        ctx.fillStyle =
            "rgba(255,255,255,0.08)";


        for (
            let i=0;
            i<3;
            i++
        ) {

            ctx.fillRect(
                -30 +
                i*25,
                -50,
                17,
                15
            );

        }

    }


    if (
        object.type ===
        "fire"
    ) {

        ctx.shadowBlur =
            20;

        ctx.shadowColor =
            "#ff6428";


        ctx.fillStyle =
            "#ff9d24";


        ctx.beginPath();


        ctx.moveTo(
            -25,
            0
        );


        ctx.lineTo(
            -10,
            -45
        );


        ctx.lineTo(
            5,
            -20
        );


        ctx.lineTo(
            22,
            -52
        );


        ctx.lineTo(
            28,
            0
        );


        ctx.closePath();


        ctx.fill();


        ctx.shadowBlur = 0;

    }


    ctx.restore();

}


/* =========================================================
   COIN DRAW
========================================================= */

function drawCoin(
    coin,
    time
) {

    const p =
        project(
            coin.z
        );


    const x =
        laneX(
            coin.lane
        );


    const y =
        p.y -
        45 *
        p.scale;


    const s =
        p.scale;


    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.scale(
        s,
        s
    );


    const rot =
        Math.sin(
            time * 0.008
        );


    ctx.scale(
        Math.max(
            0.25,
            Math.abs(rot)
        ),
        1
    );


    ctx.shadowBlur = 15;

    ctx.shadowColor =
        "#ffd34d";


    ctx.fillStyle =
        "#ffd34d";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        14,
        0,
        Math.PI*2
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.strokeStyle =
        "#fff1a5";


    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(
    time
) {

    const skin =
        skins[
            selectedSkin
        ];


    const x =
        laneX(
            player.lane
        );


    const ground =
        H * 0.84;


    const y =
        ground -
        player.y;


    const runningAnim =
        Math.sin(
            time * 0.018
        ) * 5;


    ctx.save();


    ctx.translate(
        x,
        y
    );


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,0.3)";


    ctx.beginPath();


    ctx.ellipse(
        0,
        5,
        player.sliding
            ? 35
            : 25,
        8,
        0,
        0,
        Math.PI*2
    );


    ctx.fill();


    /* Skin glow */

    if (
        skin.glow
    ) {

        ctx.shadowBlur =
            15;

        ctx.shadowColor =
            skin.glow;

    }


    if (
        player.sliding
    ) {

        ctx.fillStyle =
            skin.body;


        ctx.beginPath();


        ctx.roundRect(
            -30,
            -32,
            58,
            24,
            12
        );


        ctx.fill();

    }

    else {

        /* Legs */

        ctx.shadowBlur = 0;

        ctx.strokeStyle =
            "#172c28";


        ctx.lineWidth = 9;

        ctx.lineCap =
            "round";


        ctx.beginPath();


        ctx.moveTo(
            -8,
            -8
        );


        ctx.lineTo(
            -15 +
            runningAnim,
            8
        );


        ctx.moveTo(
            8,
            -8
        );


        ctx.lineTo(
            15 -
            runningAnim,
            8
        );


        ctx.stroke();


        /* Body */

        ctx.shadowBlur =
            skin.glow
                ? 12
                : 0;


        ctx.shadowColor =
            skin.glow ||
            "transparent";


        ctx.fillStyle =
            skin.body;


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

        ctx.shadowBlur = 0;

        ctx.fillStyle =
            skin.scarf;


        ctx.fillRect(
            -20,
            -48,
            40,
            9
        );


        /* Head */

        ctx.fillStyle =
            "#e4bd92";


        ctx.beginPath();


        ctx.arc(
            0,
            -77,
            17,
            0,
            Math.PI*2
        );


        ctx.fill();


        /* Hair */

        ctx.fillStyle =
            skin.hair;


        ctx.beginPath();


        ctx.arc(
            0,
            -84,
            17,
            Math.PI,
            Math.PI*2
        );


        ctx.fill();


        /* Arms */

        ctx.strokeStyle =
            skin.body;


        ctx.lineWidth = 8;


        ctx.beginPath();


        ctx.moveTo(
            -17,
            -48
        );


        ctx.lineTo(
            -29,
            -27 +
            runningAnim
        );


        ctx.moveTo(
            17,
            -48
        );


        ctx.lineTo(
            29,
            -27 -
            runningAnim
        );


        ctx.stroke();

    }


    ctx.restore();

}


/* =========================================================
   PARTICLES
========================================================= */

function particlesCreate(
    x,
    y,
    amount
) {

    for (
        let i=0;
        i<amount;
        i++
    ) {

        particles.push({

            x,

            y,

            vx:
                (Math.random()-0.5)*6,

            vy:
                (Math.random()-0.5)*6,

            life: 1,

            size:
                Math.random()*4+2

        });

    }

}


function updateParticles() {

    particles.forEach(
        p => {

            p.x += p.vx;

            p.y += p.vy;

            p.vy += 0.1;

            p.life -= 0.03;

        }
    );


    particles =
        particles.filter(
            p =>
                p.life > 0
        );

}


function drawParticles() {

    particles.forEach(
        p => {

            ctx.globalAlpha =
                p.life;


            ctx.fillStyle =
                "#ffd34d";


            ctx.beginPath();


            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI*2
            );


            ctx.fill();

        }
    );


    ctx.globalAlpha = 1;

}


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(
    dt
) {

    player.lane +=
        (
            player.targetLane -
            player.lane
        ) *
        Math.min(
            1,
            dt * 12
        );


    if (
        player.jumping
    ) {

        player.y +=
            player.velocityY;

        player.velocityY -=
            player.gravity;


        if (
            player.y <= 0
        ) {

            player.y = 0;

            player.velocityY = 0;

            player.jumping =
                false;

        }

    }

}


/* =========================================================
   COLLISION
========================================================= */

function checkCollisions() {

    /*
        ไม่ตรวจชนช่วงเริ่มต้น
    */

    if (
        safeStart > 0
    ) {

        return;

    }


    for (
        const obstacle of
        obstacles
    ) {

        /*
            collision zone แคบกว่าเดิม
        */

        const inDepth =
            obstacle.z <
            0.14 &&
            obstacle.z >
            -0.04;


        if (!inDepth)
            continue;


        const laneDistance =
            Math.abs(
                obstacle.lane -
                player.lane
            );


        /*
            ต้องอยู่เลนเดียวกันจริง ๆ
        */

        if (
            laneDistance >
            0.28
        ) {

            continue;

        }


        /*
            กระโดดสูงพอ
        */

        if (
            player.y >
            58
        ) {

            continue;

        }


        /*
            สิ่งกีดขวางบางชนิด
            สามารถสไลด์ผ่าน
        */

        if (
            player.sliding &&
            obstacle.type ===
            "wall"
        ) {

            continue;

        }


        endGame(
            "You hit an obstacle!"
        );

        return;

    }


    /*
        COINS
    */

    for (
        const coin of
        coinObjects
    ) {

        if (
            coin.collected
        )
            continue;


        const close =
            coin.z <
            0.16 &&
            coin.z >
            -0.02;


        if (!close)
            continue;


        const sameLane =
            Math.abs(
                coin.lane -
                player.lane
            ) <
            0.4;


        if (!sameLane)
            continue;


        coin.collected =
            true;


        runCoins++;


        playSound(
            "coin"
        );


        particlesCreate(
            laneX(
                coin.lane
            ),
            H * 0.75,
            10
        );

    }

}


/* =========================================================
   WORLD UPDATE
========================================================= */

function updateWorld(
    dt
) {

    /*
        ใช้ delta time
        ทำให้ความเร็วเสถียรกว่าเดิม
    */

    const movement =
        speed *
        dt *
        0.075;


    obstacles.forEach(
        obstacle => {

            obstacle.z -=
                movement;

        }
    );


    coinObjects.forEach(
        coin => {

            coin.z -=
                movement;

        }
    );


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.z >
                -0.15
        );


    coinObjects =
        coinObjects.filter(
            coin =>
                coin.z >
                -0.15 &&
                !coin.collected
        );

}


/* =========================================================
   SPAWN
========================================================= */

function updateSpawning(
    dt
) {

    spawnTimer -= dt;

    coinTimer -= dt;


    if (
        spawnTimer <= 0
    ) {

        spawnObstacle();


        /*
            เริ่มห่าง
            แล้วค่อยเร็วขึ้น
        */

        const difficulty =
            Math.min(
                1,
                distance / 700
            );


        spawnTimer =
            1.8 -
            difficulty *
            0.55;


        /*
            ป้องกัน spawn
            ติดกันเกินไป
        */

        spawnTimer =
            Math.max(
                1.15,
                spawnTimer
            );

    }


    if (
        coinTimer <= 0
    ) {

        spawnCoins();

        coinTimer = 2.5;

    }

}


/* =========================================================
   DRAW
========================================================= */

function drawWorld(
    time
) {

    drawBackground();

    drawRoad();


    const objects = [

        ...obstacles.map(
            object => ({
                type:
                    "obstacle",
                object
            })
        ),

        ...coinObjects.map(
            object => ({
                type:
                    "coin",
                object
            })
        )

    ];


    objects.sort(
        (a,b) =>
            b.object.z -
            a.object.z
    );


    objects.forEach(
        item => {

            if (
                item.type ===
                "obstacle"
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

        }
    );


    drawPlayer(
        time
    );


    drawParticles();

}


/* =========================================================
   GAME LOOP
========================================================= */

let lastTime =
    performance.now();


function gameLoop(
    timestamp
) {

    const dt =
        Math.min(
            0.033,
            (
                timestamp -
                lastTime
            ) / 1000
        );


    lastTime =
        timestamp;


    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    if (running) {

        elapsed += dt;

        safeStart -= dt;


        /*
            ความเร็วค่อย ๆ เพิ่ม
        */

        speed =
            Math.min(
                11,
                5 +
                distance *
                0.004
            );


        distance +=
            speed *
            dt *
            3;


        updatePlayer(
            dt
        );


        updateSpawning(
            dt
        );


        updateWorld(
            dt
        );


        updateParticles();


        checkCollisions();


        if (
            shieldTimer > 0
        ) {

            shieldTimer -= dt;


            if (
                shieldTimer <= 0
            ) {

                powerUp.style.display =
                    "none";

            }

        }


        updateHUD();

    }


    drawWorld(
        timestamp
    );


    requestAnimationFrame(
        gameLoop
    );

}


requestAnimationFrame(
    gameLoop
);


/* =========================================================
   MENU / SHOP
========================================================= */

skinsBtn.addEventListener(
    "click",
    () => {

        menu.classList.remove(
            "active"
        );

        shop.classList.add(
            "active"
        );

        updateWallet();

        renderShop();

    }
);


backMenuBtn.addEventListener(
    "click",
    () => {

        shop.classList.remove(
            "active"
        );

        menu.classList.add(
            "active"
        );

    }
);


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

        updateWallet();

    }
);
