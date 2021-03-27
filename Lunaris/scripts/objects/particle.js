/*
 particle.js
 Is very good particle system. Is making the particles
*/
let spareRandom = null;
function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomScaled(mean, stddev)
{
	var r = normalRandom();

	r = r * stddev + mean;

	return r;
}

Game.objects.ParticleSystem = (function() {
    class Particle {
        constructor(x,y,r,v,id, life=45) {
            this.pos = {x: x, y: y}
            this.vel = v;
            this.r = r;
            this.id = id;
            this.life = life+Math.random()*120;
        }

        render(graphics,texture) {
            graphics.drawTexture({center: this.pos, rotation: this.r, drawRadius: 5, texture: texture});
        }

        update(elapsedTime) {
            this.life -= elapsedTime;
            this.pos.x += elapsedTime*this.vel.x;
            this.pos.y += elapsedTime*this.vel.y;
        }
    }

    let that = {
        _particles: [],
        _textures: {},
    }

    that._textures["fire1"] = Game.objects.Texture({imageSrc:"fire1.png"});
    that._textures["fire2"] = Game.objects.Texture({imageSrc:"fire2.png"});
    that._textures["smoke"] = Game.objects.Texture({imageSrc:"smoke.png"});
    that._textures["landed"] = Game.objects.Texture({imageSrc:"landed.png"});
    that._textures["flip1"] = Game.objects.Texture({imageSrc:"flip1.png"});

    that.makeFire = function(n,x,y,r) {
        for (let i = 0; i < n; i++) {
            let nr = r + (normalRandom())/4+Math.PI*2;
            let speed = normalRandomScaled(1,0.1);
            let v = {x: speed*Math.cos(nr), y: speed*Math.sin(nr)};
            let r2 = Math.random()*Math.PI*2;
            let id = (Math.random()>0.4) ? "fire1" : "fire2";
            that._particles.push(new Particle(x,y,r2,v,id));
        }
    };

    that.makeExplosion = function(n,x,y) {
        for (let i = 0; i < n; i++) {
            let r = Math.random()*Math.PI*2;
            let speed = normalRandom()/5;
            let v = {x: speed*Math.cos(r), y: speed*Math.sin(r)};
            let id = (Math.random() > 0.45) ? ((Math.random()>0.4) ? "fire1" : "fire2") : "smoke";
            that._particles.push(new Particle(x,y,r,v,id, 240));
        }
    }

    that.makeLanded = function(n,x,y) {
        y = y+15;
        for (let i = 0; i < n; i++) {
            let x1 = x+(-0.5+Math.random())*30;
            let v = {x:(-0.5+Math.random())*0.2, y: -Math.random()*0.3};
            let r = Math.random()*Math.PI;
            let part = new Particle(x1,y,r,v,"landed",240);
            part.wait = 50+Math.random()*20;
            part.update = function(elapsedTime) {
                this.life -= elapsedTime;
                this.pos.x += elapsedTime*this.vel.x;
                this.pos.y += elapsedTime*this.vel.y;
                if (this.wait > 0){
                    part.wait -= elapsedTime;
                } else {
                    this.vel.y += elapsedTime*0.001/2;
                }
            };

            that._particles.push(part);
        }
    }

    that.makeFlip = function(x,y) {
        for (let i = 0; i < 200; i++) {
            let r = Math.random()*Math.PI*2;
            let speed = Math.abs(normalRandom()/15);
            let v = {x: speed*Math.cos(r), y: speed*Math.sin(r)};
            let part = new Particle(x+15*Math.cos(r),y+15*Math.sin(r),r,v,"flip1",500);
            part.update = function(elapsedTime) {
                this.life -= elapsedTime;
                this.pos.x += elapsedTime*this.vel.x;
                this.pos.y += elapsedTime*this.vel.y;
                this.r += elapsedTime*this.vel.x;
            }
            that._particles.push(part);
        }
    }

    that.update = function(elapsedTime) {
        let new_parts = [];
        for (i in that._particles) {
            that._particles[i].update(elapsedTime);
            if (that._particles[i].life > 0) {
                new_parts.push(that._particles[i]);
            }
        }

        that._particles = new_parts;
    };

    that.render = function(graphics) {
        for (i in that._particles) {
            that._particles[i].render(graphics,that._textures[that._particles[i].id]);
        }
    };

    return that;
}())