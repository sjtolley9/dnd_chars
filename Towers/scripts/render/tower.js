Game.renderer.tower = function(renderer) {
    let turret_base = Game.assets.textures.getTexture("turret_base");

    function renderTower(tower) {
        let model = {
            center: tower.center,
            rotation: 0,
            size: Vector2D(46,46)
        }
        renderer.textures.renderTexture(turret_base, model);
        model.rotation = tower.rotation+Math.PI/2;
        if (tower.texture !== -1) {
            renderer.textures.renderTexture(tower.texture, model);
        }
        if (Game.game.debug) {
            renderer.core.drawLine(tower.center,tower.target,"red");
        }
        if (Game.game.debug || tower.selected) {
            renderer.core.drawCircle(tower.center, (tower.range+1)*46, "green");
        }
    }

    return {
        renderTower,
    }
}(Game.renderer);