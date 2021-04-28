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

Game.components.ParticleSystem = (function() {
    class Particle {
        constructor(x,y,r,v,id, life=45, size=25) {
            this.pos = {x: x, y: y}
            this.vel = v;
            this.r = r;
            this.id = id;
            this.life = life+Math.random()*120;
            this.size = Vector2D(size, size)
        }

        render(texture) {
            //graphics.drawTexture({center: this.pos, rotation: this.r, drawRadius: 5, texture: texture});
            Game.renderer.textures.renderTexture(texture, {center: this.pos, rotation: this.r, size: this.size});
        }

        update(elapsedTime) {
            this.life -= elapsedTime;
            this.pos.x += elapsedTime*this.vel.x;
            this.pos.y += elapsedTime*this.vel.y;
            this.r += elapsedTime*this.vel.r;
        }
    }

    let that = {
        _particles: [],
    }

    that.reset = function() {
        that._particles.length = 0;
    }

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
            let v = {x: speed*Math.cos(r), y: speed*Math.sin(r), r: normalRandom()*0.01};
            let id = "coin";
            that._particles.push(new Particle(x,y,r,v,id, 1000));
        }
        //console.log(that._particles);
    }

    that.makeTrail = function(n,x,y) {
        for (let i = 0; i < n; i++) {
            let r = Math.random()*Math.PI*2;
            let speed = normalRandom()/100;
            let v = {x: speed*Math.cos(r), y: speed*Math.sin(r), r: normalRandom()*0.01};
            let id = "coin";
            that._particles.push(new Particle(x,y,r,v,id, 500, 2));
        }
        //console.log(that._particles);
    }

    that.makeTrail2 = function(n,x,y) {
        for (let i = 0; i < n; i++) {
            let r = Math.random()*Math.PI*2;
            let speed = normalRandom()/500;
            let v = {x: speed*Math.cos(r), y: speed*Math.sin(r), r: normalRandom()*0.01};
            let id = "coin";
            that._particles.push(new Particle(x,y,r,v,id, 500, 1));
        }
        //console.log(that._particles);
    }

    that.makeCashMoney = function(x,y,n=1) {
        let r = 0;
        let speed = -0.03;
        let v = {x: 0, y: speed};
        let cash = new Particle(x,y,r,v,"$"+n, 1000);

        cash.render = function(a) {
            //Game.renderer.core.drawPoint(this.pos, "blue");
            Game.renderer.core.drawText(this.pos, cash.id, "lime");
        }

        that._particles.push(cash);
    }

    that.makeNegCashMoney = function(x,y,n=1) {
        let r = 0;
        let speed = -0.03;
        let v = {x: 0, y: speed};
        let cash = new Particle(x,y,r,v,"-$"+n, 1000);

        cash.render = function(a) {
            //Game.renderer.core.drawPoint(this.pos, "blue");
            Game.renderer.core.drawText(this.pos, cash.id, "red");
        }

        that._particles.push(cash);
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

    that.render = function() {
        //if (that._particles.length > 0) console.log(that._particles.length);
        for (i in that._particles) {
            that._particles[i].render(Game.assets.textures.getTexture(that._particles[i].id));
        }
    };

    return that;
}())