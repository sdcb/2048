﻿namespace _2048 {
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

            document.addEventListener("backbutton", ev => this.backButtonClicked(ev));

            var canvasHammer = new Hammer(document.body);
            canvasHammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
            canvasHammer.on("swipe", (ev: HammerInput) => {
                let swipeMap = {
                    [Hammer.DIRECTION_NONE]: null,
                    [Hammer.DIRECTION_UP]: Direction.Up,
                    [Hammer.DIRECTION_DOWN]: Direction.Down,
                    [Hammer.DIRECTION_LEFT]: Direction.Left,
                    [Hammer.DIRECTION_RIGHT]: Direction.Right
                };
                let direction = swipeMap[ev.direction];
                if (direction !== null) {
                    return this.swiped(direction);
                }
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
        abstract backButtonClicked(ev: Event);
    }

    export class GameView extends GameViewBase {
        game = CellArray.create();

        constructor() {
            super(<HTMLCanvasElement>document.querySelector("canvas"));
            this.setScore();
        }

        setScore() {
            let element = NN(document.getElementById("score"));
            element.textContent = this.game.getScore().toString();
        }

        swiped(direction: Direction) {
            this.game.requestDirection(direction);
            this.setScore();
        }

        backButtonClicked(ev: Event) {
            this.game.requestBack();
            this.setScore();
        }

        render() {
            let blockWidth = this.width / this.game.size.x;
            let blockHeight = this.height / this.game.size.y;
            this.ctx.beginPath();
            for (let x = 0; x < this.game.size.x; ++x) {
                for (let y = 0; y < this.game.size.y; ++y) {
                    this.ctx.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                }
            }
            this.ctx.stroke();

            for (let cell of this.game.getCells()) {
                let attr = this.cellAttr(cell.n);

                this.ctx.save();

                this.ctx.translate(
                    cell.displayX * blockWidth + blockWidth / 2,
                    cell.displayY * blockHeight + blockHeight / 2);
                this.ctx.scale(cell.displaySize, cell.displaySize);
                this.ctx.fillStyle = attr.background;
                this.ctx.fillRect(
                    -blockWidth / 2 + 1, -blockHeight / 2 + 1, blockWidth - 2, blockHeight - 2);

                this.ctx.fillStyle = attr.color;
                this.ctx.font = `${attr.fontSize}px Arial`;
                this.ctx.textBaseline = "middle";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.numberMap(cell.n), 0, 0);

                this.ctx.restore();
            }
        }

        numberMap(n: number) {
            let ns = createArray<number>(20).map((v, i) => 2 << i);
            return ns[Math.log(n) / Math.log(2) - 1].toString();
        }

        cellAttr(size: number) {
            let colorMap = {
                [2]: {
                    background: "#eee4da",
                },
                [4]: {
                    background: "#ede0c8"
                },
                [8]: {
                    color: "#f9f6f2",
                    background: "#f2b179"
                },
                [16]: {
                    color: "#f9f6f2",
                    background: "#f59563"
                },
                [32]: {
                    color: "#f9f6f2",
                    background: "#f67c5f"
                },
                [64]: {
                    color: "#f9f6f2",
                    background: "#f65e3b"
                },
                [128]: {
                    color: "#f9f6f2",
                    background: "#edcf72",
                    fontSize: 45,
                },
                [256]: {
                    color: "#f9f6f2",
                    background: "#edcc61",
                    fontSize: 45,
                },
                [512]: {
                    color: "#f9f6f2",
                    background: "#edc850",
                    fontSize: 45,
                },
                [1024]: {
                    color: "#f9f6f2",
                    background: "#edc53f",
                    fontSize: 35,
                },
                [2048]: {
                    color: "#f9f6f2",
                    background: "#3c3a32",
                    fontSize: 35,
                },
                [4096]: {
                    color: "#f9f6f2",
                    background: "#3c3a32",
                    fontSize: 30
                },
                [8192]: {
                    color: "#f9f6f2",
                    background: "#3c3a32",
                    fontSize: 30
                },
                [16384]: {
                    color: "#f9f6f2",
                    background: "#3c3a32",
                    fontSize: 25
                }
            };
            let defaultSetting = {
                fontSize: 55,
                color: "#776e65",
                background: "#eee4da"
            };
            let item = colorMap[size];
            return {
                fontSize: item.fontSize || defaultSetting.fontSize,
                color: item.color || defaultSetting.color,
                background: item.background || defaultSetting.background
            };
        }
    }
}