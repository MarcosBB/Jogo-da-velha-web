export class Player {
    constructor(symbol, isBot) {
        this.symbol = symbol
        this.score = 0
        this.isBot = isBot
    }
}


class Board {
    constructor(side) {
        this.boxes = this.createBoxes(side)
        this.htmlBoxes = document.querySelectorAll('.game-table-division')
        this.side = parseInt(side)
    }

    createBoxes(side) {
        let boxes = []
        let total = side * side
        let parentElement = document.querySelector('.game-table')
        this.htmlBoxes = document.querySelectorAll('.game-table-division')

        if (this.htmlBoxes != null) {
            this.htmlBoxes.forEach(function(elemento) {
                if (elemento.parentNode) {
                    elemento.parentNode.removeChild(elemento);
                }
            });
        }
        
        parentElement.style.gridTemplateColumns = `repeat(${side}, auto)`
    
        for (let i = 0; i < total; i++) {
            boxes[i] = ""
            let division = document.createElement("div")
            division.classList.add("game-table-division")
            parentElement.appendChild(division)
        }
        return boxes
    }

    getLines() {
        let lines = []
       

        // horizontal
        for (let i = 0; i < this.side; i++) {
            let line = {}
            for (let j = 0; j < this.side; j++) {
                line[j + this.side*i] = this.boxes[j+this.side*i]
            }
            lines.push(line)
        }

        // vertical
        for (let i = 0; i < this.side; i++) {
            let line = {}
            for (let j = 0; j < this.side; j++) {
                line[j*this.side + i] = this.boxes[i+j * this.side]
            }
            lines.push(line)
        }

        // diagonal
        let line = {}
        for (let i = 0; i < this.side; i++) {
            line[(this.side+1)*i] = this.boxes[(this.side+1)*i]
        }
        lines.push(line)

        line = {}
        for (let i = 0; i < this.side; i++) {
            line[this.side-1+(this.side-1)*i] = this.boxes[this.side-1+(this.side-1)*i]
        }
        lines.push(line)
        return lines
    }

    addSymbol(boxIndex, player) {
        let img = document.createElement("img")
        img.classList.add("game-table-division-img")
        img.src = `./img/icons/${player.symbol}.svg`
        this.htmlBoxes[boxIndex].appendChild(img)
    }
}


export default class Game {
    constructor(side, player1, player2, currentPlayer) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Board(side)
        this.winner = null
        this.bot = new Bot("hard")

        if (currentPlayer) {
            this.currentPlayer = currentPlayer
        }
        else {
            this.currentPlayer = this.randomPlayer(player1, player2)
        }

        this.setCurrentPlayerFlag(this.currentPlayer)

        this.board.htmlBoxes.forEach((box) => {
            box.addEventListener('click', () => {
                if (!this.currentPlayer.isBot) {
                    let boxIndex = Array.from(this.board.htmlBoxes).indexOf(box)
                    this.move(boxIndex, this.currentPlayer)
                }
            })
        })

        let buttonImg = document.querySelector('.game-hud-play img')
        buttonImg.src = './img/icons/refresh.svg'
        buttonImg.alt = 'Refresh'

        let flagMenu = document.querySelector(".game-hud-flag")
        flagMenu.style.top = "-40px"

        if (this.currentPlayer.isBot) {
            this.move(this.bot.move(this.board), this.currentPlayer)
        }
    }

    randomPlayer(player1, player2) {
        let random = Math.floor(Math.random() * 2)
        if (random === 0) {
            return player1
        }
        else {
            return player2
        }
    }

    changePlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2

        } else {
            this.currentPlayer = this.player1
        }
        this.setCurrentPlayerFlag(this.currentPlayer)
    }

    move(boxIndex, player) {
        if (this.board.boxes[boxIndex] === "" && this.winner === null) {
            this.board.boxes[boxIndex] = player.symbol
            this.board.addSymbol(boxIndex, player)

            if (this.checkWinner(this.currentPlayer.symbol)) {
                this.winner = this.currentPlayer
                this.currentPlayer.score += 1
                this.updateScore()
            }
            else {
                this.changePlayer()
            }
            if (this.currentPlayer.isBot && !this.checkDraw()) {
                setTimeout(() => {
                    this.move(this.bot.move(this.board), this.currentPlayer);
                }, 900);
            }
            
        }
    }

    checkWinner(symbol) {
        let lines = this.board.getLines();
    
        
        for (let i = 0; i < lines.length; i++) {
            if (Object.values(lines[i]).every((value) => value === symbol)) {
                let buttonImg = document.querySelector('.game-hud-play img')
                buttonImg.src = './img/icons/play.svg'
                buttonImg.alt = 'Play'

                let flagMenu = document.querySelector(".game-hud-flag")
                flagMenu.style.top = "2px"
                return true;
            }
        }
        return false;
    }

    

    checkDraw() {
        if (this.board.boxes.every((box) => box !== "")) {
            return true
        }
        return false
    }

    updateScore() {
        let player1Score = document.querySelector('.player1-score')
        let player2Score = document.querySelector('.player2-score')

        player1Score.innerHTML = this.player1.score
        player2Score.innerHTML = this.player2.score
    }

    setCurrentPlayerFlag(player) {
        let player1Flag = document.querySelector("#flag-1")
        let player2Flag = document.querySelector("#flag-2")
        
        if (player === this.player1) {
            player1Flag.style.opacity = 1
            player2Flag.style.opacity = 0

        } else {
            player1Flag.style.opacity = 0
            player2Flag.style.opacity = 1
        }
    }
}


class Bot {
    constructor(difficulty) {
        this.difficulty = difficulty
        this.nextMove = 0
    }

    move(board) {
        if (this.difficulty === "easy") {
            return this.easyMove(board)
        }
        else if(this.difficulty === "medium"){
            return this.mediumMove(board)
        }
        else if(this.difficulty === "hard"){
            return this.hardMove(board)
        }
    }

    easyMove(board) {
        let botMove = Math.floor(Math.random() * board.boxes.length)
        while (board.boxes[botMove] !== "") {
            botMove = Math.floor(Math.random() * board.boxes.length)
        }
        return botMove
    }

    mediumMove(board){
        let random = Math.floor(Math.random() * 2)
        if (random === 0) {
            return this.easyMove(board)
        }
        else {
            return this.hardMove(board)
        }
    }

    hardMove(board){

        function getVoidIndex(line){
            for (var nextMove in line) {
                if (line[nextMove] === '') {
                    return nextMove
                }
            }
            return null
        }

        let isFirstUse = false
        let winConditionPriority = false
        let nextMove

        for(let line of board.getLines()){
            
            let playerWinConditionCount = 0
            let botWinConditionCount = 0
            let keyList = Object.keys(line)
            
            for(let j = 0;j < board.side; j++){
                if(line[keyList[j]] == 'X'){
                    playerWinConditionCount++
                }

                if(line[keyList[j]] == 'O'){
                    botWinConditionCount++
                }

                if(playerWinConditionCount == board.side - 1 && !isFirstUse && !winConditionPriority){
                    let voidIndex = getVoidIndex(line)
                    if(voidIndex){
                        isFirstUse = true
                        nextMove = voidIndex
                    }
                }

                if(botWinConditionCount == board.side - 1 && (!isFirstUse || !winConditionPriority)){
                    let voidIndex = getVoidIndex(line)
                    if(voidIndex){
                        isFirstUse = true
                        winConditionPriority = true
                        return voidIndex
                    }
                }
            }

            isFirstUse = false
            winConditionPriority = false

        }

        if(nextMove){
            let temp = nextMove
            
            if(nextMove){
                nextMove = null
                return temp
            }

            nextMove = null
        }
        return this.easyMove(board)

    }

}