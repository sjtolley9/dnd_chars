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

    return {
        clear: clear,
        drawTexture: drawTexture,
        drawPoint,
        drawLine,
        drawCircle,
    }
}());