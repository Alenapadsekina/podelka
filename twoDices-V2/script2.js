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
  numbers: document.querySelector(".numbers--1"),
  statistics:{1: 0, 2:0, 3:0, 4:0, 5:0, 6:0},
};
let player2 = {
  name: "Alex",
  playerName: document.getElementById("name--2"),
  score: document.getElementById("score--2"),
  current: document.getElementById("current--2"),
  field: document.querySelector(".player2"),
  total: document.getElementById("total--2"),
  numbers: document.querySelector(".numbers--2"),
  statistics:{1: 0, 2:0, 3:0, 4:0, 5:0, 6:0},
};



let players = [player1, player2];
let activePlayer = players[1];
// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 10,
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


let diceView = new Map([
  [1, [4]],
  [2, [3, 5]],
  [3, [3, 4, 5]],
  [4, [1, 3, 5, 7]],
  [5, [1, 3, 4, 5, 7]],
  [6, [1, 2, 3, 5, 6, 7]],
]);

let switchActivePlayer = function(){
  activePlayer.field.style.backgroundColor = settings.unSelected;
  activePlayer = activePlayer === players[1] ? players[0] : players[1];
  switchBtn(holdBtn, "off");
  activePlayer.field.style.backgroundColor = settings.selected;
}

let displayDice = function (diceId, numberOnDice) {
  dices[diceId].style.opacity = 100;
  dices[diceId].innerHTML = '';
  diceView.get(numberOnDice).forEach((dot) =>
      dices[diceId].insertAdjacentHTML("afterbegin", `<div class="dot" style="${dotsOnDice.get(dot).style}">${settings.symbols[diceId]}</div>`));
};


let checkWinOrLose = function(player, arr){
  if (arr.join('') === settings.killerCombo.join('')) {
    player.current.textContent = 0;
    player.current.textContent = 0;
    displayPlayerResult(player, "lose");
    return true;
   }
   if (arr.join('') === settings.winnerCombo.join('')){
    displayPlayerResult(player, "lucky");
    return true;  
  }
};


let rollDice = function(){
  switchBtn(holdBtn, "on");
  let numbers = randomNumbers(2);
  for (let i=0; i<2; i++){
    displayDice(i, numbers[i]);
    // dices[i].value = numbers[i];
   activePlayer.statistics[numbers[i]] += 1;
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
      switchActivePlayer();
        }
  }
};

let results = {
  win: {
    style: "rgba(0, 255, 250, 0.6)",
//    message: `<div class="message">${player.name} wins!</div>`
  },
  lose: {
    style: "rgba(255, 0, 0, 0.6)",
 //   message: `<div class="message">${player.name} lost! 🖕</div>`
    },
  lucky:{
    style: "rgba(255, 200, 0, 0.7)",
 //   message: `<div class="message">Lucky shot! ${player.name} wins!</div>`
    },
}

let addPointToWinner = function(){
  return activePlayer.total.textContent = Number(activePlayer.total.textContent) + 1;
};
let statisticsToConsole = function(){
  console.log(player1.statistics);
  console.log(player2.statistics);
};

function displayPlayerResult(player, result) {
  if (result == "win") {
    player.field.style.backgroundColor = results.win.style;
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">${player.name} wins!</div>`);
    addPointToWinner();
  } else if (result == "lose") {
    player.field.style.backgroundColor = results.lose.style;
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">${player.name} lost! 🖕</div>`);
    switchActivePlayer();
    addPointToWinner();
  } else if (result == "lucky") {
    player.field.style.backgroundColor = results.lucky.style;
    navigationPanel.insertAdjacentHTML("afterend", `<div class="message">Lucky shot! ${player.name} wins!</div>`);
    addPointToWinner();
  }
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
};

let showStatistics1 = function(e){
  showStatistics(e.currentTarget.checked, player1);
}
let showStatistics2 = function(e){
  showStatistics(e.currentTarget.checked, player2);
}
let showStatistics = function(isChecked, player){
  if (isChecked){
    for (let [key, value] of Object.entries(player.statistics)){
      player.numbers.insertAdjacentHTML("beforeend",`<div class="statNumber"><div>${key} - ${value}</div></div>`);
    }
  } else {
    document.querySelectorAll(".statNumber").forEach(node=>node.remove());
  }
};

document.getElementById("statistics--1").addEventListener("click", showStatistics1);
document.getElementById("statistics--2").addEventListener("click", showStatistics2);

let holdResult = function(){
  activePlayer.score.textContent = Number(activePlayer.score.textContent) + Number(activePlayer.current.textContent);
  activePlayer.current.textContent = 0;
  if (Number(activePlayer.score.textContent) >= settings.goal
  ) {
    displayPlayerResult(activePlayer, "win");
  } else {
    switchActivePlayer();
  }
};

let startGame = function(){
  if (document.querySelector(".message")) document.querySelector(".message").remove();
  switchBtn(rollDiceBtn, "on");
  switchBtn(hold, "off");
  settings.killerCombo = randomNumbers(2);
  settings.winnerCombo = randomNumbers(2);
  for (let i = 0; i<players.length; i++){
      players[i].playerName.textContent = players[i].name;
      players[i].score.textContent = 0;
      players[i].current.textContent = 0;
      players[i].field.style.backgroundColor = settings.unSelected;
    }
    switchActivePlayer();
  console.log(settings.killerCombo);
  console.log(settings.winnerCombo);
};



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



