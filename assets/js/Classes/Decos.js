import { Camera } from "./Camera.js";
import { Entity } from "./Entity.js";
import { GameData } from "./GameData.js";

export class Decos extends Entity
{
    constructor()
    {
        super();
        this.decoSet = GameData.world.deco;
    }

    draw()
    {
        const tScale = GameData.spriteScale * 16;
        let ctx = GameData.ctx;

        for (let i = 0; i < this.decoSet.length; i++)
        {
            let current = this.decoSet[i];
            let sIndex = GameData.spriteIndex.deco[current.index];

            if ((current.x + current.w) < Camera.position.x ||
                current.x > Camera.position.x + GameData.screen.width ||
                (current.y + current.h) < Camera.position.y ||
                current.y > Camera.position.y + GameData.screen.height)
                continue;

            let [tPosX, tPosY] = Camera.transformPosition(current.x * tScale,current.y * tScale);

            ctx.drawImage(GameData.spriteAtlas,
                sIndex.x,
                sIndex.y,
                sIndex.w,
                sIndex.h,
                tPosX,
                tPosY,
                sIndex.w * GameData.spriteScale,
                sIndex.h * GameData.spriteScale,
                )
        }
    }
}