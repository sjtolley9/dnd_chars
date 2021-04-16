Game.model = (function(input, components, renderer){
    // Define inputs

    let c = document.getElementById("canvas").getContext("2d");
    components.navmesh.initialize();

    let that = {
        time: 0,
        testEnemy: Enemy({
            center: Vector2D(506+20,253),
            hp: 500,
            payload: 1
        }),
        towers: [],
        enemies: [],
        bullets: [],
    };

    /*if (Game.components.navmesh.addObstacle(0,4)) {
        that.towers.push(RandomTower({position: Vector2D(0,4)}));
    }

    if (Game.components.navmesh.addObstacle(1,5)) {
        that.towers.push(NeutronSpewer({position: Vector2D(1,5)}));
    }*/
    
    that.attemptTowerPlacement = function(x,y,tower, upgrades=0) {
        if (Game.components.navmesh.addObstacle(x,y)) {
            let t = tower({position: Vector2D(x,y)});
            for (let u = 0; u < upgrades; u++) {
                t.upgrade();
            }
            that.towers.push(t);
        }
    }

    that.attemptTowerPlacement(0,4,BaryonCannon)
    that.attemptTowerPlacement(4,5,HyperMachineGun)
    //that.attemptTowerPlacement(0,7,NeutronSpewer)

    console.log("Enemies: ", that.enemies.length);

    //that.towers[that.towers.length-1].selected = true;

    that.initialize = function() {
        // Reset Game/Maybe load save?
    };

    that.processInput = function(elapsedTime) {
        // Process input
    };

    let q = 1000;

    that.update = function(elapsedTime) {
        that.time += elapsedTime;
        q -= elapsedTime;
        if (q < 0) {
            q = 1000;
            that.enemies.push(
                Enemy({
                    center: Vector2D(-23,253),
                    hp: 3,
                    payload: 1
                })
            );
            that.enemies.push(
                Enemy({
                    center: Vector2D(253,-23),
                    hp: Math.random()*5,
                    payload: 1
                })
            );
        }

        // Update Components
        if (elapsedTime > 10000/60) {
            console.log("Over time: " + elapsedTime);
        }

        for (i in that.towers) {
            that.towers[i].update(elapsedTime);
        }

        let bulls = []
        for (let i in that.bullets) {
            that.bullets[i].update(elapsedTime);

            for (let j in that.enemies) {
                let bul = that.bullets[i];
                let en = that.enemies[j].center;
                if (Math.abs(bul.center.x-en.x)+Math.abs(bul.center.y-en.y) < 21) {
                    bul.life = -1;
                    that.enemies[j].hp -= bul.power;
                }
            }

            if (that.bullets[i].life > 0) {
                bulls.push(that.bullets[i]);
            }
        }

        that.bullets = bulls;

        let new_enemies = [];
        for (let i in that.enemies) {
            that.enemies[i].update(elapsedTime);
            if (that.enemies[i].hp > 0) {
                new_enemies.push(that.enemies[i]);
            }
        }

        that.enemies = new_enemies;

        MOUSE_NEW -= elapsedTime;
    };

    that.render = function() {
        renderer.core.clear();

        for (let i in that.towers) {
            renderer.tower.renderTower(that.towers[i]);
        }

        for (let i in that.enemies) {
            let en =that.enemies[i].center;
            let ey =that.enemies[i];
            renderer.core.drawPoint(that.enemies[i].center, that.enemies[i].color||"red", 40);
            renderer.core.drawLine(Vector2D(en.x-20,en.y-23),Vector2D(en.x-20+(ey.hp/ey.mhp)*40,en.y-23), "green",5);
        }

        for (let i in that.bullets) {
            that.bullets[i].render();
        }
    };

    return that;
}(Game.input, Game.components, Game.renderer));
