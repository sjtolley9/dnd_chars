/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let gameBox = Box2D(Vector2D(0,0), Vector2D(505,506))

let sideBox = Box2D(Vector2D(506,0), Vector2D(598,506))

let upgradeBox = Box2D(Vector2D(506,46*3+20),Vector2D(506+98,46*3+20+50));

let sellBox = Box2D(Vector2D(506,46*3+70),Vector2D(506+98,46*3+70+50));

let startBox = Box2D(Vector2D(506,460),Vector2D(506+92,506))

let base_hp = 15;

let dbg1 = false;

let TowerBoxes = [
    Box2D(Vector2D(506,0),Vector2D(552,46)),
    Box2D(Vector2D(506+46,0),Vector2D(552+46,46)),
    Box2D(Vector2D(506,0+46),Vector2D(552,46+46)),
    Box2D(Vector2D(506+46,0+46),Vector2D(552+46,46+46)),
];

Game.components.Placer = Placer = function(){

    let prices = [
        200,
        100,
        200,
        50,
    ];

    let towers = [BaryonCannon,NeutronSpewer,HyperMachineGun,Barrier];
    
    let that = {
        iX: 0,
        iY: 0,

        model: null,

        placing: null,
        placingIndex: -1,

        selected: null,
    }

    that.upgrade = function() {
        if (that.selected != null && that.selected.hasUpgrades() && that.model.moolah >= that.selected.upgradeCost()) {
            that.model.moolah -= that.selected.upgradeCost();
            that.selected.upgrade();
        }
    }

    that.sell = function() {
        if (that.selected != null) {
            that.selected.status = 2;
            that.model.moolah += that.selected.sellCost();
            that.selected = null;
        }
    }

    that.deselect = function(e) {
        that.selected.selected = false;
        that.selected = null;
    }

    that.mouseDown = function(e) {
        let v = Vector2D(e.offsetX,e.offsetY);
        let iV = Vector2D(Math.floor(v.x/46),Math.floor(v.y/46));
        
        if (gameBox.isInside(v)) {
            if (that.selected) {
                that.deselect();
            }
            if (that.placing == null) {
                if (that.selected == null) {
                    for (let i in that.model.towers) {
                        let tower = that.model.towers[i];
                        if (iV.x == tower.position.x && iV.y == tower.position.y) {
                            tower.selected = true;
                            that.selected = tower;
                        }
                    }
                } else {
                    that.deselect();
                }
            } else {
                that.placing = null;
                i_t = -1;
                let place = Game.components.navmesh.addObstacle(iV.x, iV.y);
                console.log(place);

                if (place) {
                    that.model.towers.push(towers[that.placingIndex]({position: iV}));
                    that.model.moolah -= prices[that.placingIndex];
                    console.log(that.model.moolah);
                }
            }
        } else {
            let h = false;
            for (let b in TowerBoxes) {
                if (TowerBoxes[b].isInside(v) && that.model.moolah >= prices[b]) {

                    if (that.selected) {
                        that.selected.selected = false;
                        that.selected = null;
                    }

                    i_t = b;
                    h = true;
                    that.placing = true;
                    that.placingIndex = b;
                }
            }

            if (!h) {
                i_t = -1;
                that.placing = null;
            }

            if (that.selected && sellBox.isInside(v)) {
                that.sell();
                that.selected = null;
            }

            if (that.selected && upgradeBox.isInside(v)) {
                that.upgrade();
            }

            if (startBox.isInside(v)) {
                that.model.startLevel();
            }
        }
    }

    that.mouseMove = function(e) {
        let v = Vector2D(e.offsetX,e.offsetY);
        
        if (gameBox.isInside(v)) {
            that.iX = Math.floor(e.offsetX/46);
            that.iY = Math.floor(e.offsetY/46);
        }
    }

    return that;
}();

Game.model = (function(input, components, renderer){
    // Define inputs

    let c = document.getElementById("canvas").getContext("2d");

    let mouse = input.Mouse();
    let keyboard = input.Keyboard();

    let that = {
        time: 0,
        testEnemy: Enemy({
            center: Vector2D(506+20,253),
            hp: 500,
            payload: 1
        }),
        points: 0,
        towers: [],
        enemies: [],
        bullets: [],
        moolah: 500,
        scored: true,
        mockTowers: [
            BaryonCannon({position: Vector2D(-1,-1)}),
            NeutronSpewer({position: Vector2D(-1,-1)}),
            HyperMachineGun({position: Vector2D(-1,-1)}),
            Barrier({position: Vector2D(-1,-1)}),
        ],
        explosions: [],
        health: 100,
    };

    that.startLevel = function() {
        if (!components.Levels.playing && !that.enemies.length) {
            components.Levels.startLevel();
            that.scored = false;
        }
    }

    that.endGame = function() {
        components.Score.gameOver(that.points);
        components.Levels.reset();
        components.ParticleSystem.reset();
    }

    that.run = function() {
        for (i in Game.components.KeyboardSetter.dereg) {
            let key = Game.components.KeyboardSetter.dereg[i];
			keyboard.deregister(key);
        }

        keyboard.register(Game.components.KeyboardSetter.settings.sell, Placer.sell, true);
        keyboard.register(Game.components.KeyboardSetter.settings.upgrade, Placer.upgrade, true);
        keyboard.register(Game.components.KeyboardSetter.settings.go, that.startLevel, true);
        components.navmesh.initialize();
        
        that.time = 0;
        that.towers = [];
        that.enemies = [];
        that.bullets = [];
        that.moolah = 500;
        that.mockTowers = [
            BaryonCannon({position: Vector2D(-1,-1)}),
            NeutronSpewer({position: Vector2D(-1,-1)}),
            HyperMachineGun({position: Vector2D(-1,-1)}),
            Barrier({position: Vector2D(-1,-1)}),
        ];
        that.explosions = [];
        that.health = 100;
        that.update = that.gameupdate;
        that.points = 0;
    }

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
            return true;
        }
        return false;
    }

    document.getElementById("canvas").onmousedown = function(e) {
        let x = Math.floor(e.offsetX/46);
        let y = Math.floor(e.offsetY/46);

        if (gameBox.isInside(Vector2D(e.offsetX,e.offsetY))) {
            // Do game box stuff
        } else {
            // Do Side bar things
        }
    }

    that.initialize = function() {
        mouse.register("mousemove", Placer.mouseMove);
        mouse.register("mousedown", Placer.mouseDown);

        Placer.model = that;

        // Reset Game/Maybe load save?
    };

    that.processInput = function(elapsedTime) {
        // Process input
        mouse.update(elapsedTime);
        keyboard.update(elapsedTime);
    };

    let q = 1000;

    that.gameoverupdate = function(elapsedTime) {
        if (!that.scored) {
            Game.components.Score.gameOver(that.points);
            that.scored = true;
        }
    }

    that.gameupdate = function(elapsedTime) {
        that.time += ~~elapsedTime;

        if (that.health <= 0) {
            that.update = that.gameoverupdate;
            return;
        }

        if (!that.scored && !components.Levels.playing && !that.enemies.length) {
            components.Score.gameOver(that.points);
            that.scored = true;
        }

        Game.assets.textures.getTexture("blue").update(elapsedTime);
        Game.assets.textures.getTexture("blue1").update(elapsedTime);
        Game.assets.textures.getTexture("red1").update(elapsedTime);

        Game.components.ParticleSystem.update(elapsedTime);

        // Enemies and Levels
        Game.components.Levels.update(elapsedTime);

        // Update Components
        if (elapsedTime > 10000/60) {
            console.log("Over time: " + elapsedTime);
        }

        let new_towers = [];
        for (let i in that.towers) {
            if (that.towers[i].status != 2) {
                if (that.towers[i].status == 0) {
                    // Spawn lose money effect
                    Game.components.ParticleSystem.makeNegCashMoney(that.towers[i].center.x,that.towers[i].center.y,that.towers[i].cost);
                    that.towers[i].status = 1;
                }
                that.towers[i].update(elapsedTime);
                new_towers.push(that.towers[i]);
            } else {
                // Spawn money effect
                Game.components.ParticleSystem.makeCashMoney(that.towers[i].center.x,that.towers[i].center.y,that.towers[i].sellCost());
                Game.components.navmesh.removeObstacle(that.towers[i].position.x,that.towers[i].position.y);
            }
        }
        that.towers = new_towers;

        let new_splosions = [];
        for (let i in that.explosions) {
            that.explosions[i].update(elapsedTime);

            for (let j in that.enemies) {
                if (that.explosions[i].collidesWith(that.enemies[j].center, 23)) {
                    that.enemies[j].hp -= that.explosions[i].power*elapsedTime;
                }
            }

            if (that.explosions[i].life > 0) {
                new_splosions.push(that.explosions[i]);
            }
        }
        that.explosions = new_splosions;

        let bulls = []
        for (let i in that.bullets) {
            that.bullets[i].update(elapsedTime);

            for (let j in that.enemies) {
                let bul = that.bullets[i];
                let en = that.enemies[j].center;
                if (Math.abs(bul.center.x-en.x)+Math.abs(bul.center.y-en.y) < 21) {
                    bul.life = -1;
                    that.enemies[j].hp -= bul.power;
                    if (that.enemies[j].hp <= 0) {
                    }
                }
            }

            if (that.bullets[i].life > 0) {
                bulls.push(that.bullets[i]);
            } else if (that.bullets[i].endLife) {
                that.bullets[i].endLife();
            }
        }

        that.bullets = bulls;

        let new_enemies = [];
        for (let i in that.enemies) {
            that.enemies[i].update(elapsedTime);
            if (that.enemies[i].hp > 0) {
                new_enemies.push(that.enemies[i]);
            } else if (!that.enemies[i].noMoney) {
                Game.components.ParticleSystem.makeCashMoney(that.enemies[i].center.x,that.enemies[i].center.y,that.enemies[i].getWorth());
                that.moolah += that.enemies[i].getWorth();
                that.points += that.enemies[i].getWorth();
            }
        }

        that.enemies = new_enemies;

        MOUSE_NEW -= elapsedTime;
    };

    that.render = function() {
        renderer.core.clear();

        if (that.health <= 0) {
            renderer.core.drawRect(Box2D(Vector2D(0,0),Vector2D(606,506)),"red");
            renderer.core.drawHeadline("Game Over",0)
            return;
        }

        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                renderer.textures.renderTexture(
                    Game.assets.textures.getTexture("bg1"),
                    {
                        center: Vector2D(i*46+23,j*46+23),
                        rotation: 0, 
                        size: Vector2D(46,46)
                    }
                );
            }
        }

        // Render helper circles
        if (components.Levels.levels[components.Levels.index+1]) {
            let lev = components.Levels.levels[components.Levels.index+1];
            if (lev.entrances & 1) {
                renderer.core.drawPoint(Vector2D(23+46*5,23),"red",20)
            }
            if (lev.entrances & 2) {
                renderer.core.drawPoint(Vector2D(23,23+46*5),"red",20)
            }
        }

        for (let i in that.towers) {
            renderer.tower.renderTower(that.towers[i]);
        }

        for (let i in that.enemies) {
            let en =that.enemies[i].center;
            let ey =that.enemies[i];
            let rot = 0;
            if (ey.dir == 0) {
                rot = -Math.PI/2;
            } else if (ey.dir == 2) {
                rot = Math.PI/2;
            } else if (ey.dir == 3) {
                rot = Math.PI;
            }
            if (ey.fly) {
                Game.assets.textures.getTexture("blue").render({
                    center: en,
                    rotation: rot,
                    size: Vector2D(46,46),
                })
            } else if (ey.special) {
                Game.assets.textures.getTexture("red1").render({
                    center: en,
                    rotation: rot,
                    size: Vector2D(46,46),
                })
            } else {
                Game.assets.textures.getTexture("blue1").render({
                    center: en,
                    rotation: rot,
                    size: Vector2D(46,46),
                })
            }
            renderer.core.drawLine(Vector2D(en.x-20,en.y-23),Vector2D(en.x-20+(ey.hp/ey.mhp)*40,en.y-23), "green",5);
        }

        for (let i in that.explosions) {
            let r = Math.random()*that.explosions[i].radius;
            let theta = Math.random()*Math.PI*2;
            let rad = that.explosions[i].radius-r;
            let v = Vector2D(that.explosions[i].center.x+Math.cos(theta)*r,that.explosions[i].center.y+Math.sin(theta)*r)
            renderer.core.fillCircle(v, rad, (that.time%3 == 0) ? "yellow" : "red");
            if (Game.game.debug) renderer.core.drawCircle(that.explosions[i].center, that.explosions[i].radius, "white");
        }

        for (let i in that.bullets) {
            that.bullets[i].render();
        }

        let m_x = Placer.iX;
        let m_y = Placer.iY;
        if (i_t != -1 && m_x >= 0 && m_x < 11 && m_y >= 0 && m_y < 11) {
            that.mockTowers[i_t].setPosition(Vector2D(m_x,m_y));
            renderer.tower.renderTower(that.mockTowers[i_t]);
            renderer.core.drawCircle(that.mockTowers[i_t].center, (that.mockTowers[i_t].range+1)*46, "white");
        }

        Game.components.ParticleSystem.render();

        // Render the menu bar

        renderer.core.drawRect(sideBox, "grey");

        renderer.core.drawText(Vector2D(506+46,46*3),`$${that.moolah}`, "lime");

        if (Placer.selected != null && Placer.selected.hasUpgrades()) {
            renderer.core.drawRect(upgradeBox, "yellow");
            renderer.core.drawText(Vector2D(506+46,46*3+30),`Upgrade`, "black", 20);
            renderer.core.drawText(Vector2D(506+46,46*3+55),`$${Placer.selected.upgradeCost()}`, "black", 20);
            if (that.moolah < Placer.selected.upgradeCost()) {
                renderer.core.drawRect(upgradeBox, "rgba(128,128,128,0.5)");
            }
        }

        if (Placer.selected != null) {
            // Power
            renderer.core.drawText(Vector2D(506+46,270),`Power`, "black", 20);
            renderer.core.drawText(Vector2D(506+46,295),`${Placer.selected.power}`, "black", 20);
            renderer.core.drawText(Vector2D(506+46,320),`Speed`, "black", 20);
            renderer.core.drawText(Vector2D(506+46,345),`${Placer.selected.speed}`, "black", 20);

            renderer.core.drawRect(sellBox, "lime");
            renderer.core.drawText(Vector2D(506+46,46*3+80),`Sell`, "black", 20);
            renderer.core.drawText(Vector2D(506+46,46*3+105),`$${Placer.selected.sellCost()}`, "black", 20);
        }

        renderer.core.drawRect(startBox, "green")

        if (components.Levels.playing || that.enemies.length) {
            renderer.core.drawRect(startBox, "rgba(128,128,128,0.5)")
        }

        renderer.core.drawText(Vector2D(506+46,400), `HP: ${that.health}`, "black", 20);
        renderer.core.drawText(Vector2D(506+46,430), `${that.points}`, "black", 20);

        for (let i in that.mockTowers) {
            let _px = 11+i%2;
            let _py = ~~(i/2);

            if (!dbg1) {
                console.log(_px,_py);
            }
            
            that.mockTowers[i].setPosition(Vector2D(_px,_py));
            renderer.tower.renderTower(that.mockTowers[i]);

            if (that.moolah < that.mockTowers[i].cost) {
                renderer.core.drawRect(TowerBoxes[i],"rgba(128,128,128,0.5)");
            }
        }

        dbg1 = true;
    };

    return that;
}(Game.input, Game.components, Game.renderer));
