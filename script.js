const keyboardKeys = Array.from(document.getElementsByClassName("keyboard-key"));
const body = document.querySelector("body");
const howdy = document.querySelector("#howdy");
const board = document.querySelector("#answer");
const canvas = document.querySelector("canvas");
const hint = document.querySelector("#hint");
const ctx = canvas.getContext("2d");
let selectedChars = [];
let wordSpaces = [];
let wordArr = [];
let wordCategory;
let wordLength = 0;
let playerAttempts = 0;
let width = 0;
let height = 0;
let width2 = 0;
let height2 = 0;
let headX1 = 0;
let headX2 = 0;
let headX3 = 0;
let headX4 = 260;
let headX5 = 230;
let armX1 = 220;
let bodyX1 = 0
let legX1 = 0;
let legX2 = 0;

let getWord = () => {
    fetch("https://www.wordgamedb.com/api/v1/words/random").then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data.word);
        wordCategory = data.category;
        wordCategory = wordCategory.charAt(0).toUpperCase() + wordCategory.slice(1);
        Array.from(data.word).forEach((char) => {
            wordArr.push(char);
            wordLength++;
        });
        loadWordSpaces();
    }).catch((e) => {
        console.log("error")
    })
}

let loadWordSpaces = () => {
    for (let i = 0; i < wordArr.length; i++) {
        let myDiv = document.createElement("div");
        myDiv.classList.add("word-space", "word-space-h", "game-text");
        myDiv.innerHTML = "&nbsp";
        wordSpaces.push(myDiv);
        board.appendChild(myDiv);
    }
}

let checkInput = (input, key) => {
    let i = 0;
    let foundMatch = false;
    wordArr.forEach((char) => {
        if (char === input) {
            if (i === 0) {
                wordSpaces[i].innerHTML = `${char.toUpperCase()}`;
            } else {
                wordSpaces[i].innerHTML = `${wordArr[i].toLowerCase()}`;
            }
            keyColor(key, "keypressed-correct");
            foundMatch = true;
            wordLength--;
        }
        i++;
    })
    if (!foundMatch) {
        keyColor(key, "keypressed-incorrect");
        playerAttempts++;
    }
    endGame(wordLength, playerAttempts);
}

let endGame = (charactersLeft, attempts) => {
    if (charactersLeft === 0 || attempts > 8) {
        window.alert("Game over, restart the game to play again.");
    }
}

let loadCanvas = () => {
    canvas.width = 300;
    canvas.height = 500;
}

let canvasDrawSq = (x, y, width, height, color) => {
    ctx.fillStyle = `${color}`;
    ctx.fillRect(x, y, width, height);
}

let canvasDrawLn = (x1, y1, x2, y2, width, color) => {
    ctx.lineWidth = width
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `${color}`;
    ctx.stroke();
}

let canvasDrawCr = (x, y, radius, arc, color, width) => {
    ctx.beginPath();
    ctx.strokeStyle = `${color}`;
    ctx.fillStyle = `${color}`;
    ctx.arc(x, y, radius, arc, false);
    ctx.stroke();
    ctx.fill();
}

let keyColor = (key, classString) => {
    if (!key.classList.contains("keypressed")) {
        key.classList.toggle("keypressed");
        key.classList.toggle(`${classString}`);
    }
}

let loadKeyboardKeysListener = () => {
    keyboardKeys.forEach((key) => {
        key.addEventListener("click", () => {
            buttonAnimation(key);
            if (!(key.classList.contains("keypressed"))) {
                checkInput(key.innerHTML.toLowerCase(), key);
            }
        });
    });
}

let addWindowEventListener = () => {
    window.addEventListener("keypress", (e) => {
        keyboardKeys.forEach((key) => {
            if (e.key.toLowerCase() === key.innerHTML.toLowerCase()) {
                buttonAnimation(key);
                if (!key.classList.contains("keypressed")) {
                    checkInput(e.key.toLowerCase(), key);
                }
            }
        });
    });
}

let addHintEventListener = () => {
    hint.addEventListener("click", () => {
        if (hint.classList.contains("clickable")){
            hint.style.opacity = "0%";
            setTimeout(() => {
                hint.style.opacity = "100%";
                hint.innerHTML = `${wordCategory}`;
                hint.classList.toggle("clickable");
            }, 700)
        }
    });

}

let buttonAnimation = (key) => {
    key.classList.toggle("expand");
    setTimeout(() => {
        key.classList.toggle("expand");
    }, 100);
}

let canvasAnimationParts = (itemToDraw, x1) => {
    let base = () => {
        canvasDrawSq(0, 480, x1, 20, "white"); //base
    }

    let pole = () => {
        canvasDrawSq(65, 0, 20, x1, "white"); //pole
    }

    let poleArm = () => {
        canvasDrawSq(65, 0, x1, 20, "white"); //pole-arm
    }

    let rope = () => {
        canvasDrawSq(215, 0, 1, x1, "white"); //rope
    }

    let head = () => {
        canvasDrawCr(245, 100, 30, x1, "white", 2); //head
        canvasDrawCr(270, 110, 7, x1, "Black", 2);// start glasses
        canvasDrawCr(250, 115, 7, x1, "Black");
        canvasDrawLn(255, 115, 265, 115, 2, "black");
        canvasDrawLn(215, 95, 250, 112, 2, "black");//end glasses
    }

    let body = () => {
        canvasDrawLn(220, 230, 220, 112, 5, "white"); // body
    }

    let arm = () => {
        canvasDrawLn(x1, 200, 220, 112, 5, "white"); // arm
    }

    let leg = () => {
        canvasDrawLn(225, 280, 218, 225, 5, "white"); // thigh
        canvasDrawLn(215, 320, 225, 278, 5, "white"); // calf
    }
    if (itemToDraw === "base") {
        base();
    } else if (itemToDraw === "pole") {
        pole();
    } else if (itemToDraw === "polearm") {
        poleArm();
    } else if (itemToDraw === "rope") {
        rope();
    } else if (itemToDraw === "head") {
        head();
    } else if (itemToDraw === "body") {
        body();
    } else if (itemToDraw === "arm") {
        arm();
    } else if (itemToDraw === "leg") {
        leg();
    }
}

let animate = () => {
    requestAnimationFrame(animate);
    switch (playerAttempts) {
        case (1):
            if (width < 160) {
                width += 20;
                canvasAnimationParts("base", width);
            }
            break;
        case (2):
            if (height < 500) {
                height += 50;
                canvasAnimationParts("pole", height)
            }
            break;
        case (3):
            if (width2 < 150) {
                width2 += 50;
                canvasAnimationParts("polearm", width2);
            }
            break;
        case (4):
            if (height2 < 100) {
                height2 += 20;
                canvasAnimationParts("rope", height2);
            }
            break;
        case (5):
            if (height2 < 100) {
                height2 += 20;
                canvasAnimationParts("rope", height2);
            }
            break;
        case (6):
            if (headX1 < 2000) {
                headX1 += 50;
                headX2 += Math.PI;
                headX3 += Math.PI;
                headX4 += .5;
                headX5 += 1;
                canvasAnimationParts("head", headX1);
            }
            break;
        case (7):
            if (bodyX1 < 112) {
                bodyX1;
                canvasAnimationParts("body", bodyX1);
            }
            break;
        case (8):
            if (armX1 < 225) {
                armX1 += .1;
                canvasAnimationParts("arm", armX1);
            }
            break;
        case (9):
            if (legX1 < 225) {
                legX1 += 1;
                canvasAnimationParts("leg", legX1);
            }
            break;
    }
}

window.alert("To play this game, type or click the letters.\n\nThe categories are randomized. Select the hint button to get a hint.\n\nView the console to get the answer immediately.\n\nYou have 9 lives and the game will display one animation for each life\n\nRefresh to play again. Have fun.");
loadCanvas();
getWord();
animate();
loadKeyboardKeysListener();
addWindowEventListener();
addHintEventListener();