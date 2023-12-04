
export class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    sqrDistanceTo(otherVector)
    {
        let difference = new Vector2(
            otherVector.x - this.x,
            otherVector.y - this.y
        );
        

        return difference.x * difference.x + difference.y * difference.y;
    }

    magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize()
    {
        let mag = Math.max(this.magnitude(),0.0001);
        this.x /= mag;
        this.y /= mag;
        Math.max
    }

    
    vectorTo(otherVector)
    {
        let difference = new Vector2(
            otherVector.x - this.x,
            otherVector.y - this.y
        )

        let mag = Math.sqrt(difference.x * difference.x + difference.y * difference.y);
        difference.x /= mag;
        difference.x /= mag;

        return difference
    }

    rotationTo(otherVector)
    {
        let difference = vectorTo(otherVector);

        return Math.atan2(difference.y, difference.x);
    }
}