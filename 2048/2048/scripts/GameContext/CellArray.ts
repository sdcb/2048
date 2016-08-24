namespace _2048 {
    export class CellArray {
        private cells = Array<Cell>();
        private gameOver = false;

        isGameOver() {
            return this.gameOver;
        }

        getScore() {
            return this.cells.reduce((a, b) => a + b.n, 0);
        }

        getCells() {
            return this.cells.concat();
        }

        requestDirection(direction: Direction) {
            if (this.isGameOver()) {
                return;
            }

            let cellsOrdered = this.cellsOrderByDirection(direction);
            let moves = cellsOrdered.map(cell => {
                let allPositions = this.findAllPositionInDirection(direction, cell.position());
                let targetPosition = this.findFirstAvailablePosition(allPositions);
                if (targetPosition !== undefined) {
                    return cell.moveTo(targetPosition.x, targetPosition.y);
                }
            });
            if (moves.some(v => v !== undefined)) {
                this.createRandomCell();
            }
        }

        private createRandomCell() {
            let randomPosition = this.getRandomPosition();
            this.cells.push(Cell.createAt(randomPosition.x, randomPosition.y));
        }

        private getRandomPosition() {
            let emptyPositions = this.getEmptyCellPositions();
            let randomIndex = Math.floor(emptyPositions.length * Math.random());
            return emptyPositions[randomIndex];
        }

        private cellsOrderByDirection(direction: Direction) {
            switch (direction) {
                case Direction.Up:
                    return this.cells.sort((a, b) => a.y - b.y);
                case Direction.Down:
                    return this.cells.sort((a, b) => b.y - a.y);
                case Direction.Left:
                    return this.cells.sort((a, b) => a.x - b.x);
                case Direction.Right:
                    return this.cells.sort((a, b) => b.x - a.x);
                default:
                    throw new Error(`Unknown Direction: ${direction}.`);
            }
        }

        private findAllPositionInDirection(movingDirection: Direction, currentPosition: Vector2d) {
            switch (movingDirection) {
                case Direction.Up:
                    return createArray<Vector2d>(currentPosition.y)
                        .map((v, i) => new Vector2d(currentPosition.x, i));
                case Direction.Down:
                    return createArray<Vector2d>(this.size.y - currentPosition.y - 1)
                        .map((v, i) => new Vector2d(currentPosition.x, this.size.y - i - 1));
                case Direction.Left:
                    return createArray<Vector2d>(currentPosition.x)
                        .map((v, i) => new Vector2d(i, currentPosition.y));
                case Direction.Right:
                    return createArray<Vector2d>(this.size.x - currentPosition.x - 1)
                        .map((v, i) => new Vector2d(currentPosition.x + i + 1, currentPosition.y));
                default:
                    throw new Error(`Unknown Direction: ${movingDirection}.`);
            }
        }

        private findFirstAvailablePosition(points: Vector2d[]) {
            var table = this.getCellTable();
            return points.find(v => table[v.x][v.y] === undefined);
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
            this.createRandomCell();
            this.createRandomCell();
        }

        public static create() {
            return new CellArray(new Vector2d(4, 4));
        }
    }
}