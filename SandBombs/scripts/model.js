Game.model = (function(input, components, renderer){
    // Define inputs

    //let c = document.getElementById("canvas").getContext("2d");

    let COUNTDOWN = 0;
    let GAMEPLAY = 1;
    let GAMEOVER = 2;
    let GAMEDONE = 3;

    let that = {
        time: 0,
        model: Model(Vector2D(540/2,411/2),0,Vector2D(540,411)),
        mouse: input.Mouse(),
        mouseCapture: false,
        bombs: [],
        mode: COUNTDOWN,
        countdown: 3000,
    };

    let db1 = DrawBag([3,3,2,2,1,1]);

    that.startLevel = that.startLevel1 = function() {
        db1.reset();
        that.bombs = [];
        for (let i = 0; i < 3; i++) {
            let time = db1.draw()*Game.game.bombTime;
            let tim2 = db1.draw()*Game.game.bombTime;
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,200),
                time: time
            }))
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,250),
                time: tim2
            }))
        }
        that.startLevel = that.startLevel2;
    }

    that.startLevel2 = function() {
        db1.reset();
        that.bombs = [];
        db1.add(4);
        db1.add(3);
        db1.add(2);
        for (let i = 0; i < 3; i++) {
            let time = db1.draw()*Game.game.bombTime;
            let tim2 = db1.draw()*Game.game.bombTime;
            let tim3 = db1.draw()*Game.game.bombTime;
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,200),
                time: time
            }));
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,250),
                time: tim2
            }));
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,300),
                time: tim3
            }));
        }

        that.startLevel = that.startLevel3;
    }



    that.startLevel3 = function() {
        db1.reset();
        that.bombs = [];
        db1.add(5);
        db1.add(4);
        db1.add(3);
        for (let i = 0; i < 4; i++) {
            let time = db1.draw()*Game.game.bombTime;
            let tim2 = db1.draw()*Game.game.bombTime;
            let tim3 = db1.draw()*Game.game.bombTime;
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,200),
                time: time
            }));
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,250),
                time: tim2
            }));
            that.bombs.push(Bomb({
                center: Vector2D(200+50*i,300),
                time: tim3
            }));
        }

        that.startLevel = null;
    }

    /*if (Game.components.navmesh.addObstacle(0,4)) {
        that.towers.push(RandomTower({position: Vector2D(0,4)}));
    }

    if (Game.components.navmesh.addObstacle(1,5)) {
        that.towers.push(NeutronSpewer({position: Vector2D(1,5)}));
    }*/

    that.initialize = function() {
        // Reset Game/Maybe load save?

        that.mouse.register('mousedown', function(e, elapsedTime){
            
            // -----
            if (that.mode == GAMEPLAY){
                for (let i in that.bombs) {
                    if (that.bombs[i].checkCollide(Vector2D(e.offsetX,e.offsetY))) {
                        that.bombs[i].click();
                    }
                }
            }
        });

        that.startLevel1();
    };

    that.processInput = function(elapsedTime) {
        // Process input
        that.mouse.update(elapsedTime);
    };
    that.update = function(elapsedTime) {
        Game.components.ParticleSystem.update(elapsedTime);

        if (that.mode == GAMEPLAY) {
            that.time += elapsedTime;
            let n = 0;
            let m = 0;
            for (let i in that.bombs) {
                that.bombs[i].update(elapsedTime);
                n += that.bombs[i].defused;
                m += that.bombs[i].sploded;
            }
            //console.log(n);
            if (n == that.bombs.length) {
                if (that.startLevel !== null) {
                    that.startLevel();
                    that.mode = COUNTDOWN;
                    that.countdown = 3000;
                } else {
                    that.mode = GAMEDONE;
                    Game.components.Score.gameOver(that.time);
                }
            } else if (n+m == that.bombs.length) {
                that.mode = GAMEOVER;
                Game.components.Score.gameOver(null);
            }
        } else if (that.mode == COUNTDOWN) {
            that.countdown -= elapsedTime;
            if (that.countdown <= 0) {
                that.countdown = 3000;
                that.mode = GAMEPLAY;
            }
        }
    };

    that.render = function() {
        renderer.core.clear();
        renderer.textures.renderTexture(Game.assets.textures.getTexture("bg"),that.model);

        for (let i in that.bombs) {
            that.bombs[i].render();
        }

        if (that.mode == COUNTDOWN || that.mode == GAMEPLAY) {
            renderer.core.drawText(Vector2D(180,370),`Score: ${Score.getScore()}`,"black")
            renderer.core.drawText(Vector2D(360,370),`Time: ${Math.trunc(that.time/10)/100}s`,"black")
        }

        if (that.mode == COUNTDOWN) {
            renderer.core.drawHeadline(`Starting in ${Math.ceil(that.countdown/1000)}!`,0)
        }

        if (that.mode == GAMEDONE) {
            renderer.core.drawHeadline(`You Win!`,0)
            renderer.core.drawHeadline(`You Scored: ${Game.components.Score.getLastScore()}`,1)
        }

        if (that.mode == GAMEOVER) {
            renderer.core.drawHeadline(`Game Over`,0)
            renderer.core.drawHeadline(`You Scored: ${Game.components.Score.getLastScore()}`,1)
        }

        components.ParticleSystem.render();
    };

    return that;
}(Game.input, Game.components, Game.renderer));
