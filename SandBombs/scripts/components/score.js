Game.components.Score = Score = (function() {
    let that  = {
        scores: [],
        times: [],
        current: 0,
        lastScore: 0,
        gameTime: 0,
    };

    // Get persisted high scores

    try {
        that.scores = JSON.parse(localStorage["Midterm.highScores"]);
    } catch (e) {
        that.scores = [];
    }

    try {
        that.times = JSON.parse(localStorage["Midterm.times"]);
    } catch (e) {
        that.times = [];
    }


    that.addScore = function(n) {
        that.current += n;
        that.current = Math.max(0,that.current);
    }

    that.getScore = function() {
        return that.current;
    }

    that.getLastScore = function() {
        return that.lastScore;
    }

    that.gameOver = function(time) {
        console.log(that.current);
        that.scores.push(that.current);
        that.lastScore = that.current;
        that.current = 0;
        that.scores.sort((a,b)=>b-a);
        that.scores = that.scores.slice(0,5);

        if (time != null) {
            time = Math.trunc(time/10)/100;
            that.times.push(time);
            that.times.sort((a,b)=>a-b);
            that.times = that.times.slice(0,5);
            localStorage["Midterm.times"] = JSON.stringify(that.times);
        }

        // Persist high scores
        localStorage["Midterm.highScores"] = JSON.stringify(that.scores);
    }

    that.clearScores = function() {
        delete localStorage["Midterm.highScores"];
        delete localStorage["Midterm.times"];
        that.scores = [];
        that.times = [];
    }

    return that;
}());