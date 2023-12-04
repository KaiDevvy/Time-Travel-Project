import { GameData } from "./GameData.js";
import { Mathe } from "./Mathe.js";
import { Vector2 } from "./Vector2.js";

export class Camera
{
    static position = new Vector2(0,0);
    static #shakeOffset = new Vector2(0,0);
    static #shakeIntensity = 0;
    static #shakeTime = performance.now();
    static #shakeLength = 1;

    static lerpTowards(x,y)
    {
        let trackingSpeed = 5.5 * GameData.deltaTime;

        // Update camera to track player
        Camera.position.x =Mathe.lerp(Camera.position.x, x, trackingSpeed);
        Camera.position.y = Mathe.lerp(Camera.position.y, y, trackingSpeed);

        let shakeStrength = 1- ((performance.now() - this.#shakeTime) / this.#shakeLength);
        
        if (shakeStrength > 0)
        {
            Camera.position.x += ((Math.random()-0.5)*2) * this.#shakeIntensity * shakeStrength;
            Camera.position.y += ((Math.random()-0.5)*2) * this.#shakeIntensity * shakeStrength;
        }

        // NOTE: We lock the camera to increments of 0.3 due to floating point rounding errors
        //       during rendering. Without this, gaps can appear between tiles when the player's moving
        Camera.position.x = Math.round(Camera.position.x / 0.3) * 0.3;
        Camera.position.y = Math.round(Camera.position.y / 0.3) * 0.3;
    }
    
    static transformPosition(x,y)
    {
        return [x - Camera.position.x, y - Camera.position.y];
    }

    static shake(intensity, time)
    {
        Camera.#shakeTime = performance.now();
        Camera.#shakeLength = time * 1000;
        Camera.#shakeIntensity = intensity;
    }
}