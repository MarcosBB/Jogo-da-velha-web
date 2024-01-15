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
        this.side = side
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
        this.checkWinnerLimit = 0
        this.winConditionPriority = 0

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

    getLines() {
        let lines = []

        // horizontal
        for (let i = 0; i < this.board.side; i++) {
            let line = {}
            for (let j = 0; j < this.board.side; j++) {
                line[j + 3*i] = this.board.boxes[j+3*i]
            }
            lines.push(line)
        }

        // vertical
        for (let i = 0; i < this.board.side; i++) {
            let line = {}
            for (let j = 0; j < this.board.side; j++) {
                line[j*this.board.side + i] = this.board.boxes[i+j * this.board.side]
            }
            lines.push(line)
        }

        // diagonal
        let line = {}
        for (let i = 0; i < this.board.side; i++) {
            line[4*i] = this.board.boxes[4*i]
        }
        lines.push(line)

        line = {}
        for (let i = 0; i < this.board.side; i++) {
            line[2+2*i] = this.board.boxes[2+2*i]
        }
        lines.push(line)
        console.log(lines)
        return lines
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
        let lines = this.getLines();
    
        
        for (let i = 0; i < lines.length; i++) {
            if (Object.values(lines[i]).every((value) => value === symbol)) {
                let buttonImg = document.querySelector('.game-hud-play img')
                buttonImg.src = './img/icons/play.svg'
                buttonImg.alt = 'Play'

                let flagMenu = document.querySelector(".game-hud-flag")
                flagMenu.style.top = "2px"
                return true;
            }
            if(symbol == "X"){
                this.checkWinCondition(symbol,lines, i)
            }
            
        }
        this.winConditionPriority = 0
        this.checkWinnerLimit = 0
        return false;
    }

    checkWinCondition(symbol, lines, i){
        let count = 0
        let count2 = 0
        let keyList = Object.keys(lines[i])
        
        for(let j = 0;j < this.board.side; j++){
            if(lines[i][keyList[j]] == symbol){
                count++
            }

            if(lines[i][keyList[j]] != symbol && lines[i][keyList[j]] != ''){
                count2++
            }

            if(count == this.board.side - 1 && !this.checkWinnerLimit && !this.winConditionPriority){
                let nextMove
                for (var key in lines[i]) {
                    if (lines[i][key] === '') {
                        nextMove = key;
                        this.checkWinnerLimit = 1
                        console.log("MAMA")
                        this.bot.check = [i, nextMove]
                      break; 
                    }
                  }
                
            }
            if(count2 == this.board.side - 1 && (!this.checkWinnerLimit || !this.winConditionPriority)){
                let nextMove
                for (var key in lines[i]) {
                    if (lines[i][key] === '') {
                        console.log("MAMA2")
                        nextMove = key;
                        this.checkWinnerLimit = 1
                        this.winConditionPriority = 1
                        this.bot.check = [i, nextMove]
                        break; 
                    }
                  }
                
            }
        }
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
        this.check = 0
        this.played = []
    }

    move(board) {
        console.log(this.check)
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
        if(this.check){
            let temp = this.check[1]
            
            if(!this.played.includes(this.check[0]) && this.check[1]){
                this.played.push(this.check[0])
                this.check = 0
                return temp
            }

            this.check = 0
        }
        return this.easyMove(board)
    }

    hardMove(board){
        return this.mediumMove(board)
    }
}