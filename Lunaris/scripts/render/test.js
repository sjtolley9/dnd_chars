Game.render.Test = (function(graphics) {
    function render(spec) {
        graphics.drawTexture(spec);
        graphics.drawTexture(spec);
    }

    return {render}
}(Game.graphics))