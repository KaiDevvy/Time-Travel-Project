import { GameData } from "./Classes/GameData.js";
import { Scene } from "./Classes/Scene.js";
import { Input } from "./Classes/Input.js";
import { Text } from "./Classes/Text.js";

let canvas, ctx;
let gameScene;

let lastFrameTime = 0;
const FRAME_RATE = 1/240;


window.addEventListener("load", () => {
    // Init canvas element
    GameData.init();
    
    // Loading message
    GameData.ctx.font = "30px Arial";
    GameData.ctx.textAlign = "center";
    GameData.ctx.fillText("Loading Game..", GameData.screen.halfWidth, GameData.screen.halfHeight);
    
    // Load game
    Input.HookToEvents();
    gameScene = new Scene();
    
    // Begin game loop
    gameLoop();
})


function gameLoop(frameTime)
{
    let delta = (frameTime - lastFrameTime)/1000;
    if (delta > FRAME_RATE)
    {
        lastFrameTime = frameTime;
        gameScene.update(delta);
        gameScene.render();

        Text.drawTextBordered(Math.floor(1/delta), GameData.screen.width-50, 50, 30, 1);
        
    }
    window.requestAnimationFrame(gameLoop);
}
