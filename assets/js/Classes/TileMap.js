import { Camera } from "./Camera.js";
import { Debug } from "./Debug.js";
import { GameData } from "./GameData.js";

export class TileMap
{
    #startX = 0;
    #startY = 0;
    constructor(tilemap)
    {
        this.tilemap = tilemap;
    }

    draw()
    {
        let startX = Math.max(Math.floor(Camera.position.x / (GameData.spriteScale * 16)) - 1, 0);
        let startY = Math.max(Math.floor(Camera.position.y / (GameData.spriteScale * 16)) - 1, 0); 
        let endX = Math.min(Math.floor((Camera.position.x + GameData.screen.width) / (GameData.spriteScale * 16)) +1, this.tilemap.length);
        for(let x = startX; x < endX; x++)
        {
            let endY = Math.min(Math.floor((Camera.position.y + GameData.screen.height) / (GameData.spriteScale * 16))+1, this.tilemap[x].length); 
            for (let y = startY; y < endY; y++)
            {
                let tile = this.tilemap[x][y];
                if (tile == 0)
                    continue;

            

            let 
                xRaw = x * 16 * GameData.spriteScale + this.#startX,
                yRaw = y * 16 * GameData.spriteScale + this.#startY;

            let [xPos, yPos] = Camera.transformPosition(xRaw, yRaw);  
            

            GameData.ctx.drawImage(
                GameData.spriteAtlas,
                Math.floor(tile%31)*16,
                Math.floor(tile/31) * 16,
                16,
                16,
                xPos,
                yPos, 
                16*GameData.spriteScale, 
                16*GameData.spriteScale)
            }
        }
    }

    collidesWith(x,y,width,height)
    {
        if (x < 0 || y < 0)
            return true;

        let colChecks = [
            {x: x, y: y},
            {x: x + width, y: y},
            {x: x, y: y + height},
            {x: x + width, y: y + height},
        ]

        for (let i = 0; i < colChecks.length; i++)
        {
            let gridPointX = Math.floor(colChecks[i].x / (16 * GameData.spriteScale)),
                gridPointY = Math.floor(colChecks[i].y / (16 * GameData.spriteScale));

                
            if (this.tilemap[gridPointX] == undefined)
                continue;

            let tile = this.tilemap[gridPointX][gridPointY] || 0;


            if (tile !== 0)
            {
                return true;
            }
        }

        return false;
    }
}