Game.objects.Texture = function(desc) {
    let that = {
            imageSrc: desc.imageSrc,
            ready: false,
    }

    that.image = new Image();

    that.image.onload = function() {
            that.ready = true;
            console.log(that.image.src)
    }

    that.image.src = that.imageSrc;

    that.render = function(c, x, y, w, h) {
            if (that.ready) {
                    c.drawImage(that.image, x, y, w, h);
            }
    }

    return {
            render: that.render,
    }

};

Game.objects.Test = function(spec) {
    let thrust = 0.0025; // 0.005

    let dflt = {
        center: {...spec.center},
        radius: spec.radius,
    }

    let red = false;
    let speed = 0.1;
    let v = {x: 0, y: 0};
    let rotation = 0;
    let rotation2 = 0;
    let control = true;
    let doUpdate = true;
    let texture = Game.objects.Texture({imageSrc: "module.png"});
    let fuel = 6000;
    let mingl = 0;
    let maxgle = 0;
    let extra_points = 0;

    function stopControl(bad=true) {
        control = false;
        doUpdate = false;
        if (bad) {
            Game.objects.ParticleSystem.makeExplosion(100+fuel/9,spec.center.x, spec.center.y);
            Game.objects.sounds.explosion.play();
            Game.objects.sounds.thrust.pause();
            fuel = 0;
        } else {
            Game.objects.ParticleSystem.makeLanded(100+fuel/9,spec.center.x, spec.center.y);
            Game.objects.sounds.landed.play();
            Game.objects.sounds.thrust.pause();
        }
    }

    function reset() {
        rotation = rotation2 = 0;
        v.x = v.y = 0;
        spec.center = {...dflt.center};
        doUpdate = control = true;
        fuel = 6000;
        mingl=maxgle=0;
        extra_points=0;
    }

    function restoreControl() {
        control = true;
        rotation = 0;
    }

    function launch( restore=true) {
        if (true || control) return;
        control = restore;
        v.y = -3;
        v.x = 0;
        doUpdate = true;
    }

    function fromDegrees(rot) {
        return rot*(Math.PI/180);
    }

    rotation = fromDegrees(355);

    function toDegrees(rotation1=rotation) {
        return (rotation1*180/Math.PI) % 360;
    }

    function moveLeft(elapsedTime) {
        if (!control) return;
        rotation -= elapsedTime*0.002;
        rotation2 -= elapsedTime*0.002;
        if (rotation < 0) {
            rotation += Math.PI*2;
        }
    }
    function moveRight(elapsedTime) {
        if (!control) return;
        rotation += elapsedTime*0.002;
        rotation2 += elapsedTime*0.002;
    }
    function moveUp(elapsedTime) {
        if (!control || fuel <= 0) return;
        fuel -= elapsedTime;
        v.y -= Math.sin(rotation +Math.PI/2)*elapsedTime*thrust;
        v.x -= Math.cos(rotation +Math.PI/2)*elapsedTime*thrust;
		Game.objects.ParticleSystem.makeFire(10,spec.center.x,spec.center.y,rotation+Math.PI/2);
    }
    function moveDown(elapsedTime) {
    }

    function setPosition(x,y) {
        spec.center.x = x;
        spec.center.y = y;
        dflt.center = {x,y};
        console.log(spec.center.x,spec.center.y)
    }

    function update(elapsedTime) {
        if (!doUpdate) return;
        v.y += elapsedTime*0.001;
        spec.center.y += v.y;
        spec.center.x += v.x;
        if (rotation2 < mingl) {
            mingl = rotation2;
        } else if (rotation2 > maxgle) {
            maxgle= rotation2;
        }
        if (maxgle-mingl >= Math.PI*2) {
            mingl=maxgle=rotation2;
            extra_points += 6000;
            fuel = 6000;
            Game.objects.ParticleSystem.makeFlip(spec.center.x,spec.center.y);
            Game.objects.sounds.flip.play();
        }
    }

    function isLandingAngle() {
        return toDegrees() <= 5 || toDegrees() >= 355;
    }

    function isLangingVel() {
        return magnitude2() < 0.5 && v.y > 0;
    }

    function magnitude2() {return v.x**2+v.y**2;}

    function magnitude() {return Math.sqrt(magnitude2())*2/Math.sqrt(0.5);}

    return {
        setPosition, reset, restoreControl, launch, moveLeft, moveRight, moveUp, moveDown, red, update, toDegrees, isLandingAngle, stopControl, isLangingVel,
        magnitude,
        get center() { return spec.center;},
        get radius() { return spec.radius;},
        get drawRadius() {return spec.radius + 5;},
        get rotation() { return rotation;},
        get v() {return v;},
        get hasControl() {return control;},
        get texture() {return texture;},
        get fuel() {return fuel;},
        get bonusPoints() {return extra_points;},
        get outOfBounds() {return spec.center.x <= -100 || spec.center.x >=600 || spec.center.y<=-100 || spec.center.y>=600},
    }
}