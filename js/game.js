class Player {
    constructor(symbol) {
        this.symbol = symbol
        this.score = 0
    }
}

class Board {
    constructor(side) {
        this.boxes = this.createBoxes(side)
    }

    createBoxes(side) {
        let boxes = []
        let total = side * side
        for (let i = 0; i < total; i++) {
            boxes[i] = ""
        }
        return boxes
    }

    getLines(array, side) {
        let lines = [];
        let line = [];
    
        for (let i = 0; i < array.length; i++) {
            line.push(array[i]);
    
            // Check if the line is complete based on the "side" value
            if (line.length === side) {
                lines.push(line);
                line = [];  // Start a new line
            }
        }
    
        // Push the last line if it's not complete
        if (line.length > 0) {
            lines.push(line);
        }
    
        return lines;
    }
        
}

class Game {
    constructor(side) {
        this.player1 = new Player('X')
        this.player2 = new Player('O')
        this.board = new Board(side)
    }
}

export default Game