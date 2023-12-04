import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { GameData } from "./GameData.js";
import { Sprite } from "./Sprite.js";


export class StaticObject extends Entity
{
    #sprite;

    constructor(x,y, spriteIndices)
    {
        super(x,y,spriteIndices);
        this.spriteIndex = Math.floor(Math.random() * spriteIndices.length);
        this.#sprite = new Sprite(spriteIndices);
    }

    draw()
    {   
     
        let
        xPos = this.position.x - Camera.position.x,
        yPos = this.position.y - Camera.position.y;
        

        this.#sprite.draw(xPos,yPos);
    }

    culled(x, y, width, height)
    {
        return (x+width < Camera.position.x - GameData.screen.width) || // Beyond left of screen
                (x > Camera.position.x + GameData.screen.width) ||      // Beyond right of screen
                (y+height < Camera.position.y - GameData.screen.height) ||
                (y > Camera.position.y + GameData.screen.height)
    }
}