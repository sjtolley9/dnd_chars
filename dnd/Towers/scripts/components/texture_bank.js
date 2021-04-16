Game.components.TextureBank = TextureBank = function() {
    let that = {
        textures: {},
    }

    that.loadTexture = function(name, path) {
        that.textures[name] = Game.renderer.Texture({src:path});
    }

    that.getTexture = function(name) {
        return that.textures[name];
    }

    return that;
}

Game.assets.textures = TextureBank();
// Turret Base
Game.assets.textures.loadTexture("turret_base", "images/tower-defense-turrets/turret-base.gif");
// Turret Type 1
Game.assets.textures.loadTexture("turret11", "images/tower-defense-turrets/turret-1-1.png");
Game.assets.textures.loadTexture("turret12", "images/tower-defense-turrets/turret-1-2.png");
Game.assets.textures.loadTexture("turret13", "images/tower-defense-turrets/turret-1-3.png");
// Turret Type 2
Game.assets.textures.loadTexture("turret21", "images/tower-defense-turrets/turret-2-1.png");
Game.assets.textures.loadTexture("turret22", "images/tower-defense-turrets/turret-2-2.png");
Game.assets.textures.loadTexture("turret23", "images/tower-defense-turrets/turret-2-3.png");
// Turret Type 3
Game.assets.textures.loadTexture("turret31", "images/tower-defense-turrets/turret-3-1.png");
Game.assets.textures.loadTexture("turret32", "images/tower-defense-turrets/turret-3-2.png");
Game.assets.textures.loadTexture("turret33", "images/tower-defense-turrets/turret-3-3.png");
// Turret Type 4
Game.assets.textures.loadTexture("turret41", "images/tower-defense-turrets/turret-4-1.png");
Game.assets.textures.loadTexture("turret42", "images/tower-defense-turrets/turret-4-2.png");
Game.assets.textures.loadTexture("turret43", "images/tower-defense-turrets/turret-4-3.png");
// Turret Type 5
Game.assets.textures.loadTexture("turret51", "images/tower-defense-turrets/turret-5-1.png");
Game.assets.textures.loadTexture("turret52", "images/tower-defense-turrets/turret-5-2.png");
Game.assets.textures.loadTexture("turret53", "images/tower-defense-turrets/turret-5-3.png");
// Turret Type 6
Game.assets.textures.loadTexture("turret61", "images/tower-defense-turrets/turret-6-1.png");
Game.assets.textures.loadTexture("turret62", "images/tower-defense-turrets/turret-6-2.png");
Game.assets.textures.loadTexture("turret63", "images/tower-defense-turrets/turret-6-3.png");
// Turret Type 7
Game.assets.textures.loadTexture("turret71", "images/tower-defense-turrets/turret-7-1.png");
Game.assets.textures.loadTexture("turret72", "images/tower-defense-turrets/turret-7-2.png");
Game.assets.textures.loadTexture("turret73", "images/tower-defense-turrets/turret-7-3.png");