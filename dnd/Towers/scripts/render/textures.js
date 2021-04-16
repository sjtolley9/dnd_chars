Game.renderer.textures = (function(renderer) {
    function renderTexture(texture, model) {
        if (texture.isReady) {
            renderer.core.drawTexture(
                texture.image,
                model.center,
                model.rotation,
                model.size
                );
        }
    }

    function renderAnimatedTexture(texture, model) {

    }

    return {
        renderTexture,
        renderAnimatedTexture,
    }
}(Game.renderer))