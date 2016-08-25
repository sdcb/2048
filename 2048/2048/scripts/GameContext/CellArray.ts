namespace _2048 {
    export class CellArray {
        private cells = Array<Cell>();
        private gameOver = false;

        isGameOver() {
            return this.gameOver;
        }

        getScore() {
            return this.cells.reduce((a, b) => a + b.size, 0);
        }

        getCells() {
            return this.cells.concat();
        }

        requestDirection(direction: Direction) {
            if (this.isGameOver()) {
                return;
            }

            let cellsOrdered = this.cellsOrderByDirection(direction);

            cellsOrdered.map(cell => {
                if (cell.deleted) return;

                let allPositions = this.findAllPositionInDirection(direction, cell.position());
                let table = this.getCellTable();

                let targetCell = cell.getBox();
                for (let position of allPositions) {
                    let nextCell = table[position.x][position.y];
                    if (nextCell === undefined) {
                        targetCell.x = position.x;
                        targetCell.y = position.y;
                    } else if (nextCell.size === targetCell.size) {
                        targetCell.x = position.x;
                        targetCell.y = position.y;
                        targetCell.size += nextCell.size;
                        nextCell.deleted = true;
                    } else {
                        break;
                    }
                }
                return cell.moveToAndGrow(targetCell);
            });
            this.cells = this.cells.filter(x => x.deleted === false);

            let newCell = this.newRandomCell();
            if (newCell === null) {
                this.gameOver = true;
            } else {
                this.cells.push(newCell);
            }
        }

        private cellsOrderByDirection(direction: Direction) {
            switch (direction) {
                case Direction.Up:
                    return this.cells.sort((a, b) => b.y - a.y);
                case Direction.Down:
                    return this.cells.sort((a, b) => a.y - b.y);
                case Direction.Left:
                    return this.cells.sort((a, b) => b.x - a.x);
                case Direction.Right:
                    return this.cells.sort((a, b) => a.x - b.x);
                default:
                    throw new Error(`Unknown Direction: ${direction}.`);
            }
        }

        private findAllPositionInDirection(movingDirection: Direction, currentPosition: Vector2d) {
            switch (movingDirection) {
                case Direction.Up:
                    return createArray<Vector2d>(currentPosition.y)
                        .map((v, i) => new Vector2d(currentPosition.x, currentPosition.y - i - 1));
                case Direction.Down:
                    return createArray<Vector2d>(this.size.y - currentPosition.y - 1)
                        .map((v, i) => new Vector2d(currentPosition.x, currentPosition.y + i + 1));
                case Direction.Left:
                    return createArray<Vector2d>(currentPosition.x)
                        .map((v, i) => new Vector2d(currentPosition.x - i - 1, currentPosition.y));
                case Direction.Right:
                    return createArray<Vector2d>(this.size.x - currentPosition.x - 1)
                        .map((v, i) => new Vector2d(currentPosition.x + i + 1, currentPosition.y));
                default:
                    throw new Error(`Unknown Direction: ${movingDirection}.`);
            }
        }

        private newRandomCell() {
            let emptyPositions = this.getEmptyCellPositions();
            if (emptyPositions.length === 0) return null;

            let randomIndex = Math.floor(emptyPositions.length * Math.random());
            let randomPosition = emptyPositions[randomIndex];
            return Cell.createAt(randomPosition.x, randomPosition.y);
        }

        private getCellTable() {
            let cells = createArray<Array<Cell | undefined>>(this.size.y);
            for (let i = 0; i < cells.length; ++i) {
                cells[i] = createArray<Cell | undefined>(this.size.x);
            }

            for (let cell of this.cells) {
                cells[cell.x][cell.y] = cell;
            }

            return cells;
        }

        private getEmptyCellPositions() {
            let table = this.getCellTable();
            let result = Array<Vector2d>();
            for (let x = 0; x < this.size.x; ++x) {
                for (let y = 0; y < this.size.y; ++y) {
                    if (table[x][y] === undefined) {
                        result.push(new Vector2d(x, y));
                    }
                }
            }
            return result;
        }

        constructor(public size: Vector2d) {
            this.cells.push(NN(this.newRandomCell()));
            this.cells.push(NN(this.newRandomCell()));
        }

        public static create() {
            return new CellArray(new Vector2d(4, 4));
        }
    }
}