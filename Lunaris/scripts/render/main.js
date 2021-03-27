Game.graphics = (function() {
    let canvas = document.getElementById("canvas");
    let c = canvas.getContext("2d");

    function clear() {
        c.clearRect(0,0,canvas.width, canvas.height);
    }

    function test() {
    }

    function render_terrain(terrain, color="black") {
        c.fillStyle = color;
        c.beginPath();
        c.moveTo(0,500);
        c.lineTo(0, 500-terrain[0]);
        for (let i = 1; i < terrain.length; i++) {
            c.lineTo(i*(500/(terrain.length-1)),500-terrain[i]);
        }
        c.lineTo(500,500);
        c.fill();
    }

    function render_colliders(colliders, color="black") {
        if (colliders.length == 0) return;
        c.fillStyle = color;
        c.beginPath();
        c.moveTo(0,500);
        c.lineTo(colliders[0].x1, colliders[0].y1)
        let flattys = [];

        for (let i = 0; i < colliders.length; i++) {
            if (colliders[i].y1 - colliders[i].y2 == 0 && colliders[i].x1 < colliders[i].x2) {
                flattys.push(i);
            }
            c.lineTo(colliders[i].x2, colliders[i].y2);
        }
        c.lineTo(500,500);
        c.fill();

        c.fillStyle = "green";

        for (i in flattys) {
            let flat = colliders[flattys[i]];
            c.fillRect(flat.x1,flat.y1,flat.x2-flat.x1,2);
        }
    }

    function drawCircle(center, radius, color="green") {
        c.fillStyle = color;
        c.beginPath();
        c.arc(center.x, center.y, radius, 0, 2*Math.PI);
        c.fill();
    }

    function drawSquare(center, radius, rotation, color) {
        c.save();

        c.fillStyle = color;
        c.translate(center.x, center.y);
        c.rotate(rotation);
        c.translate(-center.x, -center.y);

        c.fillRect(center.x-radius, center.y-radius,2*radius,2*radius);

        c.restore();
    }

    function fillBar(x,y,w,h,val,max,fc, bc) {
        c.fillStyle = bc;
        c.fillRect(x,y,w,h);
        c.fillStyle = fc;
        c.fillRect(x,y,w*(val/max),h);
    }

    function drawTexture(spec, debug=false) {
        center = spec.center;
        radius = spec.drawRadius;
        rotation = spec.rotation;
        if (debug) {
            console.log(rotation);
        }
        c.save();

        c.translate(center.x, center.y);
        c.rotate(rotation);
        c.translate(-center.x, -center.y);

        spec.texture.render(c, center.x-radius, center.y-radius,2*radius,2*radius);

        c.restore();
    }

    function render_timebox(timebox) {
        c.fillStyle = "blue";
        let p = 0;
        for (let i = Math.max(0,timebox.length-500); i < timebox.length; i++) {
            if (timebox[i] > 19) {
                c.fillStyle = "red";
            } else {
                c.fillStyle = "blue";
            }
            c.fillRect(p,0,1,timebox[i])
            p++;
        }
        c.strokeRect(0,0,500,16);
    }

    function drawHeadline(text, line=0) {
        c.font = (line == 0) ? "48px sans" : "36px sans";
        c.fillStyle = "white";
        c.strokeStyle = "black";
        let metrcis = c.measureText(text);
        c.fillText(text,250-metrcis.width/2,50+50*(line > 0)+line*40);
    }

    function drawText(x,y,text,color) {
        c.font = "18px sans";
        c.fillStyle=color;
        c.fillText(text,x,y);
    }

    return {
        clear, drawText, drawTexture, fillBar, test, render_terrain, render_colliders, drawCircle, render_timebox, drawSquare, drawHeadline,
    }
}());