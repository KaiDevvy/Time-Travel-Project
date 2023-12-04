import { Entity } from "./Entity.js";
import { GameData } from "./GameData.js";
import { Player } from "./Player.js";

export class Rewind extends Entity
{
    static instance;
    static enabled = true;
    #counter = 0;
    #posLog = [];
    #reversing = false;
    #lastRewind;

    constructor(player)
    {
        super()
        this.#lastRewind = performance.now();
        this.instance ??= this;
        this.player = player;
    }

    update()
    {
        if (this.#reversing)
            this.reverse();
        else
            this.record();

    }

    draw(ctx)
    {
        /* == Back Panel == */



        /* == Text == */
        
        let value = this.#reversing || !Rewind.enabled ? Math.floor(Math.random() * 10) : 10 - Math.floor((this.#counter / 1000) * 10);
        if ((value + '').length == 1 && this.#reversing)
        value = Math.floor(Math.random() * 10) + '' + value;
    
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "30px Pixeloid";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = 6;
        ctx.strokeText(value, GameData.screen.halfWidth, Math.max(GameData.screen.height * 0.05, 30));
        ctx.fillText(value, GameData.screen.halfWidth, Math.max(GameData.screen.height * 0.05, 30));


        /* == Clock == */
        let spriteIndex = GameData.spriteIndex.clock;

        let 
            width = spriteIndex.w * GameData.spriteScale,
            height = spriteIndex.h * GameData.spriteScale,
            xPos = GameData.screen.halfWidth - (width/2) - 14,
            yPos = Math.max(GameData.screen.height * 0.05, 30) - (height/4);

        let sinOffset = Math.sin( (this.#counter/1000 ** 0.8)) * 2;

        xPos -= sinOffset;
        yPos -= sinOffset;
        width += sinOffset;
        height += sinOffset;

        ctx.drawImage(GameData.spriteAtlas, spriteIndex.x, spriteIndex.y, spriteIndex.w, spriteIndex.h, xPos, yPos, width/2, height/2);
    }

    reverse()
    {
        if (!Rewind.enabled)
            return;

        if (this.#posLog.length == 0)
        {
            this.#reversing = false;
            return;
        }

        this.player.position.y = this.#posLog.pop();
        this.player.position.x = this.#posLog.pop();
    }

    record()
    {
        if (this.#counter % 4 == 0)
        {
            this.#posLog[this.#posLog.length] = this.player.position.x;
            this.#posLog[this.#posLog.length] = this.player.position.y;
        }

        if (this.#counter > 1000)
        {
            this.#counter = 0;
            this.#reversing = true;
        }

        this.#counter++;
    }

}