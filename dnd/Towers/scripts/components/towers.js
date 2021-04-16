Game.components.Tower = Tower = function(spec) {
    let that = {
        level: spec.level || 1,
        range: spec.range || 1,
        power: spec.power || 1,
        speed: spec.speed || 1,

        position: spec.position,
        center: {x: spec.position.x*46+23, y: spec.position.y*46+23},
        rotation: 0,

        texture: spec.texture || Game.assets.textures.getTexture("turret11"),

        target: Vector2D(46,0),
        cooldown: 0,
    }

    that.hasUpgrades = function() {
        return that.level < 3;
    }

    that.update = function(elapsedTime) {
        let dist = 1000;
        that.ready = false;
        for (i in Game.model.enemies) {
            let en = Game.model.enemies[i].center;
            let d = Vector2D(that.center.x-en.x, that.center.y-en.y);
            if (d.magnitude() < dist && d.magnitude() < 46*(1+that.range)) {
                dist = d.magnitude();
                that.target = en;
                that.ready = true;
            }
        }

        if (Game.game.debug && false) {
            if (MOUSE_NEW > 0 && Vector2D(that.center.x-MOUSE_X, that.center.y-MOUSE_Y).magnitude() < 46*(1+that.range)) {
                that.target = Vector2D(MOUSE_X, MOUSE_Y);
                that.ready = true;
            }
        }

        var result = Game.components.computeAngle(that.rotation, that.center, that.target);
        if (Game.components.testTolerance(result.angle, 0, .05) === false) {
            if (result.crossProduct > 0) {
                that.rotation += elapsedTime*Math.PI*0.002;
            } else {
                that.rotation -= elapsedTime*Math.PI*0.002;
            }
        }

        if (that.ready) {
            that.cooldown -= elapsedTime;
            while (that.cooldown <= 0) {
                that.cooldown += 2000/that.speed;
                that.shoot();
            }
        } else if (that.cooldown > 0) {
            that.cooldown -= elapsedTime;
        }
    }

    that.shoot = function() {
        Game.model.bullets.push(Game.components.Bullet(
            {...that.center},
            Vector2D(Math.cos(that.rotation)*0.2,Math.sin(that.rotation)*0.2),
            that.power
        ));
    }

    return that;
};

Game.components.NeutronSpewer = NeutronSpewer = function(spec) {
    spec.texture = Game.assets.textures.getTexture("turret11");
    spec.level = 1;
    spec.range = 3;
    spec.power = 3;
    spec.speed = 3;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 1;
        that.speed += 1;
        that.level += 1;
        if (that.level > 1) {
            that.texture = Game.assets.textures.getTexture(`turret1${that.level}`);
        }
    }

    return that;
};



Game.components.BaryonCannon = BaryonCannon = function(spec) {
    spec.texture = Game.assets.textures.getTexture("turret21");
    spec.level = 1;
    spec.range = 1;
    spec.power = 5;
    spec.speed = 2;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 2;
        that.speed += 1;
        that.range += 1;
        that.level += 1;
        if (that.level > 1) {
            that.texture = Game.assets.textures.getTexture(`turret2${that.level}`);
        }
    }

    return that;
};

function offset_number(a) {
    return (-1+2*Math.random())*a;
}

Game.components.HyperMachineGun = HyperMachineGun = function(spec) {
    spec.texture = Game.assets.textures.getTexture("turret31");
    spec.level = 1;
    spec.range = 2;
    spec.power = 1;
    spec.speed = 10;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 1;
        that.speed += 2;
        that.range += 1;
        that.level += 1;
        if (that.level > 1 && that.level < 4) {
            that.texture = Game.assets.textures.getTexture(`turret3${that.level}`);
        }
    }

    that.shoot = function() {
        let o1 = offset_number(0.1)/2;
        let o2 = offset_number(0.2)/2;
        let o3 = offset_number(0.2)/2;
        Game.model.bullets.push(Game.components.Bullet(
            {...that.center},
            Vector2D(Math.cos(that.rotation+o1)*0.2,Math.sin(that.rotation+o1)*0.2),
            that.power
        ));

        Game.model.bullets.push(Game.components.Bullet(
            Vector2D(that.center.x+Math.cos(that.rotation-Math.PI/2)*15,that.center.y+Math.sin(that.rotation-Math.PI/2)*15),
            Vector2D(Math.cos(that.rotation+o2)*0.2,Math.sin(that.rotation+o2)*0.2),
            that.power
        ));

        Game.model.bullets.push(Game.components.Bullet(
            Vector2D(that.center.x+Math.cos(that.rotation+Math.PI/2)*15,that.center.y+Math.sin(that.rotation+Math.PI/2)*15),
            Vector2D(Math.cos(that.rotation+o3)*0.2,Math.sin(that.rotation+o3)*0.2),
            that.power
        ));
    }

    //that.selected = true;
    if (Math.random() < -0.4) {
        that.upgrade();
        that.upgrade();
    }

    return that;
};

Game.components.RandomTower = RandomTower = function(spec) {
    let a = [BaryonCannon,NeutronSpewer,HyperMachineGun];
    return a[Math.floor(Math.random()*3)](spec);
}