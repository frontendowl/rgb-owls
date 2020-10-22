const complexity = document.querySelectorAll('input[name="complexity"]');
const cards = document.querySelectorAll(".owl");
const labelsText = document.querySelectorAll(".color-info");
const labelsBkg = document.querySelectorAll(".color-bkg");

const svg = document.getElementById("game");
const header = document.getElementById("header");
const rgbCode = document.getElementById("rgb");
const msg = document.getElementById("msg");
const btn = document.querySelector("#header .new-game-btn");

let numOfCards = 6;
let color;
let hidden = 0;
let isLight;

// ADD EVENT LISTENERS
for (let i = 0; i < complexity.length; i++) {
  complexity[i].addEventListener("click", setComplexity);
}
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 13) {
    newGame();
  }
});
btn.addEventListener("click", newGame);

// START GAME
newGame();

// ===============================
//         GAME MECHANICS
// ===============================

function newGame() {
  msg.textContent = "guess the color";
  btn.textContent = "new colors";

  header.removeAttribute("style");
  header.classList.add("default");

  removeClass("right-card");
  removeClass("other-cards");

  unhideCards();

  color = randomRGB(true);
  rgbCode.textContent = color;

  // right card index
  const index = randomNumber(numOfCards);

  // set colors to cards & activate
  for (let i = 0; i < numOfCards; i++) {
    labelsText[i].textContent = "";
    cards[i].style.fill = i === index ? color : randomRGB();
    activate(cards[i]);
  }
}

function checkAnswer() {
  if (this.style.fill === color) {
    found(this);
  } else {
    mistaken(this);
  }
}
function found(rightCard) {
  rightCard.classList.add("right-card");

  msg.textContent = "Correct!";
  btn.textContent = "Play again";
  header.classList.remove("default");
  header.style.backgroundColor = color;
  if (isLight) {
    header.style.color = "black";
  }

  for (let i = 0; i < numOfCards; i++) {
    if (cards[i] !== rightCard) {
      cards[i].classList.add("other-cards");
    }
    labelsText[i].textContent = cards[i].style.fill;
    disable(cards[i]);
  }
  unhideCards();
}
function mistaken(card) {
  msg.textContent = "Try Again";
  card.classList.add("hidden");
  hidden++;
  disable(card);
}

// adjustable complexity
function setComplexity(e) {
  const newNum = Number(e.target.value);
  if (numOfCards !== newNum) {
    if (newNum > numOfCards) {
      for (let i = numOfCards; i < newNum; i++) {
        cards[i].removeAttribute("style");
      }
    } else {
      for (let i = newNum; i < numOfCards; i++) {
        cards[i].style.fill = "none";
        cards[i].style.stroke = "none";
      }
    }
    const height = (newNum / 3) * 135 + 15;
    svg.setAttribute("viewBox", `-10 -10 540 ${height}`);
    numOfCards = newNum;
    newGame();
  }
}

// =====================================
//        SECONDARY FUNCTIONS
// =====================================
function randomNumber(n) {
  return Math.floor(Math.random() * n);
}

function randomRGB(isMain = false) {
  const r = randomNumber(256),
    g = randomNumber(256),
    b = randomNumber(256);
  if (isMain) {
    isLight = (r + g + b) / 3 >= 148;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function removeClass(className) {
  const curClass = document.querySelectorAll("." + className);
  for (let i = 0; i < curClass.length; i++) {
    curClass[i].classList.remove(className);
  }
}

function unhideCards() {
  if (hidden) {
    removeClass("hidden");
    hidden = 0;
  }
}

function triggerClick(elem) {
  const clickEvent = new Event("click");
  elem.dispatchEvent(clickEvent);
}

function clickedByEnter(ev) {
  ev.stopPropagation();
  if (ev.keyCode === 13) {
    triggerClick(ev.target);
  }
}

function activate(card) {
  card.setAttribute("tabindex", 0);
  card.addEventListener("click", checkAnswer);
  card.addEventListener("keydown", clickedByEnter);
}
function disable(card) {
  card.removeEventListener("click", checkAnswer);
  card.removeEventListener("keydown", clickedByEnter);
  card.removeAttribute("tabindex");
}
