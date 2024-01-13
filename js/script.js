import MobileNavbar from "./navBar.js"
import Game from "./game.js"
import { Player } from "./game.js"

const mobileNavbar = new MobileNavbar(
    ".nav-button-open",
    ".nav-button-close",
    ".menu",
)
mobileNavbar.init()

let play_button = document.querySelector('.game-hud-play')
let restart_button = document.querySelector('#restart-button')
let botSwitch = document.querySelector(".bot-switch")
let side_selector = document.querySelector('.menu-options-option-slider')


let side 
let player1
let player2
let game

document.addEventListener('DOMContentLoaded', () => {
    side = side_selector.value
    player1 = new Player('X', false)
    player2 = new Player('O', botSwitch.checked)
    game = new Game(side, player1, player2)
    console.log(game)
});

play_button.addEventListener('click', () => {
    game = new Game(side, player1, player2)

    console.log(game)
})

restart_button.addEventListener('click', () => {
    side = side_selector.value
    player1 = new Player('X', false)
    player2 = new Player('O', botSwitch.checked)
    game = new Game(side, player1, player2)
    game.updateScore()

    console.log(game)
})