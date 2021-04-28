let BASIC = 1;
let GORDO = 2;
let FLYIN = 3;

let levels = [
    {
        name: "Level 1",
        entrances: 1,
        waves: [
            {
                delay: 500,
                count: 10,
                entrance: Vector2D(253,-23),
                hp: 5,
                payload: 2,
                speed: 0.08,
                type: Enemy,
            }
        ],
    },
    {
        name: "Level 2",
        entrances: 2,
        waves: [
            {
                delay: 500,
                count: 15,
                entrance: Vector2D(-23,253),
                hp: 5,
                payload: 2,
                speed: 0.1,
                type: Special,
            }
        ],
    },
    {
        name: "Level 3 - Intro Flyers",
        entrances: 2,
        waves: [
            {
                delay: 500,
                count: 15,
                entrance: Vector2D(-23,253),
                hp: 5,
                payload: 2,
                speed: 0.1,
                type: Flyer,
            }
        ],
    },
    {
        name: "Level 4 - Begin",
        entrances: 3,
        waves: [
            {
                delay: 500,
                count: 15,
                entrance: Vector2D(-23,253),
                hp: 10,
                payload: 1,
                speed: 0.1,
                type: Flyer,
            },
            {
                delay: 1000,
                count: 15,
                entrance: Vector2D(253,-23),
                hp: 20,
                payload: 1,
                speed: 0.1,
                type: Flyer,
            }
        ],
    },
    {
        name: "Level 4 - Cash Grab",
        entrances: 2,
        waves: [
            {
                delay: 100,
                count: 150,
                entrance: Vector2D(-23,253),
                hp: 4,
                payload: 5,
                speed: 0.06,
                type: Special,
            },
        ],
    },
    {
        name: "Level 4 - Cash Grab",
        entrances: 1,
        waves: [
            {
                delay: 800,
                count: 20,
                entrance: Vector2D(253,-23),
                hp: 54,
                payload: 2,
                speed: 0.06,
                type: Enemy,
            },
        ],
    },
];

Game.components.Wave = Wave = function(spec) {
    let that = {
        count: spec.count,
        _count: spec.count,
        timer: 0,
        hp: spec.hp,
        payload: spec.payload,
        speed: spec.speed,
        delay: spec.delay,
        active: true,
        type: spec.type,
        enter: spec.entrance,
    }

    that.reset = function() {
        that.count = that._count;
        that.timer = 0;
    }

    that.emit = function() {
        if (that.count == 0) {
            that.active = false;
        } else {
            that.count--;
            Game.model.enemies.push(
                that.type({
                    center: {...that.enter},
                    hp: that.hp,
                    payload: that.payload,
                    speed: that.speed
                })
            );
        }
    };

    that.update = function(elapsedTime) {
        that.timer += elapsedTime;
        if (that.timer >= that.delay) {
            that.timer -= that.delay;

            that.emit();
        }
    };

    return that;
}

Game.components.Level = Level = function(spec) {
    let that = {
        name: spec.name,
        waves: [],
        active: false,
        entrances: spec.entrances,
    }

    for (let i in spec.waves) {
        that.waves.push(Wave(spec.waves[i]));
    }

    that.update = function(elapsedTime) {
        let done = true;
        for (let i in that.waves) {
            if (that.waves[i].active){
                if (done) done = false;
                that.waves[i].update(elapsedTime);
            }
        }
        that.active = !done;
    }

    that.reset = function() {
        that.active = false;
        for (let i in that.waves) {
            that.waves[i].reset();
        }
    }

    return that;
}

Game.components.Levels = function(spec) {
    let that = {
        levels: [],
        playing: false,
        index: -1,
    }

    for (let i in spec) {
        that.levels.push(Level(spec[i]));
    }

    that.startLevel = function() {
        if (!that.level || !that.level.active){
            that.index++;
            that.level = that.levels[that.index];
            that.playing = that.level!=undefined;
        }
    }

    that.update = function(elapsedTime) {
        if (that.playing) {
            that.level.update(elapsedTime);
            if (!that.level.active) {
                that.playing = false;
            }
        }
    }

    that.reset = function() {
        that.index = -1;
        that.playing = false;
        for (let i in that.levels) {
            that.levels[i].reset();
        }
    }

    return that;
}(levels)