namespace _2048 {
    export function createArray<T>(arraySize: number) {
        return <Array<T>>Array.apply(null, { length: arraySize });
    }

    export function NN<T>(v: T | null | undefined): T {
        if (v === undefined || v === null) {
            throw new Error("v should never be null or undefined.");
        }
        return v;
    }

    export function animate(intialValue: number, setValue: (currentValue: number) => void) {
        let ctx = new AnimateContext(intialValue, setValue);
        return new AnimateToContext(ctx);
    }

    class AnimateToContext {
        to(finalValue: number) {
            this.ctx.finalValue = finalValue;
            return new AnimateInContext(this.ctx);
        }

        constructor(
            private ctx: AnimateContext) {
        }
    }

    class AnimateInContext {
        in(durationInMs: number) {
            this.ctx.durationInMs = durationInMs;
            return this.ctx.startUpdate();
        }

        constructor(
            private ctx: AnimateContext) {
        }
    }

    class AnimateContext {
        finalValue: number;
        durationInMs: number;
        startTime: number;

        resolve: (value?: void | PromiseLike<void>) => void;
        reject: (reason?: any) => void;

        constructor(
            public intialValue: number,
            public setValue: (currentValue: number) => void) {
        }

        startUpdate() {
            this.startTime = new Date().getTime();
            this.update();
            return new Promise<void>((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }

        update() {
            let elapsedMs = new Date().getTime() - this.startTime;
            let percent = elapsedMs / this.durationInMs;

            let currentValue = this.intialValue + (this.finalValue - this.intialValue) * percent;
            this.setValue(currentValue);

            if (percent < 1) {
                requestAnimationFrame(() => this.update());
            } else {
                this.setValue(this.finalValue);
            }
        }
    }
}