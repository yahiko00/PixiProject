// main.ts

/// <reference path="./../../node_modules/pixi-typescript/pixi.js.d.ts" />

import PIXI = require("pixi.js");

const params = {
    backgroundColor: 0x000000,
    canvasW: 800,
    canvasH: 450
}

class Engine {
    public loader: PIXI.loaders.Loader;
    public renderer: PIXI.SystemRenderer;
    public stage: PIXI.Container;

    constructor(width: int, height: int) {
        this.loader = PIXI.loader;
        this.renderer = PIXI.autoDetectRenderer(width, height, { "antialias": true });
    } // constructor
} // Engine

const engine = new Engine(params.canvasW, params.canvasH);

const fpsMeter = {
    nbFrames: 0,
    framerate: 0.0,
    elapsed: performance.now(),
    refresh: 500,
    domElement: document.createElement("div")
}

// ==============
// === STATES ===
// ==============

function load() {
    create();
} // load

function create() {
    /* Main Container */
    let container = document.getElementById("game") || document.body;
    container.appendChild(engine.renderer.view);

    /* FPS */
    fpsMeter.domElement.style.position = "fixed";
    fpsMeter.domElement.style.left = "0px";
    fpsMeter.domElement.style.bottom = "0px";
    fpsMeter.domElement.style.color = "#000000";
    fpsMeter.domElement.style.zIndex = "10";
    fpsMeter.domElement.style.fontFamily = "monospace";
    container.appendChild(fpsMeter.domElement);

    engine.stage = new PIXI.Container();

    update();
} // create

function update() {
    requestAnimationFrame(update);
    let now = performance.now();
    let frameTime = now - fpsMeter.elapsed;

    fpsMeter.nbFrames++;
    if (frameTime >= fpsMeter.refresh) {
        let framerate = 1000 * fpsMeter.nbFrames / frameTime;
        fpsMeter.domElement.innerHTML = "FPS: " + framerate.toFixed(2).toString();
        fpsMeter.elapsed = now;
        fpsMeter.nbFrames = 0;
    }
    render();
} // update

function render() {
    engine.renderer.render(engine.stage);
} // render

window.onload = load;
