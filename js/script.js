import MobileNavbar from "./navBar.js"
import Game from "./game.js"
import { Player } from "./game.js"

const mobileNavbar = new MobileNavbar(
    ".nav-button-open",
    ".nav-button-close",
    ".menu",
)
mobileNavbar.init()

let playButton = document.querySelector('.game-hud-play')
let restartButton = document.querySelector('#restart-button')
let botSwitch = document.querySelector(".bot-switch")
let sideSelector = document.querySelector('.menu-options-option-slider')
botSwitch.checked = true

let side
let player1
let player2
let game

document.addEventListener('DOMContentLoaded', () => {
    side = sideSelector.value
    player1 = new Player('X', false)
    player2 = new Player('O', botSwitch.checked)
    game = new Game(side, player1, player2)
});

playButton.addEventListener('click', () => {
    let currentPlayer = game.currentPlayer
    game = new Game(side, player1, player2, currentPlayer)
})

restartButton.addEventListener('click', () => {
    side = sideSelector.value
    player1 = new Player('X', false)
    player2 = new Player('O', botSwitch.checked)
    game = new Game(side, player1, player2)
    game.updateScore()
})
