

export class Shadow
{
    static draw(x, y, width, height, ctx)
    {
        let floatShadowScale = (((Math.sin(performance.now() / 300) + 1)/2) * 0.1) + 0.2;

        let 
            sWidth = width * floatShadowScale,
            sHeight = (width/6) * floatShadowScale;

        ctx.beginPath();
        ctx.fillStyle = "lightGray";
        ctx.globalAlpha = 0.3;
        ctx.ellipse(x + width/2, y + height * 1.2, sWidth, sHeight, 0, 0, Math.PI * 2)
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}