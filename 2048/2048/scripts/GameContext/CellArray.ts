﻿namespace _2048 {
    export class CellArray {
        private cells = Array<Cell>();
        private cellHistory = Array<Array<Box>>();
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

            let history = this.serializeCurrentStatus();
            let cellsOrdered = this.cellsOrderByDirection(direction);

            let combinedCells = Array<Cell>();
            let moved = false;
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
                    } else if (combinedCells.indexOf(nextCell) === -1 && nextCell.n === targetCell.n) {
                        targetCell.x = position.x;
                        targetCell.y = position.y;
                        targetCell.n += nextCell.n;
                        nextCell.deleted = true;
                        combinedCells.push(cell);
                        break;
                    } else {
                        break;
                    }
                }
                if (targetCell.x !== cell.x || targetCell.y !== cell.y) {
                    moved = true;
                    return cell.moveToAndGrow(targetCell);
                }
            });

            if (moved) {
                this.cells = this.cells.filter(x => x.deleted === false);
                this.pushCellHistory(history);

                let newCell = this.newRandomCell();
                if (newCell === null) {
                    this.gameOver = true;
                } else {
                    this.cells.push(newCell);
                }
            }
        }

        requestBack() {
            return this.popHistory();
        }

        private pushCellHistory(status: Box[]) {
            this.cellHistory.push(status);
        }

        private serializeCurrentStatus() {
            return this.cells.map(v => v.getBox());
        } 

        private popHistory() {
            let history = this.cellHistory.pop();
            if (history !== undefined) {
                let array = history.map(v => Cell.createByBox(v));
                this.cells = array;
                return true;
            }
            return false;
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
            return Cell.createRandomAt(randomPosition.x, randomPosition.y);
        }

        private getCellTable() {
            let cells = createArray<Array<Cell | undefined>>(this.size.x);
            for (let i = 0; i < cells.length; ++i) {
                cells[i] = createArray<Cell | undefined>(this.size.y);
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
            this.initialize();
        }

        initialize() {
            this.cells.push(NN(this.newRandomCell()));
            this.cells.push(NN(this.newRandomCell()));
        }

        initializeWithArray(array: Array<Array<number>>) {
            array.forEach((row, y) => {
                row.forEach((size, x) => {
                    if (size !== 0) {
                        this.cells.push(Cell.create(x, y, size));
                    }
                });
            });
        }

        public static create() {
            return new CellArray(new Vector2d(4, 4));
        }
    }
}