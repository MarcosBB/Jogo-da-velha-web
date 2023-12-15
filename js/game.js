export class Player {
    constructor(symbol) {
        this.symbol = symbol
        this.score = 0
    }
}

class Board {
    constructor(side) {
        this.boxes = this.createBoxes(side)
        this.html_boxes = document.querySelectorAll('.game-table-division')
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

    getLines(array, side) {
        let lines = []
        let line = []
    
        for (let i = 0; i < array.length; i++) {
            line.push(array[i])
    
            if (line.length === side) {
                lines.push(line)
                line = [];
            }
        }
    
        if (line.length > 0) {
            lines.push(line)
        }
    
        return lines
    }

}

export default class Game {
    constructor(side, player1, player2) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Board(side)
        this.currentPlayer = this.player1

        this.board.html_boxes.forEach((box) => {
            box.addEventListener('click', () => {
                let box_index = Array.from(this.board.html_boxes).indexOf(box)
                this.move(box_index, this.currentPlayer)
            })
        })
    }

    changePlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2
        } else {
            this.currentPlayer = this.player1
        }
        console.log(this.currentPlayer)
    }

    move(box_index, player) {
        if (this.board.boxes[box_index] === "") {
            this.board.boxes[box_index] = player.symbol
            let img = document.createElement("img")
            img.classList.add("game-table-division-img")
            img.src = `./img/icons/${player.symbol}.svg`
            this.board.html_boxes[box_index].appendChild(img)
            this.changePlayer()
            console.log(this.board.boxes)
        }
    }

    checkWinner() {
        let winner = false
        let lines = this.board.getLines(this.board.boxes, 3)
        let symbols = ["X", "O"]

        symbols.forEach((symbol) => {
            lines.forEach((line) => {
                if (line.every((box) => box === symbol)) {
                    winner = true
                }
            })
        })

        return winner
    }
}