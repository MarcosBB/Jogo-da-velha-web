import MobileNavbar from "./navBar.js"
import Game from "./game.js"

const mobileNavbar = new MobileNavbar(
    ".nav-button-open",
    ".nav-button-close",
    ".menu",
)
mobileNavbar.init()


let play_button = document.querySelector('.game-hud-play')

play_button.addEventListener('click', () => {
    let side = document.querySelector('.menu-options-option-slider').value
    let game = new Game(side)
    console.log(game)
})

