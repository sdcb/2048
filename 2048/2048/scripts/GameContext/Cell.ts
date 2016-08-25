namespace _2048 {
    export class Box {
        constructor(
            public x: number,
            public y: number,
            public size: number) {
        }
    }

    export class Cell extends Box {
        displayX: number;
        displayY: number;
        displaySize: number;
        deleted = false;

        private constructor(
            public x: number,
            public y: number,
            public size: number) {
            super(x, y, size);
            this.displayX = x;
            this.displayY = y;
            this.displaySize = size;
        }

        position() {
            return new Vector2d(this.x, this.y);
        }

        moveTo(x: number, y: number) {
            this.x = x;
            this.y = y;

            return Promise.all([
                animate(this.displayX, v => this.displayX = v).to(x).in(100),
                animate(this.displayY, v => this.displayY = v).to(y).in(100)
            ]);
        }

        getBox() {
            return new Box(this.x, this.y, this.size);
        }

        moveToAndGrow(box: Box) {
            this.size = box.size;

            return Promise.all([
                this.moveTo(box.x, box.y), 
                animate(this.displaySize, v => this.displaySize = v).to(box.size).in(100)
            ]);
        }

        static createRandomAt(x: number, y: number) {
            var n = Math.random() < 0.9 ? 2 : 4;
            return new Cell(x, y, n);
        }

        static create(x: number, y: number, size: number) {
            return new Cell(x, y, size);
        }
    }
}