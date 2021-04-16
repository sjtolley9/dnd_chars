Game.components.Enemy = Enemy = function(spec) {
    let that = {
        center: spec.center,
        hp: spec.hp,
        payload: spec.payload,
        dir: 3,
        speed: 0.08,
        immune: true,
        mhp: spec.hp,
    }

    that.getMapCoord = function() {
        return Vector2D(Math.floor(that.center.x/46), Math.floor(that.center.y/46));
    }

    that.getMapIndex = function() {
        let m = that.getMapCoord();
        return m.x*11+m.y;
    }
    
    that.src = that.getMapCoord();
    if (that.src.x == 11 && that.src.y == 5) {
        that.dest = 5;
    } else if (that.src.x == 5 && that.src.y == 11) {
        that.dest = 55;
        that.dir = 0;
    } else if (that.src.x == -1 && that.src.y == 5) {
        that.dest = 115;
        that.dir = 1;
    } else if (that.src.x == 5 && that.src.y == -1) {
        that.dest = 65;
        that.dir = 2;
    }

    that.update = function(elapsedTime) {
        if (that.hp == 0) return;
        if (!that.immune && (that.center.x < 0 || that.center.x > 506 || that.center.y < 0 || that.center.y > 506)) {
            // Deliver Payload
            console.log("Kablamo!");
            that.hp = 0;
            return;
        }
        let m = that.getMapCoord();
        if (m.x != that.src.x || m.y != that.src.y) {
            if (that.center.x%46 > 21 && that.center.x %46 < 25 && that.center.y%46 > 21 && that.center.y %46 < 25) {
                that.immune = false;
                let p = that.getMapIndex();
                let d = Game.components.navmesh.A_star(that.dest, p);
        
                //console.log(d-p);
                if (d!=1000) {
                    //console.log(p,d);
                    if (d-p == -1) {
                        that.dir = 0;
                    } else if (d-p == 1) {
                        that.dir = 2;
                    } else if (d-p == 11) {
                        that.dir = 1;
                    } else if (d-p == -11) {
                        that.dir = 3;
                    } else if (d-p == -5) {
                        that.dir = 3;
                    } else if (d-p == -55) {
                        that.dir = 0;
                    } else if (d-p == -65) {
                        that.dir = 2;
                    } else if (d-p == -115) {
                        that.dir = 1;
                    }
                }
            }
        }
        switch (that.dir) {
            case 0:
                that.center.y -= that.speed*elapsedTime;
                break;
            case 2:
                that.center.y += that.speed*elapsedTime;
                break;
            case 1:
                that.center.x += that.speed*elapsedTime;
                break;
            case 3:
                that.center.x -= that.speed*elapsedTime;
                break;
        }
    }

    return that;
}