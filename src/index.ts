import { Application } from "@pixi/app";
import { Renderer, extensions } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Ticker, TickerPlugin } from "@pixi/ticker";
import { skipHello } from '@pixi/utils';
import { Live2DModel, ZipLoader } from "pixi-live2d-display/cubism2";
import * as JSZip from "jszip";

/* Setup and register PIXI extensions */
skipHello();
extensions.add(TickerPlugin);
extensions.add(InteractionManager);

/* Setup Live2D display */
const hijikiModel = require('./hijiki.zip');
Ticker.shared.maxFPS = 30;
Live2DModel.registerTicker(Ticker);

/* Implement ZipLoader functions */
ZipLoader.zipReader = (data: Blob, url: string) => JSZip.loadAsync(data);

ZipLoader.readText = (jsZip: JSZip, path: string) => {
    const file = jsZip.file(path);

    if (!file) {
        throw new Error("Cannot find file: " + path);
    }

    return file.async("text");
};

ZipLoader.getFilePaths = (jsZip: JSZip) => {
    const paths: string[] = [];

    jsZip.forEach(relativePath => paths.push(relativePath));

    return Promise.resolve(paths);
};

ZipLoader.getFiles = (jsZip: JSZip, paths: string[]) =>
    Promise.all(
        paths.map(async path => {
            const fileName = path.slice(path.lastIndexOf("/") + 1);

            const blob = await jsZip.file(path)!.async("blob");

            return new File([blob], fileName);
        })
    );

/* Main action */
(async () => {
    const app = new Application({
        view: document.getElementById("canvas") as HTMLCanvasElement | null,
        width: 500 * window.devicePixelRatio,
        height: 600 * window.devicePixelRatio,
        backgroundAlpha: 0
    });

    const model = await Live2DModel.from("zip://" + hijikiModel);
    app.stage.addChild(model);

    //model.x = 100;
    //model.y = 100;
    //model.rotation = Math.PI;
    //model.skew.x = Math.PI;
    model.scale.set(0.5, 0.5);
    //model.anchor.set(0.5, 0.5);
})();
