import { GameData } from "./GameData.js";
import { Vector2 } from "./Vector2.js";


export class Entity
{
    constructor(x = 0,y = 0,spriteIndices = [])
    {
        this.position = new Vector2(x,y);
        this.spriteIndices = spriteIndices;
        this.spriteIndex = 0;
    }

    update(){};
    draw(){};

    getCenter(sceneWise)
    {
        let sprite = this.spriteIndices[this.spriteIndex];

        let result = new Vector2(this.position.x + (sprite.w*GameData.spriteScale)/2, this.position.y + (sprite.h*GameData.spriteScale)/2);
        if (sceneWise)
        {
            result.x -= GameData.screen.halfWidth - (sprite.w/2* GameData.spriteScale);
            result.y -= GameData.screen.halfHeight - (sprite.h/2 * GameData.spriteScale);
        }
        return result;
    }

}