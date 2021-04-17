Game.renderer.core = (function() {
    let canvas = document.getElementById("canvas");
    let c = canvas.getContext("2d");

    // Clears the canvas
    function clear() {
        c.clearRect(0,0,canvas.width, canvas.height);
    }

    function drawTexture(image, center, rotation, size) {
        c.save();
        
        // Perform Transformations
        c.translate(center.x,center.y);
        c.rotate(rotation);
        //c.translate(-center.x, -center.y);

        c.drawImage(image,-size.x/2,-size.y/2,size.x, size.y);

        c.restore();
    }

    function drawSubTexture(image, index, subTextureWidth, center, rotation, size) {
        c.save();

        c.translate(center.x,center.y);
        c.rotate(rotation);

        c.drawImage(
            image,
            subTextureWidth * index, 0,      // Which sub-texture to pick out
            subTextureWidth, image.height,   // The size of the sub-texture
            - size.x / 2,           // Where to draw the sub-texture
            - size.y / 2,
            size.x, size.y);

        c.restore();
    }

    function drawPoint(center, fill, n=3) {
        c.fillStyle = fill;
        c.fillRect(center.x-n/2,center.y-n/2,n,n);
    }

    function drawLine(center, dest, fill, width=1) {
        c.strokeStyle = fill;
        c.lineWidth = width;
        c.beginPath();
        c.moveTo(center.x, center.y);
        c.lineTo(dest.x, dest.y);
        c.stroke();
    }

    function drawCircle(center, radius, fill) {
        c.strokeStyle = fill;
        c.beginPath();
        c.moveTo(center.x+radius,center.y);
        c.arc(center.x, center.y, radius, 0, Math.PI*2);
        c.stroke();
    }

    function drawHeadline(text, line=0) {
        c.font = (line == 0) ? "48px sans" : "36px sans";
        c.fillStyle = "black";
        c.strokeStyle = "black";
        let metrcis = c.measureText(text);
        c.fillText(text,270-metrcis.width/2,60+50*(line > 0)+line*40);
    }

    function drawText(center, text, fill) {
        c.fillStyle = fill;
        c.font = "24px sans";
        let metrcis = c.measureText(text);
        c.fillText(text,center.x-metrcis.width/2,center.y+10);
    }

    return {
        clear: clear,
        drawTexture: drawTexture,
        drawSubTexture,
        drawPoint,
        drawLine,
        drawCircle,
        drawHeadline,
        drawText,
    }
}());