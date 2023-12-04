import { Camera } from "./Camera.js";
import { GameData } from "./GameData.js";

export class Debug
{
    static #circlePoints = [];

    static debugCircle(x,y,radius)
    {
        this.#circlePoints.push({x: x, y: y, r: radius});
    }

    static draw()
    {
        const ctx = GameData.ctx;

        for (let i = 0; i < this.#circlePoints.length; i++)
        {
            let circle = this.#circlePoints[i];
            let [tX, tY] = Camera.transformPosition(circle.x,circle.y);
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.arc(tX,tY,circle.r,0,Math.PI*2);
            ctx.stroke();
        }

        this.#circlePoints = [];
    }
}