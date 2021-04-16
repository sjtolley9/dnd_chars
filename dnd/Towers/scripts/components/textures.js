Game.renderer.Texture = Texture = function(spec) {
    let that = {
        image: new Image(),
        isReady: false,
    };

    that.image.onload = function() {
        that.isReady = true;
        console.log("Loaded: " + spec.src);
    }
    that.image.src = spec.src;

    return that;
}