import { Camera } from "./Camera.js";
import { GameData } from "./GameData.js";
import { Input } from "./Input.js";
import { Interactable } from "./Interactable.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";
import { Player } from "./Player.js";
import { Rewind } from "./Rewind.js";


export class Portal extends Interactable
{
    constructor()
    {
        super();
        this.entRef = GameData.world.entities.find(v=>v.name == "2");
        this.position = new Vector2(this.entRef.x * GameData.spriteScale * 16, this.entRef.y * GameData.spriteScale * 16);
        this.sprite = new Sprite(["portalf1", "portalf2", "portalf3", "portalf4"])
        this.wasUsed = false;
        this.scale= 1;
    }

    onInteract()
    {
        this.wasUsed = true;
        Input.enabled = false;
        Player.doRender = false;
        Rewind.enabled = false;
        Camera.shake(3, 2);
    }

    draw()
    {
        if (this.wasUsed)
        {
            this.sprite.scale = Math.max(0, this.sprite.scale - 0.005);
            
        }

        let [tPosX, tPosY] = Camera.transformPosition(this.position.x,this.position.y );
        
        this.sprite.draw(tPosX + GameData.spriteScale * 8, tPosY);
    }
}