namespace _2048 {
    export class Box {
        constructor(
            public x: number,
            public y: number,
            public n: number) {
        }
    }

    const AnimateDurationMs = 100;
    export class Cell extends Box {
        displayX: number;
        displayY: number;
        displaySize = 0;
        deleted = false;

        private constructor(
            public x: number,
            public y: number,
            public n: number) {
            super(x, y, n);
            this.displayX = x;
            this.displayY = y;

            animate(this.displaySize, v => this.displaySize = v)
                .to(1)
                .in(AnimateDurationMs);
        }

        position() {
            return new Vector2d(this.x, this.y);
        }

        moveTo(x: number, y: number) {
            this.x = x;
            this.y = y;

            return $.when(...[
                animate(this.displayX, v => this.displayX = v).to(x).in(AnimateDurationMs),
                animate(this.displayY, v => this.displayY = v).to(y).in(AnimateDurationMs)
            ]);
        }

        getBox() {
            return new Box(this.x, this.y, this.n);
        }

        moveToAndGrow(box: Box) {
            this.n = box.n;
            return this.moveTo(box.x, box.y);
        }

        static createRandomAt(x: number, y: number) {
            var n = Math.random() < 0.9 ? 2 : 4;
            return new Cell(x, y, n);
        }

        static create(x: number, y: number, n: number) {
            return new Cell(x, y, n);
        }

        static createByBox(box: Box) {
            return Cell.create(box.x, box.y, box.n);
        }
    }
}