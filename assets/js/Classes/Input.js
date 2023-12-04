import { Vector2 } from "./Vector2.js";
import { GameData } from "./GameData.js";


export class Input
{
    static #keysDown = new Set();
    static #mousePos = new Vector2();
    static enabled = true;


    static HookToEvents()
    {
        window.addEventListener("keydown", Input.#keydown);
        window.addEventListener("keyup", Input.#keyup);
        window.addEventListener("mousemove", Input.#mousemove);
    }

    static IsKeyDown(key)
    {
        return Input.enabled && Input.#keysDown.has(key.toLowerCase());
    }

    static MousePosition()
    {
        return this.#mousePos;
    }
    
    static #keydown(event)
    {
        Input.#keysDown.add(event.key.toLowerCase(), 1);
    }

    static #keyup(event)
    {
        Input.#keysDown.delete(event.key.toLowerCase());
    }

    static #mousemove(event)
    {
        const rect = GameData.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        Input.#mousePos = new Vector2(x,y);
    }

}