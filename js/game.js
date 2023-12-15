class Player {
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
    
            // Check if the line is complete based on the "side" value
            if (line.length === side) {
                lines.push(line)
                line = [];  // Start a new line
            }
        }
    
        // Push the last line if it's not complete
        if (line.length > 0) {
            lines.push(line)
        }
    
        return lines
    }

}

class Game {
    constructor(side) {
        this.player1 = new Player('X')
        this.player2 = new Player('O')
        this.board = new Board(side)
        this.currentPlayer = this.player1
    }

    changePlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2
        } else {
            this.currentPlayer = this.player1
        }
        console.log(this.currentPlayer)
    }
}

export default Game