Game.components.Score = Score = (function() {
    let that  = {
        scores: [],
        current: 0,
        lastScore: 0,
    };

    // Get persisted high scores

    try {
        that.scores = JSON.parse(localStorage["Towers.highScores"]);
    } catch (e) {
        that.scores = [];
    }

    that.getSettings = function() {
        let a = {sell:"s",upgrade:"u",go:"g"};

        try {
            a = JSON.parse(localStorage["Towers.settings"]);
        } catch {
            a = {sell:"s",upgrade:"u",go:"g"};
        }

        console.log(a);

        return {...a};
    }
    
    that.storeSettings = function() {
        localStorage["Towers.settings"] = JSON.stringify(Game.components.KeyboardSetter.settings);
    }

    that.getScore = function() {
        return that.current;
    }

    that.getLastScore = function() {
        return that.lastScore;
    }

    that.gameOver = function(score) {
        that.current = score;
        that.scores.push(that.current);
        that.lastScore = that.current;
        that.current = 0;
        that.scores.sort((a,b)=>b-a);
        that.scores = that.scores.slice(0,5);

        // Persist high scores
        localStorage["Towers.highScores"] = JSON.stringify(that.scores);
    }

    that.clearScores = function() {
        delete localStorage["Towers.highScores"];
        delete localStorage["Towers.settings"];
        that.scores = [];
    }

    return that;
}());