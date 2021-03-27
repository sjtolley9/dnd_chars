class Sound {
    constructor(url) {
        this.sound = new Audio(url);
    }

    play() {
        this.sound.play();
    }

    pause() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }
}

Game.objects.sounds = {
    thrust: new Sound("thrust.wav"),
    explosion: new Sound("explosion.wav"),
    landed: new Sound("landed.wav"),
    flip: new Sound("flip.wav"),
}