import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Input } from "./Input.js";
import { GameData } from "./GameData.js";
import { Shadow } from "./Shadow.js";
import { Text } from "./Text.js";
import { Vector2 } from "./Vector2.js";
import { Debug } from "./Debug.js";

export class Player extends Entity
{

    static instance;
    static collisionTests = [];
    static doRender = true;
    #scaledSize;
    constructor(x,y, colMap)
    {
        super(x,y,[GameData.spriteIndex.playerLeft, GameData.spriteIndex.playerRight]);
        
        Player.instance ??= this;
        this.image = null;
        this.colMap = colMap;

        let subSprite = this.spriteIndices[0];
        this.#scaledSize = new Vector2(subSprite.w * GameData.spriteScale * 0.85, subSprite.h * GameData.spriteScale * 0.85);

        this.nippleVector = new Vector2(0,0);

        let manager = nipplejs.create({
            color: 'white'
        })

        manager.on("added", (evt, nipple) => {
            nipple.on("move", (evt, data) => {
                console.log(data.vector);
                this.nippleVector = new Vector2(
                    data.vector.x , 
                    -data.vector.y
                    );
            })
            nipple.on("end", () => {
                this.nippleVector = new Vector2(0,0);
            })
        })
    }

    draw(ctx)
    {
        if (!Player.doRender)
            return;

        let subSprite = this.spriteIndices[this.spriteIndex]
        let floatOffset = Math.sin(performance.now() / 300);

        let [xPos, yPos] = Camera.transformPosition(this.position.x, this.position.y);

        Shadow.draw(xPos, yPos, this.#scaledSize.x, this.#scaledSize.y, ctx);

        ctx.drawImage(GameData.spriteAtlas, 
            subSprite.x, 
            subSprite.y, 
            subSprite.w, 
            subSprite.h, 
            xPos,
            yPos + (floatOffset * 5),
            this.#scaledSize.x, 
            this.#scaledSize.y);
    }

    update(deltaTime)
    {
        let moveSpeed = 550 * deltaTime;
        let originalX = this.position.x;

        let moveOffset = new Vector2(0,0);

        if (Input.IsKeyDown("w"))
            moveOffset.y -= moveSpeed;
        if (Input.IsKeyDown("s"))
            moveOffset.y += moveSpeed;
        if (Input.IsKeyDown("a"))
            moveOffset.x -= moveSpeed;
        if (Input.IsKeyDown("d"))
            moveOffset.x += moveSpeed;

        if (Input.IsKeyDown("i"))
            window.location.href = "./lEdit.html";

        if (this.nippleVector.x !== 0 || this.nippleVector.y !== 0)
        {
            moveOffset.x = this.nippleVector.x * moveSpeed
            moveOffset.y = this.nippleVector.y * moveSpeed;
        }

        if (Input.IsKeyDown("p"))
        {
            localStorage.clear();
            Camera.shake(20, 0.3)
        }
        

        if (Input.IsKeyDown(" "))
            Camera.shake(10, 5);


        if (this.colMap.collidesWith(
            this.position.x + moveOffset.x + this.#scaledSize.x - 60, 
            this.position.y + this.#scaledSize.y + 10, 
            45, 
            10) ||
            this.collideTest(
                this.position.x + moveOffset.x + this.#scaledSize.x - 60, 
                this.position.y + this.#scaledSize.y + 10, 
                45, 
                10
            ))
        {
            moveOffset.x = 0;
        }
        
        if (this.colMap.collidesWith(
            this.position.x + this.#scaledSize.x - 60, 
            this.position.y + moveOffset.y  + this.#scaledSize.y + 10, 
            45, 
            10) ||
            this.collideTest(
                this.position.x + this.#scaledSize.x - 60, 
                this.position.y + moveOffset.y  + this.#scaledSize.y + 10, 
                45, 
                10
            ))
        {
            moveOffset.y = 0;
        }

        this.position.x += moveOffset.x;
        this.position.y += moveOffset.y;


        if (originalX !== this.position.x)
            this.spriteIndex = this.position.x > originalX ? 1 : 0;
    }

    collideTest(x,y,w,h)
    {
        let checkPoint = (XX,YY,colTest) => {
            return XX > colTest.x && 
            XX < (colTest.x + colTest.w) &&
            YY > colTest.y && 
            YY < (colTest.y + colTest.h);
        }

        for (let i = 0; i < Player.collisionTests.length; i++)
        {
            let colTest = Player.collisionTests[i];

            let result = checkPoint(x,y,colTest) || 
                         checkPoint(x+w,y,colTest) || 
                         checkPoint(x,y+h,colTest) || 
                         checkPoint(x+w,y+h,colTest);

            if (result)
                return true;
        }

        return false;
    }
}
