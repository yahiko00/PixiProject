// module.ts

function random(min: number, max: number): number {
    if (min > max) return 0;
    let range = max - min + 1; // Assuming min < max;
    return Math.floor(range * Math.random() + min);
} // random

export = random;
