namespace _2048 {
    abstract class GameViewBase {
        protected ctx: CanvasRenderingContext2D;

        protected get width() {
            return this.canvas.width;
        }

        protected get height() {
            return this.canvas.height;
        }

        constructor(protected canvas: HTMLCanvasElement) {
            this.ctx = NN(canvas.getContext("2d"));
            canvas.width = Math.min(innerWidth, innerHeight);
            canvas.height = Math.min(innerWidth, innerHeight);

            var canvasHammer = new Hammer(canvas);
            canvasHammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
            canvasHammer.on("swipe", (ev: HammerInput) => {
                let swipeMap = {
                    [Hammer.DIRECTION_UP]: Direction.Up,
                    [Hammer.DIRECTION_DOWN]: Direction.Down,
                    [Hammer.DIRECTION_LEFT]: Direction.Left,
                    [Hammer.DIRECTION_RIGHT]: Direction.Right
                };
                let direction = swipeMap[ev.direction];
                return this.swiped(direction);
            });

            this.requestRequestCall();
        }

        private requestRequestCall() {
            requestAnimationFrame(() => this.renderCall());
        }

        private renderCall() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.render();
            this.requestRequestCall();
        }

        abstract render();
        abstract swiped(direction: Direction);
    }

    export class GameView extends GameViewBase {
        game = CellArray.create();

        constructor() {
            super(<HTMLCanvasElement>document.querySelector("canvas"));
            console.log(this.game.getCells());
        }

        swiped(direction: Direction) {
            this.game.requestDirection(direction);
        }

        render() {
            let blockWidth = this.width / this.game.size.x;
            let blockHeight = this.height / this.game.size.y;
            for (let x = 0; x < this.game.size.x; ++x) {
                for (let y = 0; y < this.game.size.y; ++y) {
                    this.ctx.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                }
            }
            for (let cell of this.game.getCells()) {
                this.ctx.strokeText(cell.size.toString(),
                    cell.displayX * blockWidth + blockWidth / 2,
                    cell.displayY * blockHeight + blockWidth / 2);
            }
            this.ctx.stroke();
        }
    }
}