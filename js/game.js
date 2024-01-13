export class Player {
    constructor(symbol, isBot) {
        this.symbol = symbol
        this.score = 0
        this.is_bot = isBot
    }
}


class Board {
    constructor(side) {
        this.boxes = this.createBoxes(side)
        this.html_boxes = document.querySelectorAll('.game-table-division')
        this.side = side
    }

    createBoxes(side) {
        let boxes = []
        let total = side * side
        let parentElement = document.querySelector('.game-table')
        this.html_boxes = document.querySelectorAll('.game-table-division')

        if (this.html_boxes != null) {
            this.html_boxes.forEach(function(elemento) {
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
            lines.push(this.boxes.slice(i * this.side, (i + 1) * this.side))
        }

        // vertical
        for (let i = 0; i < this.side; i++) {
            let line = []
            for (let j = 0; j < this.side; j++) {
                line.push(this.boxes[i + j * this.side])
            }
            lines.push(line)
        }

        // diagonal
        let line = []
        for (let i = 0; i < this.side; i++) {
            line.push(this.boxes[i + i * this.side])
        }
        lines.push(line)

        line = []
        for (let i = 0; i < this.side; i++) {
            line.push(this.boxes[i + (this.side - i - 1) * this.side])
        }
        lines.push(line)
        return lines
    }
}


export default class Game {
    constructor(side, player1, player2, bot) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Board(side)
        this.currentPlayer = this.player1
        this.winner = null
        this.bot=bot

        this.board.html_boxes.forEach((box) => {
            box.addEventListener('click', () => {
                let box_index = Array.from(this.board.html_boxes).indexOf(box)
                this.move(box_index, this.currentPlayer)
            })
        })
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
    }

    move(box_index, player) {
        if (this.board.boxes[box_index] === "" && this.winner === null) {
            this.board.boxes[box_index] = player.symbol
            this.addSymble(box_index, player)

            console.log(this.checkWinner(this.currentPlayer.symbol))
            if (this.checkWinner(this.currentPlayer.symbol)) {
                console.log("ENTREI NO IF checkWinner")
                this.winner = this.currentPlayer
                this.currentPlayer.score += 1
                this.updateScore()
            }
            else {
                this.changePlayer()
            }

            if (this.currentPlayer.isBot) {
                let botMove = Math.floor(Math.random() * this.board.boxes.length)
                while (this.board.boxes[botMove] !== "") {
                    botMove = Math.floor(Math.random() * this.board.boxes.length)
                }
                this.move(botMove, this.currentPlayer)
            }
        }


    }

    addSymble(box_index, player) {
        let img = document.createElement("img")
        img.classList.add("game-table-division-img")
        img.src = `./img/icons/${player.symbol}.svg`
        this.board.html_boxes[box_index].appendChild(img)
    }

    checkWinner(symbol) {
        let lines = this.board.getLines();
    
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].every((box) => box === symbol)) {
                return true;
            }
        }
    
        return false;
    }
    
    updateScore() {
        console.log("ENTREI NO updateScore")
        let player1_score = document.querySelector('.player1-score')
        let player2_score = document.querySelector('.player2-score')

        player1_score.innerHTML = this.player1.score
        player2_score.innerHTML = this.player2.score
    }
}