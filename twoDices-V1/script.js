"use strict";
// buttons
let rollDiceBtn = document.querySelector("#roll-dice");
let holdBtn = document.querySelector("#hold");
let newGameBtn = document.querySelector("#new-game");
// points
let score = document.querySelectorAll(".score");
let dices = document.querySelectorAll(".dice");
// settings
let settings = {
  count: 1,
  adjustmentValue: 2,
  goal: 100,
  selected: "rgba(255, 255, 255, 0.6)",
  unSelected: "rgba(255, 255, 255, 0.2)",
  killerCombo: [],
  winnerCombo: [],
  players: ["Alena", "Tiago"],
};

let currentPlayer = document.querySelector(".current-player");
let players = document.querySelectorAll(".player");

function diceView(diceId, numberOnDice) {
  let dots = document.querySelectorAll(".dot" + String(diceId));
  for (let dot of dots) dot.style.visibility = "hidden";
  function showDots(visibleDots) {
    dices[diceId].visibility = "visible";
    for (let i of visibleDots) dots[i].style.visibility = "visible";
  }
  switch (numberOnDice) {
    case 1:
      showDots([6]);
      break;
    case 2:
      showDots([0, 5]);
      break;
    case 3:
      showDots([2, 3, 6]);
      break;
    case 4:
      showDots([0, 2, 3, 5]);
      break;
    case 5:
      showDots([0, 2, 3, 5, 6]);
      break;
    case 6:
      showDots([0, 1, 2, 3, 4, 5]);
      break;
  }
}

let startGame = function () {
  for (let i = 0; i < 2; i++) {
    score[i].textContent = 0;
    document.querySelectorAll(".current-number")[i].textContent = 0;
    dices[i].value = 0;
    dices[i].style.visibility = "hidden";
    diceView(i, 0);
    // settings.players[i] = prompt(`Type Player ${i + 1}'s name`);
    // settings.players[i] == ""
    //   ? (players[i].querySelector(".name").textContent = "PLAYER " + (i + 1))
    //   : (players[i].querySelector(".name").textContent = settings.players[i]);
    players[i].querySelector(".name").textContent = settings.players[i];
  }
  settings.count = 1;
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "on");
  document.querySelector(".winner").textContent = "";
  settings.killerCombo = randomPair();
  settings.winnerCombo = randomPair();
  if (settings.killerCombo == settings.winnerCombo) {
    settings.winnerCombo = randomPair();
  }
  console.log(settings.killerCombo);
  console.log(settings.winnerCombo);
};

// set killer combination
let randomPair = function () {
  let blackDiceNumber = Math.trunc(Math.random() * 6 + 1);
  let whiteDiceNumber = Math.trunc(Math.random() * 6 + 1);
  return [blackDiceNumber, whiteDiceNumber];
};
// random number adjustment
let numberOnDice = function () {
  let initialNumber = Math.trunc(Math.random() * 6 + 1);
  let adjustedNumber = 0;
  if (initialNumber == 1) {
    settings.count % settings.adjustmentValue == 0
      ? (adjustedNumber = Math.trunc(Math.random() * 5 + 2))
      : (adjustedNumber = initialNumber);
    console.log(
      `The number has been changed from ${initialNumber} to ${adjustedNumber}`
    );
    settings.count += 1;
  } else {
    adjustedNumber = initialNumber;
  }
  return adjustedNumber;
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
// start new game
newGameBtn.addEventListener("click", function () {
  startGame();
  let activePlayer = defineActivePlayer();
  activePlayer.style.backgroundColor = settings.selected;
});
// roll the dice
function defineActivePlayer() {
  let turn = currentPlayer.textContent;
  let activePlayer = players[turn];
  return activePlayer;
}
function newActivePlayer() {
  Number(currentPlayer.textContent) !== 0
    ? (currentPlayer.textContent = 0)
    : (currentPlayer.textContent = 1);
  switchBtn(holdBtn, "off");
}

rollDiceBtn.addEventListener("click", function () {
  dices[0].style.visibility = "visible";
  dices[1].style.visibility = "visible";
  let activePlayer = defineActivePlayer();
  let number1 = numberOnDice();
  console.log(number1);
  let number2 = numberOnDice();
  console.log(number2);
  diceView(0, number1);
  diceView(1, number2);
  if (
    number1 == settings.killerCombo[0] &&
    number2 == settings.killerCombo[1]
  ) {
    activePlayer.querySelector(".score").textContent = 0;
    activePlayer.querySelector(".current-number").textContent = 0;
    displayPlayerResult(activePlayer, "loose");
  } else if (
    number1 == settings.winnerCombo[0] &&
    number2 == settings.winnerCombo[1]
  ) {
    displayPlayerResult(activePlayer, "lucky");
  } else {
    if (number1 !== 1 && number2 !== 1) {
      if (number1 === number2) {
        activePlayer.querySelector(".current-number").textContent =
          Number(activePlayer.querySelector(".current-number").textContent) +
          number1 * 4;
      } else {
        activePlayer.querySelector(".current-number").textContent =
          Number(activePlayer.querySelector(".current-number").textContent) +
          number1 +
          number2;
      }
      switchBtn(holdBtn, "on");
    } else {
      if (number1 == 1) {
        activePlayer.querySelector(".score").textContent = 0;
      }
      activePlayer.querySelector(".current-number").textContent = 0;

      newActivePlayer();
      activePlayer.style.backgroundColor = settings.unSelected;
      players[currentPlayer.textContent].style.backgroundColor =
        settings.selected;
    }
  }
});

// hold

function displayPlayerResult(player, result) {
  if (result == "win") {
    player.style.backgroundColor = "rgba(0, 255, 250, 0.6)";
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } wins!`;
  } else if (result == "loose") {
    player.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
    document.querySelector(".winner").textContent = `${
      player.querySelector(".name").textContent
    } lost! 🖕`;
  } else if (result == "lucky") {
    player.style.backgroundColor = "rgba(255, 200, 0, 0.7)";
    document.querySelector(".winner").textContent = `Lucky shot! ${
      player.querySelector(".name").textContent
    } wins!`;
  }
  player.style.color = "rgba(255, 255, 255)";
  switchBtn(holdBtn, "off");
  switchBtn(rollDiceBtn, "off");
}

holdBtn.addEventListener("click", function () {
  let activePlayer = defineActivePlayer();
  let currentScore = Number(
    activePlayer.querySelector(".current-number").textContent
  );
  let totalScore = Number(activePlayer.querySelector(".score").textContent);
  activePlayer.querySelector(".score").textContent = totalScore + currentScore;
  activePlayer.querySelector(".current-number").textContent = 0;
  if (
    Number(activePlayer.querySelector(".score").textContent) >= settings.goal
  ) {
    displayPlayerResult(activePlayer, "win");
  } else {
    newActivePlayer();
    activePlayer.style.backgroundColor = settings.unSelected;
    players[currentPlayer.textContent].style.backgroundColor =
      settings.selected;
  }
});
