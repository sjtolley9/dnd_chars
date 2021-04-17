Game.components.TextureBank = TextureBank = function() {
    let that = {
        textures: {},
    }

    that.loadTexture = function(name, path) {
        that.textures[name] = Game.renderer.Texture({src:path});
    }

    that.loadAnimatedTexture = function(name, path, spriteCount, spriteTime=null) {
        that.textures[name] = AnimatedTexture(
            {
                spriteSheet: path,
                spriteCount: spriteCount,
                spriteTime: spriteTime,
            }
        );
    }

    that.getTexture = function(name) {
        return that.textures[name];
    }

    return that;
}

Game.assets.textures = TextureBank();

Game.assets.textures.loadAnimatedTexture("bird", "assets/spritesheet-bird.png", 14,
[40,40,40,40,40,40,40,40,40,40,40,40,40,40]);

Game.assets.textures.loadTexture("bg", "assets/Background.png")
Game.assets.textures.loadTexture("bomb", "assets/Bomb.png");
Game.assets.textures.loadTexture("check", "assets/checkmark.png");
Game.assets.textures.loadTexture("explosion", "assets/Explosion.png");
Game.assets.textures.loadTexture("1", "assets/glass_numbers_1.png");
Game.assets.textures.loadTexture("2", "assets/glass_numbers_2.png");
Game.assets.textures.loadTexture("3", "assets/glass_numbers_3.png");
Game.assets.textures.loadTexture("4", "assets/glass_numbers_4.png");
Game.assets.textures.loadTexture("5", "assets/glass_numbers_5.png");
Game.assets.textures.loadTexture("6", "assets/glass_numbers_6.png");
Game.assets.textures.loadTexture("7", "assets/glass_numbers_7.png");
Game.assets.textures.loadTexture("8", "assets/glass_numbers_8.png");
Game.assets.textures.loadTexture("9", "assets/glass_numbers_9.png");