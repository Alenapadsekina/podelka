"use strict";
// buttons
let oneDice = document.querySelector("#roll-dice");
let twoDices = document.querySelector("#hold");
let fiveDices = document.querySelector("#new-game");


oneDice.addEventListener("click", function(){
  location.href = "oneDice.html";
});

twoDices.addEventListener("click", function(){
    location.href = "twoDices.html";
  });

fiveDices.addEventListener("click", function(){
    location.href = "fiveDices.html";
  });