"use strict";
// buttons
let rollDiceBtn = document.querySelector("#roll-dice");
let holdBtn = document.querySelector("#hold");
let newGameBtn = document.querySelector("#new-game");
let navigationPanel = document.getElementById("nav-panel");

// points
let score = document.querySelectorAll(".score");
let dices = document.querySelectorAll(".dice");

// players
let player1 = {
  name: "Alena",
  playerName: document.getElementById("name--1"),
  score: document.getElementById("score--1"),
  current: document.getElementById("current--1"),
  field: document.querySelector(".player1"),
  total: document.getElementById("total--1"),
};
let player2 = {
  name: "Alex",
  playerName: document.getElementById("name--2"),
  score: document.getElementById("score--2"),
  current: document.getElementById("current--2"),
  field: document.querySelector(".player2"),
  total: document.getElementById("total--2"),
};

let players = [player1, player2];
let activePlayer;
// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 100,
  selected: "rgba(255, 255, 255, 0.6)",
  unSelected: "rgba(255, 255, 255, 0.2)",
  killerCombo: [],
  winnerCombo: [],
  symbols: ["🔵", "🟠"],
};

let dotsOnDice = new Map([
  [1, {style:"top: 10%; left: 10%"}],
  [2, {style:"top: 10%; left: 40%"}],
  [3, {style:"top: 10%; left: 70%"}],
  [4, {style:"top: 40%; left: 40%"}],
  [5, {style:"top: 70%; left: 10%"}],
  [6, {style:"top: 70%; left: 40%"}],
  [7, {style:"top: 70%; left: 70%"}],
]);


let diceView2 = new Map([
  [1, [4]],
  [2, [3, 5]],
  [3, [3, 4, 5]],
  [4, [1, 3, 5, 7]],
  [5, [1, 3, 4, 5, 7]],
  [6, [1, 2, 3, 5, 6, 7]],
]);

let switchActivePlayer = function(){
  activePlayer = activePlayer === players[0] ? players[1] : players[0];
  switchBtn(holdBtn, "off");
}

let displayDice = function (diceId, numberOnDice) {
  dices[diceId].style.opacity = 100;
  dices[diceId].innerHTML = '';
  diceView2.get(numberOnDice).forEach((dot) =>
      dices[diceId].insertAdjacentHTML("afterbegin", `<div class="dot" style="${dotsOnDice.get(dot).style}">${settings.symbols[diceId]}</div>`));
};


let checkWinOrLose = function(player, arr){
  if (arr.join('') === settings.killerCombo.join('')) {
    player.current.textContent = 0;
    player.current.textContent = 0;
    displayPlayerResult(player, "lose");
    return true;
   } else if (arr.join('') === settings.winnerCombo.join('')){
     displayPlayerResult(player, "lucky");
    return true;
      }

}


let rollDice = function(){
  switchBtn(holdBtn, "on");
  let numbers = randomNumbers(2);
  for (let i=0; i<2; i++){
    displayDice(i, numbers[i]);
    dices[i].value = numbers[i];
  }
  if (!checkWinOrLose(activePlayer, numbers)){
    if (!numbers.includes(1)) {
      numbers[0] === numbers[1] ? activePlayer.current.textContent = Number(activePlayer.current.textContent) + numbers[0] * 4 : activePlayer.current.textContent = Number(activePlayer.current.textContent) + numbers[0] + numbers[1];
      switchBtn(holdBtn, "on");
    } else {
      if (numbers[0] == 1) {
          activePlayer.score.textContent = 0;
      }
      activePlayer.current.textContent = 0;
      activePlayer.field.style.backgroundColor = settings.unSelected;
      switchActivePlayer();
      activePlayer.field.style.backgroundColor = settings.selected;


        }
  }

};


function displayPlayerResult(player, result) {
  if (result == "win") {
    player.field.style.backgroundColor = "rgba(0, 255, 250, 0.6)";
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">${player1.name} wins!</div>`);
    activePlayer.total.textContent = Number(activePlayer.total.textContent) + 1;
  } else if (result == "lose") {
    player.field.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">${player1.name} lost! 🖕</div>`);
    switchActivePlayer();
    activePlayer.total.textContent = Number(activePlayer.total.textContent) + 1;
  } else if (result == "lucky") {
    player.field.style.backgroundColor = "rgba(255, 200, 0, 0.7)";
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">Lucky shot! ${player1.name} wins!</div>`);
    activePlayer.total.textContent = Number(activePlayer.total.textContent) + 1;
  }

  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
}

let holdResult = function(){
  activePlayer.score.textContent = Number(activePlayer.score.textContent) + Number(activePlayer.current.textContent);
  activePlayer.current.textContent = 0;
  if (Number(activePlayer.score.textContent) >= settings.goal
  ) {
    displayPlayerResult(activePlayer, "win");
  } else {
    activePlayer.field.style.backgroundColor = settings.unSelected;
    switchActivePlayer();
    activePlayer.field.style.backgroundColor = settings.selected;
  }
}

let startGame = function(){
  activePlayer = activePlayer === players[0] ? players[1] : players[0];
  if (document.querySelector(".message")) document.querySelector(".message").remove();
  switchBtn(rollDiceBtn, "on");
  switchBtn(hold, "off");
  for (let i = 0; i<2; i++){
      players[i].playerName.textContent = players[i].name;
      players[i].score.textContent = 0;
      players[i].current.textContent = 0;
      players[i].field.style.backgroundColor = settings.unSelected;
    }
  activePlayer.field.style.backgroundColor = settings.selected;
}



let randomNumbers = function (x) {
  let arr = [];
  for (let i =0; i<x; i++) arr.push(Math.trunc(Math.random() * 6 + 1));
  return arr;
};



let switchBtn = function (button, position) {
  if (position == "on") {
    button.disabled = false;
    button.style = settings.selected;
  } else if (position == "off") {
    button.disabled = true;
    button.style = settings.unSelected;
  }
};




newGameBtn.addEventListener("click", startGame);

rollDiceBtn.addEventListener("click", rollDice);

holdBtn.addEventListener("click", holdResult);

document.addEventListener('keyup', function(e){
  if (e.key == "Enter") {
    startGame()
  } else if (e.key == "Control"){
    rollDice();
  } else if (e.key == " "){
    holdResult();
  }
});



