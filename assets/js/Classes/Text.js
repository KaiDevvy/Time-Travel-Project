import { GameData } from "./GameData.js";

export class Text
{
    static #dGray = "#303030";
    static #lGray = "#c9c9c9"

    static drawTextBordered(text, x, y, scale, border)
    {
        let ctx = GameData.ctx;
        ctx.font = scale + border + "px Arial";
        ctx.fillStyle = this.#dGray;
        ctx.strokeStyle = this.#lGray
        ctx.lineWidth = border;
        GameData.ctx.fillText(text, x, y);
        GameData.ctx.strokeText(text, x, y);
        
    }
}