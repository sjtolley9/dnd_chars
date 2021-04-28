Game.components.Tower = Tower = function(spec) {
    let that = {
        level: spec.level || 1,
        range: spec.range || 1,
        power: spec.power || 1,
        speed: spec.speed || 1,
        cost: spec.cost || 100,

        status: 0, // O : New, 1 : Standard, 2 : To Remove

        position: spec.position,
        center: {x: spec.position.x*46+23, y: spec.position.y*46+23},
        rotation: 0,

        texture: spec.texture || Game.assets.textures.getTexture("turret11"),

        target: Vector2D(46,0),
        targetEntity: null,
        cooldown: 0,
    }

    that.setPosition = function(pos) {
        that.position = pos;
        that.center = {x: pos.x*46+23, y: pos.y*46+23};
    }

    that.hasUpgrades = function() {
        return that.level < 3;
    }

    that.upgradeCost = function() {
        return (that.level+0.5)*that.cost;
    }

    that.sellCost = function() {
        return Math.floor((that.level-0.5)*that.cost);
    }

    that.upgrade = function(){};

    that.update = function(elapsedTime) {
        let dist = 1000;
        that.ready = false;
        for (i in Game.model.enemies) {
            let en = Game.model.enemies[i].center;
            let d = Vector2D(that.center.x-en.x, that.center.y-en.y);
            if (d.magnitude() < dist && d.magnitude() < 46*(1+that.range)) {
                dist = d.magnitude();
                that.target = en;
                that.targetEntity = Game.model.enemies[i];
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
    spec.power = 4;
    spec.speed = 4;
    spec.cost = 100;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 1;
        that.speed += 1;
        that.level += 1;
        if (that.level > 1 && that.level < 4) {
            that.texture = Game.assets.textures.getTexture(`turret1${that.level}`);
        }
    }

    that.shoot = function() {
        Game.model.bullets.push(Game.components.Missile(
            {...that.center},
            that.targetEntity,
            that.power
        ));
    }

    return that;
};



Game.components.BaryonCannon = BaryonCannon = function(spec) {
    spec.texture = Game.assets.textures.getTexture("turret21");
    spec.level = 1;
    spec.range = 1;
    spec.power = 5;
    spec.speed = 2;
    spec.cost = 200;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 3;
        that.speed += 1;
        that.range += 1;
        that.level += 1;
        if (that.level > 1 && that.level < 4) {
            that.texture = Game.assets.textures.getTexture(`turret2${that.level}`);
        }
    }

    that.shoot = function() {
        Game.model.bullets.push(Game.components.Bomb(
            {...that.center},
            Vector2D(Math.cos(that.rotation)*0.2,Math.sin(that.rotation)*0.2),
            that.power
        ));
    }

    return that;
};

function offset_number(a) {
    return (-1+2*Math.random())*a;
}

Game.components.Barrier = Barrier  = function(spec) {
    spec.texture = -1;
    spec.cost = 50;

    let that = Tower(spec);
    that.range = 0;

    that.shoot = function() {

    }

    that.hasUpgrades = function() {
        false;
    }

    return that;
}

Game.components.HyperMachineGun = HyperMachineGun = function(spec) {
    spec.texture = Game.assets.textures.getTexture("turret31");
    spec.level = 1;
    spec.range = 2;
    spec.power = 1;
    spec.speed = 8;
    spec.cost = 200;
    let that = Tower(spec);

    that.upgrade = function() {
        that.power += 1;
        that.speed += 1;
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

    return that;
};

let i_t = -1;
Game.components.RandomTower = RandomTower = function(spec) {
    let a = [BaryonCannon,NeutronSpewer,HyperMachineGun,Barrier];
    //i_t++;
    //i_t = i_t%4;
    return a[i_t](spec);
}