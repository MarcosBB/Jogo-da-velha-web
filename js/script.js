import MobileNavbar from "./navBar.js"
import Game from "./game.js"
import { Player } from "./game.js"

const mobileNavbar = new MobileNavbar(
    ".nav-button-open",
    ".nav-button-close",
    ".menu",
)
mobileNavbar.init()

let player1 = new Player('X')
let player2 = new Player('O')

let play_button = document.querySelector('.game-hud-play')

play_button.addEventListener('click', () => {
    let side = document.querySelector('.menu-options-option-slider').value
    let game = new Game(side, player1, player2)

    let buttonImg = document.querySelector('.game-hud-play img')
    buttonImg.src = './img/icons/refresh.svg'
    buttonImg.alt = 'Refresh'

    let oldFlag = document.querySelector("#flag-2")
    let currFlag = document.querySelector("#flag-1")
    oldFlag.style.opacity = 0
    currFlag.style.opacity = 1

    let flagMenu = document.querySelector(".game-hud-flag")
    flagMenu.style.top = "-40px"
})



var clickTimeout

let slider = document.querySelector('.menu-options-option-slider')
slider.addEventListener("mousedown", function () {
    clickTimeout = setInterval(function() {
        let slideNumber = document.querySelector('#slide-value')
        slideNumber.innerHTML = document.querySelector('.menu-options-option-slider').value
      }, 0);
});

slider.addEventListener("mouseup", function () {
    clearInterval(clickTimeout);
});