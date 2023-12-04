
import { Player } from "./Player.js";
import { StaticObject } from "./StaticObject.js";
import { GameData } from "./GameData.js";
import { Mathe } from "./Mathe.js";
import { Camera } from "./Camera.js";
import { TileMap } from "./TileMap.js";
import { Rewind } from "./Rewind.js";
import { Text } from "./Text.js";
import { Debug } from "./Debug.js";
import { Decos } from "./Decos.js";
import { Portal } from "./Portal.js";
import { Switch } from "./Switch.js";

export class Scene
{
    constructor()
    {   
        this.tilemap = new TileMap(GameData.world.tilemap);
        this.entities = [new Player(2000, 2000,this.tilemap)];
        let centerPlayer = this.entities[0].getCenter(true);
        Camera.position.x = centerPlayer.x;
        Camera.position.y = centerPlayer.y;

        this.entities.push(new Rewind(this.entities[0]));
        this.entities.push(new Decos());
        this.entities.push(new Portal());

        this.entities.push(new Switch(1, 0));
        this.entities.push(new Switch(8, 3));
        this.entities.push(new Switch(7, 9));
        this.entities.push(new Switch(6, 10));
        this.entities.push(new Switch(5, 4));

        
    }

    update(deltaTime)
    {
        GameData.deltaTime = deltaTime;

        for (let i = this.entities.length-1; i >= 0; i--)
            this.entities[i].update(deltaTime);

        let centerPlayer = this.entities[0].getCenter(true);
        Camera.lerpTowards(centerPlayer.x, centerPlayer.y);

        if (GameData.screen.width != window.innerWidth || GameData.screen.height != window.innerHeight)
            GameData.reloadScale();
        
    }

    render()
    {
        GameData.ctx.fillStyle = "#111111";
        GameData.ctx.fillRect(0,0,GameData.screen.width, GameData.screen.height);
        
        this.tilemap.draw();
        
        for (let i = this.entities.length-1; i >= 0; i--)
            this.entities[i].draw(GameData.ctx);
    
        Debug.draw();
    }
}