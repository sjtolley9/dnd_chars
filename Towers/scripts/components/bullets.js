Game.components.Bullet = function(center, vel, power=1) {
    let that = {
        center: center,
        vel: vel,
        life: 5000,
        power: power,
    };

    that.update = function(elapsedTime) {
        that.center.x += that.vel.x*elapsedTime;
        that.center.y += that.vel.y*elapsedTime;
        that.life -= elapsedTime;
    }

    that.render = function() {
        Game.renderer.core.drawPoint(that.center, "yellow");
    }

    return that;
}

Game.components.Missile = Missile = function(center, target, power=1) {
    let that = {
        center,
        target,
        power: 1,
        power2: power,
        life: 3000,
    }

    that.update = function(elapsedTime) {
        that.life -= elapsedTime;
        if (that.target.hp <= 0) {
            that.life = 0;
        }
        let vel = Vector2D(target.center.x - that.center.x, target.center.y - that.center.y);
        vel.normalize();
        that.center.x += vel.x*0.16*elapsedTime;
        that.center.y += vel.y*0.16*elapsedTime;
        Game.components.ParticleSystem.makeTrail(3,that.center.x,that.center.y);
    }

    that.render = function() {
        Game.renderer.core.drawPoint(that.center, "white");
    }

    that.endLife = function() {
        if (that.target.hp > 0) Game.model.explosions.push(Explosion(that.center, 23, that.power2));
    }

    return that;
}

Game.components.Explosion = Explosion = function(center, radius, power=5) {
    let that = {
        center,
        radius,
        life: 200,
        power: power/200,
    }

    that.collidesWith = function(center, radius) {
        let v = Vector2D(that.center.x-center.x, that.center.y-center.y);
        return v.magnitude() < that.radius + radius;
    }

    that.update = function(elapsedTime) {
        that.life -= elapsedTime;
    }

    return that;
}

Game.components.Bomb = Bomb = function(center, vel, power) {
    let that = {
        center: center,
        vel: vel,
        life: 1000,
        power: 1,
        power2: power,
    };

    that.update = function(elapsedTime) {
        that.center.x += that.vel.x*elapsedTime;
        that.center.y += that.vel.y*elapsedTime;
        that.life -= elapsedTime;
        Game.components.ParticleSystem.makeTrail2(1,that.center.x,that.center.y);
    }

    that.endLife = function() {
        Game.model.explosions.push(Explosion(that.center, 46, that.power2));
    }

    that.render = function() {
        Game.renderer.core.drawPoint(that.center, "red");
    }
    
    return that;
}