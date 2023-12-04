import { Entity } from "./Entity.js";
import { Input } from "./Input.js";
import { Player } from "./Player.js";
import { Vector2 } from "./Vector2.js";

export class Interactable extends Entity
{

    constructor()
    {
        super();
        this.canInteract = true;
        this.radius = 70;
        this.offset = new Vector2(0,0);
    }

    update()
    {  
        let modPosition = new Vector2(this.position.x + this.offset.x, this.position.y + this.offset.y);

        if (this.canInteract && Player.instance.getCenter(false).sqrDistanceTo(modPosition) < (this.radius*this.radius))
        {
            this.onInteract();
            this.canInteract = false;
        }
    }

    onInteract()
    {
    }
}