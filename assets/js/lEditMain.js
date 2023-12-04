import {GameData} from "./Classes/GameData.js";
import { Vector2 } from "./Classes/Vector2.js";
import { Input } from "./Classes/Input.js";
import { world } from "./worldData.js";

const bitmap = { "2": 1, "8": 2, "10": 3, "11": 4, "16": 5, "18": 6, "22": 7, "24": 8, "26": 9, "27": 10, "30": 11, "31": 12, "64": 13, "66": 14, "72": 15, "74": 16, "75": 17, "80": 18, "82": 19, "86": 20, "88": 21, "90": 22, "91": 23, "94": 24, "95": 25, "104": 26, "106": 27, "107": 28, "120": 29, "122": 30, "123": 31, "126": 32, "127": 33, "208": 34, "210": 35, "214": 36, "216": 37, "218": 38, "219": 39, "222": 40, "223": 41, "248": 42, "250": 43, "251": 44, "254": 45, "255": 46, "0": 47 }
const neighbours = [
    {x:-1, y:-1}, // NW
    {x:0, y:-1}, // North
    {x:1, y:-1}, // NE
    {x:-1, y:0}, // West
    {x:1, y:0}, // East
    {x:-1, y:1}, // SW
    {x:0, y:1}, // South
    {x:1, y:1}, // SE
]

class Deco
{
    constructor(x,y,index)
    {
        this.x = x;
        this.y = y;
        this.index = index;
    }
}

class Entity
{
    constructor(x,y,name,meta)
    {
        this.x = x;
        this.y = y;
        this.name = name;
        this.meta = meta;
    }
}

const spriteScale = 16 * 4;
const worldTileMax = 16;


let camPos = new Vector2(2000 - (1920/2),2000 - (1080/2));

let tileSet = [];
let entitySet = [];
let decoSet = [new Deco(1984 + 32,1984 + 32,1)];

let isMouseDown = false;
let isEraseMode = false;
let eraseKeyDown = false;
let showTileNum = false;
let showTileKeyDown = false;
let showGrid = true;
let showGridKeyDown = false;
let changeToolDown = false;

let selectedTool = 2;
let selectedDeco = 1;

window.addEventListener("load", () => {
    GameData.init();
    Input.HookToEvents();

    window.requestAnimationFrame(gameLoop);

    GameData.canvas.addEventListener("mousedown", mousedown);
    GameData.canvas.addEventListener("mouseup", mouseup);
    GameData.canvas.addEventListener("wheel", onwheel);

    tileSet = world.tilemap;
    decoSet = world.deco;
    entitySet = world.entities;
})

function onwheel(event)
{
    if (selectedTool !== 1)
        return;

    selectedDeco += Math.sign(event.deltaY);
    if (selectedDeco < 0)
        selectedDeco = GameData.spriteIndex.deco.length-1;
    if (selectedDeco > GameData.spriteIndex.deco.length-1)
        selectedDeco = 0;
}

function mousedown(event)
{

    const rect = GameData.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    isMouseDown = true;
}

function mouseup(event)
{
    isMouseDown = false;
}


function gameLoop()
{
    let mSpeed = 3;
    if (Input.IsKeyDown('shift'))
    {
        mSpeed *= 2;
    }

    if (Input.IsKeyDown('w'))
        camPos.y -= mSpeed;
    if (Input.IsKeyDown('s'))
        camPos.y += mSpeed;
    if (Input.IsKeyDown('a'))
        camPos.x -= mSpeed;
    if (Input.IsKeyDown('d'))
        camPos.x += mSpeed;

    if (!changeToolDown && Input.IsKeyDown("arrowup")) 
    {
        selectedTool++;
        selectedTool %= 3;
        changeToolDown = true;
    } 
    if (changeToolDown && !Input.IsKeyDown("arrowup")) 
    {
        changeToolDown = false;
    }

    if (Input.IsKeyDown(' '))
    {
        let tileSetCopy = JSON.parse(JSON.stringify(tileSet));
        for(let x = 0; x < tileSetCopy.length; x++)
        {
            for (let y = tileSetCopy[x].length-1; y >= 0; y--)
            {
                let currentTile = tileSetCopy[x][y];
                
                if (currentTile === 0)
                {
                    tileSetCopy[x].pop();
                }
                else break;
            }

        }

        for (let x = tileSetCopy.length-1; x >= 0; x--)
        {
            if (tileSetCopy[x].length === 0)
                tileSetCopy.pop();
            else break;
        }

        let data = {
            tilemap: tileSetCopy,
            entities: entitySet,
            deco: decoSet
        }

        navigator.clipboard.writeText("export const world = " + JSON.stringify(data));
    }

    if (!eraseKeyDown && Input.IsKeyDown('e'))
    {
        isEraseMode = !isEraseMode;
        eraseKeyDown = true;
    } else if (!Input.IsKeyDown('e') && eraseKeyDown) eraseKeyDown = false;

    
    if (!showTileKeyDown && Input.IsKeyDown('n'))
    {
        showTileNum = !showTileNum;
        showTileKeyDown = true;
    } else if (!Input.IsKeyDown('n') && showTileKeyDown) showTileKeyDown = false;


    if (!showGridKeyDown && Input.IsKeyDown('g'))
    {
        showGrid = !showGrid;
        showGridKeyDown = true;
    } else if (!Input.IsKeyDown('g') && showGridKeyDown) showGridKeyDown = false;

    draw();
    render();

    window.requestAnimationFrame(gameLoop);
}

function render()
{
    GameData.ctx.fillStyle = "#111111";
    GameData.ctx.fillRect(0,0,GameData.screen.width, GameData.screen.height);
    
    /* == TILESET == */
    let startX = Math.max(Math.floor(camPos.x / (GameData.spriteScale * 16)) - 1, 0);
    let startY = Math.max(Math.floor(camPos.y / (GameData.spriteScale * 16)) - 1, 0); 
    let endX = Math.min(Math.floor((camPos.x + GameData.screen.width) / (GameData.spriteScale * 16)) +1, tileSet.length);
    for(let x = startX; x < endX; x++)
    {
        let endY = Math.min(Math.floor((camPos.y + GameData.screen.height) / (GameData.spriteScale * 16))+1, tileSet[x].length); 
        for (let y = startY; y < endY; y++)
        {
            if (tileSet[x][y] == 0)
                continue;


            GameData.ctx.drawImage(
                GameData.spriteAtlas,
                Math.floor(tileSet[x][y]%31)*16,
                Math.floor(tileSet[x][y]/31)*16,
                16,
                16,
                (x * spriteScale) + (spriteScale/2) - camPos.x, 
                (y * spriteScale) + (spriteScale/2) - camPos.y,
                spriteScale,
                spriteScale
                );
                
                if (showTileNum)
                {
                    GameData.ctx.fillStyle = "black";
                    GameData.ctx.font = "34px Arial"
                    GameData.ctx.fillText(bitmap[tileSet[x][y]],
                                            (x * spriteScale) + (spriteScale) - camPos.x - 10,
                                            (y * spriteScale) + (spriteScale) - camPos.y)
                    GameData.ctx.strokeStyle = "white";
                    GameData.ctx.font = "30px Arial"
                    GameData.ctx.strokeText(bitmap[tileSet[x][y]],
                                            (x * spriteScale) + (spriteScale) - camPos.x - 10,
                                            (y * spriteScale) + (spriteScale) - camPos.y)
                }
        }
    }

    /* == PLAYER GHOST == */
    GameData.ctx.globalAlpha = 0.3;
    GameData.ctx.drawImage(GameData.spriteAtlas,
                            GameData.spriteIndex["playerLeft"].x,
                            GameData.spriteIndex["playerLeft"].y,
                            GameData.spriteIndex["playerLeft"].w,
                            GameData.spriteIndex["playerLeft"].h,
                            2000 - camPos.x,
                            2000 - camPos.y,
                            GameData.spriteIndex["playerLeft"].w * GameData.spriteScale,
                            GameData.spriteIndex["playerLeft"].h * GameData.spriteScale)
    GameData.ctx.globalAlpha = 1;

    /* == DECO GHOST == */
    if (selectedTool == 1)
    {
        let sIndex = GameData.spriteIndex.deco[selectedDeco];


        let mousePos = Input.MousePosition();
        let tPos = new Vector2(
            Math.round((mousePos.x + camPos.x) / spriteScale)-1,
            Math.round((mousePos.y + camPos.y) / spriteScale)-1 
        )

        GameData.ctx.globalAlpha = 0.4;
        if (tPos.x > 0 && tPos.y > 0) 
        GameData.ctx.drawImage(
            GameData.spriteAtlas,
            sIndex.x,
            sIndex.y,
            sIndex.w,
            sIndex.h,
            (tPos.x * GameData.spriteScale * 16) - camPos.x + (GameData.spriteScale/2 * 16),
            (tPos.y * GameData.spriteScale * 16) - camPos.y + (GameData.spriteScale/2 * 16),
            sIndex.w * GameData.spriteScale,
            sIndex.h * GameData.spriteScale,
        )
        GameData.ctx.globalAlpha = 1.0;
    }

    /* == DECO == */
    for (let i = 0; i < decoSet.length; i++)
    {
        let sprInd = GameData.spriteIndex.deco[decoSet[i].index];

        let tPosX = ((decoSet[i].x * GameData.spriteScale * 16) - camPos.x) + GameData.spriteScale * 8,
            tPosY = ((decoSet[i].y * GameData.spriteScale * 16) - camPos.y) + GameData.spriteScale * 8;  

        GameData.ctx.drawImage(GameData.spriteAtlas,
            sprInd.x,
            sprInd.y, 
            sprInd.w,
            sprInd.h,
            tPosX,
            tPosY,
            sprInd.w * GameData.spriteScale,
            sprInd.h * GameData.spriteScale,
            )
    }

    /* == ENT GHOST == */
    if (selectedTool === 2)
    {
        let tScale = GameData.spriteScale * 16;
        let mousePos = Input.MousePosition();
        let tPos = new Vector2(
            Math.round((mousePos.x + camPos.x) / tScale) * tScale - (tScale/2) - camPos.x,
            Math.round((mousePos.y + camPos.y) / tScale) * tScale - (tScale/2) - camPos.y
        )

        if (tPos.x > 0 && tPos.y > 0) 
        {
            GameData.ctx.globalAlpha = 0.4;
            GameData.ctx.fillStyle = "red";
            GameData.ctx.beginPath();
            GameData.ctx.roundRect(
                tPos.x ,
                tPos.y ,
                16 * GameData.spriteScale,
                16 * GameData.spriteScale,
                20
            )
            GameData.ctx.fill();
            GameData.ctx.globalAlpha = 1.0;
        }
    }

    /* == Ents == */
    for(let i = 0; i < entitySet.length; i++)
    {
        let tScale = GameData.spriteScale * 16;
        let tPosX = tScale * entitySet[i].x - camPos.x + (tScale/2),
            tPosY = tScale * entitySet[i].y - camPos.y + (tScale/2);
        

        GameData.ctx.fillStyle = "red";
        GameData.ctx.beginPath();
        GameData.ctx.roundRect(
            tPosX,
            tPosY,
            tScale,
            tScale,
            20
        );
        GameData.ctx.fill();
        GameData.ctx.fillStyle = "black";
        GameData.ctx.textAlign = "center"
        GameData.ctx.textBaseline = "middle"
        
        GameData.ctx.font = "32px Pixeloid"
        GameData.ctx.fillText(entitySet[i].name,
            tPosX + (tScale/2), 
            tPosY + (tScale/2)
            )
        
    }

    /* == GRID == */
    if (showGrid)
    {
        let tileSize = 16 * GameData.spriteScale;
        for (let x = tileSize/2; x < GameData.screen.width; x+=tileSize)
        {
            GameData.ctx.beginPath();
            
            let pos = x - Math.ceil(camPos.x % tileSize);
            GameData.ctx.strokeStyle = x + camPos.x < tileSize/1.99 ? "Red" : "White";
            GameData.ctx.moveTo(pos, 0);
            GameData.ctx.lineTo(pos, GameData.screen.height);
            GameData.ctx.stroke();
        }
    
        for (let y = tileSize/2; y < GameData.screen.height; y+=tileSize)
        {
            GameData.ctx.beginPath();

            let pos = y - Math.ceil(camPos.y % tileSize);
            GameData.ctx.strokeStyle = y + camPos.y < tileSize/1.99 ? "Red" : "White";

            GameData.ctx.moveTo(0, pos);
            GameData.ctx.lineTo(GameData.screen.width, pos);
            GameData.ctx.stroke();
        }
    }

    /* == PANEL MENU == */
    GameData.ctx.fillStyle = "lightGray";
    GameData.ctx.beginPath();
    GameData.ctx.roundRect(
        10, 
        (GameData.screen.height - GameData.spriteScale * 32),
        GameData.screen.width - 20,
        GameData.spriteScale * 32 - 10,
        30);
        GameData.ctx.fill();


    for (let i = 0; i < GameData.spriteIndex.deco.length; i++)
    {
        let spriteIndex = GameData.spriteIndex.deco[i];

        let xPos = (i*1.25) * 16 * GameData.spriteScale + 100,
            yPos = (GameData.screen.height - GameData.spriteScale * 16) - (GameData.spriteScale *8);

        
        if (selectedDeco === i)
        {
            GameData.ctx.fillStyle = "gray";
            GameData.ctx.beginPath();
            GameData.ctx.roundRect(xPos, yPos, 16 * GameData.spriteScale, 16 * GameData.spriteScale, 4);
            GameData.ctx.fill();
        }

        GameData.ctx.drawImage(
            GameData.spriteAtlas,
            spriteIndex.x,
            spriteIndex.y,
            spriteIndex.w,
            spriteIndex.h,
            xPos,
            yPos,
            16 * GameData.spriteScale,
            16 * GameData.spriteScale
        );

    }


}

function draw()
{
    if (!isMouseDown)
        return;

    let mousePos = Input.MousePosition();

    let tPos = new Vector2(
        Math.round((mousePos.x + camPos.x) / spriteScale)-1,
        Math.round((mousePos.y + camPos.y) / spriteScale)-1 
    )

    if (tPos.x < 0 || tPos.y < 0)
        return;

    switch (selectedTool)
    {
        case 0: wallTool(tPos.x, tPos.y); break;
        case 1: decoTool(tPos.x, tPos.y); break;
        case 2: entityTool(tPos.x, tPos.y); break;
    }
}

function wallTool(x, y)
{

    while (tileSet.length <= x)
    {
        tileSet[tileSet.length] = [];
    }

    while (tileSet[x].length < y)
    {
        tileSet[x][tileSet[x].length] = 0;
    }

    let genTile = getTileIndex(x, y)+1;


    tileSet[x][y] = isEraseMode ? 0 : genTile;

    for (let i = 0; i < neighbours.length; i++)
    {
        let modX = x + neighbours[i].x,
            modY = y + neighbours[i].y;

        if (getTileOrZero(modX, modY) === 0)
            continue;

        tileSet[modX][modY] = getTileIndex(modX, modY)+1;
    }
}

function decoTool(x,y)
{
    let existingDeco = decoSet.find(v=>{ return v.x === x && v.y === y});
    if (existingDeco !== undefined)
    {
        decoSet.splice(decoSet.indexOf(existingDeco), 1);
    }

    if (!isEraseMode)
        decoSet.push(new Deco(x,y,selectedDeco));
}

function entityTool(x,y)
{
    let existingEnt = entitySet.find(v=>{ return v.x === x && v.y === y});
    if (existingEnt !== undefined)
    {
        entitySet.splice(entitySet.indexOf(existingEnt), 1);
    }

    if (!isEraseMode)
    {
        entitySet.push(new Entity(x,y,entitySet.length));
    }
}

function getTileIndex(x,y)
{
    let NW = getTileOrZero(x-1,y-1) === 0 ? 0 : 1;
    let N = getTileOrZero(x,y-1) === 0 ? 0 : 2;
    let NE = getTileOrZero(x+1,y-1) === 0 ? 0 : 4;
    let W = getTileOrZero(x-1,y) === 0 ? 0 : 8;
    let E = getTileOrZero(x+1,y) === 0 ? 0 : 16;
    let SW = getTileOrZero(x-1,y+1) === 0 ? 0 : 32;
    let S = getTileOrZero(x,y+1) === 0 ? 0 : 64;
    let SE = getTileOrZero(x+1,y+1) === 0 ? 0 : 128;

    // Exclude redundant corners
    if (N === 0)
    {
        NW = 0;
        NE = 0;
    }
    if (E === 0)
    {
        NE = 0;
        SE = 0;       
    }
    if (W === 0)
    {
        NW = 0;
        SW = 0;       
    }
    if (S === 0)
    {
        SW = 0;
        SE = 0;  
    }

    let tileIndex = NW + N + NE + W + E + SW + S + SE;

    return bitmap[tileIndex + ''] ;
}

function getTileOrZero(x,y)
{
    if (x >= tileSet.length  || x < 0 || y >= tileSet[x].length || y < 0)
        return 0;


    return tileSet[x][y];

}

