namespace _2048 {
    export class Cell {
        displayX: number;
        displayY: number;

        private constructor(
            public x: number,
            public y: number,
            public n: number) {
            this.displayX = x;
            this.displayY = y;
        }

        position() {
            return new Vector2d(this.x, this.y);
        }

        moveTo(x: number, y: number) {
            this.x = x;
            this.y = y;

            return Promise.all([
                animate(this.displayX, v => this.displayX = v).to(x).in(100),
                animate(this.displayY, v => this.displayY = v).to(y).in(100)]);
        }

        static createAt(x: number, y: number) {
            var n = Math.random() < 0.9 ? 2 : 4;
            return new Cell(x, y, n);
        }
    }
}