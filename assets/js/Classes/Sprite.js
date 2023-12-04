import { GameData } from "./GameData.js";

export class Sprite
{
    #currentIndex = 0;
    #lastFrameSwitch = 0;
    #spriteIndices = [];

    constructor(spriteIndices, frameRate = 0.32)
    {
        this.scale = 1;
        spriteIndices.forEach(sprite => {

            if (typeof sprite !== "string")
                this.#spriteIndices.push(sprite);
            else{
                let data = GameData.getSpriteFromName(sprite);

                if (data === null)
                    console.error("Sprite [" + sprite + "] not found in sprite index!");

                this.#spriteIndices.push(data);
            }
        })
        this.isAnimated = spriteIndices.length !== 1;
        this.frameRate = frameRate;
    }

    draw(x, y)
    {
        let sprInd = this.#spriteIndices[this.#currentIndex];

        let scaleX = sprInd.w * GameData.spriteScale * this.scale,
            scaleY = sprInd.h * GameData.spriteScale * this.scale;

        GameData.ctx.drawImage(
            GameData.spriteAtlas,
            sprInd.x,
            sprInd.y,
            sprInd.w,
            sprInd.h,
            x - (scaleX/2),
            y - (scaleY/2),
            scaleX,
            scaleY,
        )

        if (this.isAnimated)
        {
            if (performance.now() - this.#lastFrameSwitch > this.frameRate * 1000)
            {
                this.#lastFrameSwitch = performance.now();
                this.#currentIndex = (this.#currentIndex + 1) % this.#spriteIndices.length;
            }
        }
    }
}