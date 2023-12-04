import {data} from "../spriteIndex.js"; 
import {world} from "../worldData.js"; 

export class GameData
{
    static screen = {}
    static ctx = null;
    static canvas = null;
    static init()
    {
        let canvas = document.getElementById("canvas");

        GameData.canvas = canvas;
        GameData.ctx = canvas.getContext("2d");
        GameData.spriteIndex = data;
        GameData.spriteAtlas = new Image();
        GameData.spriteAtlas.src = "assets/img/ws.png"
        GameData.spriteAtlas.onerror = (e) => {console.error("Failed to load sprite atlas", e) };
        GameData.spriteScale = 4;
        GameData.world = world;
        GameData.deltaTime = 0;

        this.reloadScale();
        

    }

    static reloadScale()
    {
        GameData.ctx.filter = "blur(4px)";
        
        GameData.canvas.width = Math.max(window.innerWidth, 1920/2)
        GameData.canvas.height = Math.max(window.innerHeight, 1080/2);

        GameData.screen = {
            width: canvas.width,
            height: canvas.height,
            halfWidth: canvas.width/2,
            halfHeight: canvas.height/2
        }

        GameData.ctx.imageSmoothingEnabled = false;
    }

    static getSpriteFromName(name)
    {
        const searchRecursive = (obj) => {
            let result = null;
            let keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++)
            {
                let key = keys[i];

                if (key === name)
                {
                    result = obj[key];
                    break;
                } 
                else if (typeof obj[key] === "object")
                {
                    result = searchRecursive(obj[key]);

                    if (result !== null)
                        break;
                }
            }

            return result;
        }
        
        return searchRecursive(GameData.spriteIndex);
    }
}