import { Camera } from "./Camera.js";
import { GameData } from "./GameData.js";
import { Interactable } from "./Interactable.js";
import { Vector2 } from "./Vector2.js";
import { Player } from "./Player.js";

export class Switch extends Interactable
{
    constructor(id, doorID)
    {
        super();
        this.isOpen = false;
        this.entRef = GameData.world.entities.find(v=> v.name == id);
        this.doorRef = GameData.world.entities.find(v=> v.name == doorID);
        this.position = new Vector2(
            this.entRef.x * (GameData.spriteScale * 16),
            this.entRef.y * (GameData.spriteScale * 16),
        );
        this.offset = new Vector2(8*GameData.spriteScale,8*GameData.spriteScale)
        this.instanceID = id + ',' + doorID;

        
        if (localStorage.getItem(this.instanceID) !== null)
        {
            this.isOpen = true;
            this.canInteract = false;
        }
        else{
            Player.collisionTests.push(
                {
                    name: this.instanceID,
                    x: (this.doorRef.x * GameData.spriteScale * 16) - (GameData.spriteScale * 16), 
                    y: (this.doorRef.y * GameData.spriteScale * 16), 
                    w: GameData.spriteScale*16*3, 
                    h: GameData.spriteScale*16
                }
            )
        }

    }

    onInteract()
    {
        
        Camera.shake(10, 0.2);
        let index = Player.collisionTests.indexOf(Player.collisionTests.find(v=>v.name == this.instanceID));
        Player.collisionTests.splice(index, 1);
        this.isOpen = true;
        localStorage.setItem(this.instanceID, "open");
    }

    draw()
    {
        this.drawDoorBlock(-1);
        this.drawDoorBlock(0);
        this.drawDoorBlock(1);
        
        let sInd = this.isOpen ? GameData.spriteIndex.buttonPressed : GameData.spriteIndex.buttonUnpressed;
        let [tPosX, tPosY] = Camera.transformPosition(
            this.position.x,
            this.position.y,
            )

        GameData.ctx.drawImage(GameData.spriteAtlas,
            sInd.x,
            sInd.y,
            sInd.w,
            sInd.h,
            tPosX,
            tPosY,
            sInd.w * GameData.spriteScale,
            sInd.h * GameData.spriteScale
            )
    }

    drawDoorBlock(offset)
    {
        let sInd = this.isOpen ? GameData.spriteIndex.wallDoorOpen : GameData.spriteIndex.deco[4];

        let [tPosX, tPosY] = Camera.transformPosition(
            (this.doorRef.x + offset) * (GameData.spriteScale * 16),
            this.doorRef.y * (GameData.spriteScale * 16),
        )

        GameData.ctx.drawImage(GameData.spriteAtlas,
            sInd.x,
            sInd.y,
            sInd.w,
            sInd.h,
            tPosX,
            tPosY,
            sInd.w * GameData.spriteScale,
            sInd.h * GameData.spriteScale
            )
    }
}