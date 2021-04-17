Game.components.Bomb = Bomb = function(spec) {
    let that = {
        center: spec.center,
        time: spec.time,
        defused: false,
        sploded: false,
        index: Math.ceil(spec.time/Game.game.bombTime),

        size: Vector2D(50,50),
        texture: Game.assets.textures.getTexture("bomb"),
    }

    that.checkCollide = function(v) {
        return Vector2D(v.x-that.center.x,v.y-that.center.y).magnitude() < 25;
    }

    that.click = function() {
        if (!that.sploded && !that.defused) {
            that.defused = true;
            Game.components.Score.addScore(that.index);
        }
    }

    that.update = function(elapsedTime) {
        if (!that.defused) {
            that.time -= elapsedTime;
            that.index = Math.ceil(that.time/Game.game.bombTime);
        }

        if (!that.sploded && that.time <= 0) {
            // Do scoring

            that.sploded = true;
            Game.components.ParticleSystem.makeExplosion(200, that.center.x, that.center.y);
            Game.components.Score.addScore(-3);
        }
    }

    that.render = function() {
        let model = {
            center: that.center,
            rotation: 0,
            size: that.size,
        };
        let subModel = {
            center: Vector2D(that.center.x+6,that.center.y+5),
            rotation: 0,
            size: Vector2D(40,40)
        }
        Game.renderer.textures.renderTexture(that.texture, model);
        if (that.defused) {
            Game.renderer.textures.renderTexture(Game.assets.textures.getTexture(`check`), subModel)
        } else if (that.sploded) {
            Game.renderer.textures.renderTexture(Game.assets.textures.getTexture(`explosion`), subModel)
        } else {
            Game.renderer.textures.renderTexture(Game.assets.textures.getTexture(`${that.index}`), subModel)
        }
    }

    return that;
}