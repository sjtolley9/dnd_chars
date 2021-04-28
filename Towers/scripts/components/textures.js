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
};

Game.renderer.AnimatedTexture = AnimatedTexture = function(spec) {
    let that = {
        animationTime: 0,
        subImageIndex: 0,
        subTextureWidth: 0,
        image: new Image(),
        isReady: false,
    };

    that.image.onload = function() {
        console.log("Loaded :" + that.image.src)
        that.isReady = true;
        that.subTextureWidth = that.image.width / spec.spriteCount;
    }
    that.image.src = spec.spriteSheet;

    that.update = function(elapsedTime) {
        that.animationTime += elapsedTime;

        if (that.animationTime >= spec.spriteTime[that.subImageIndex]) {
            that.animationTime -= spec.spriteTime[that.subImageIndex];
            that.subImageIndex += 1;
            
            that.subImageIndex = that.subImageIndex % spec.spriteCount;
        }
    }

    that.render = function(model) {
        if (that.isReady) {
            Game.renderer.core.drawSubTexture(
                that.image,
                that.subImageIndex,
                that.subTextureWidth,
                model.center,
                model.rotation,
                model.size
            )
        };
    }

    return that;
};