/*
Binary Heap Implementation by Marjin Haverbeke
https://eloquentjavascript.net/1st_edition/appendix2.html
Licensed Under : Creative Commons Attribution BY 3.0
*/
function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
  }
  
  BinaryHeap.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
      // Allow it to bubble up.
      this.bubbleUp(this.content.length - 1);
    },
  
    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it sink down.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },
  
    remove: function(node) {
      var length = this.content.length;
      // To remove a value, we must search through the array to find
      // it.
      for (var i = 0; i < length; i++) {
        if (this.content[i] != node) continue;
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        // If the element we popped was the one we needed to remove,
        // we're done.
        if (i == length - 1) break;
        // Otherwise, we replace the removed element with the popped
        // one, and allow it to float up or sink down as appropriate.
        this.content[i] = end;
        this.bubbleUp(i);
        this.sinkDown(i);
        break;
      }
    },
  
    size: function() {
      return this.content.length;
    },
  
    bubbleUp: function(n) {
      // Fetch the element that has to be moved.
      var element = this.content[n], score = this.scoreFunction(element);
      // When at 0, an element can not go up any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
        parent = this.content[parentN];
        // If the parent has a lesser score, things are in order and we
        // are done.
        if (score >= this.scoreFunction(parent))
          break;
  
        // Otherwise, swap the parent with the current element and
        // continue.
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
    },
  
    sinkDown: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);
  
      while(true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2, child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore)
            swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score))
            swap = child2N;
        }
  
        // No need to swap further, we are done.
        if (swap == null) break;
  
        // Otherwise, swap and continue.
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
    }
  };


Game.components.navmesh = (function() {
    let that = {
        dirty: true,
    };

    that.initialize = function() {
        that.edges = [];
        that.mesh = [];
        for (let i = 0; i < 121; i++) {
            that.mesh[i] = {blocked: false};
            let x = ~~(i/11);
            let y = i%11;
            if (x > 0) {
                that.edges.push([i,i-11]);
            }
            if (y > 0) {
                that.edges.push([i,i-1])
            }
        }

        that.processData();

        let a = performance.now();
        for (let i = 0; i < 121; i++) {
            that.A_star(i,0);
        }
        let b = performance.now();
        console.log("Done",b-a);
    }

    that.processData = async function() {
        that.next = new Array(121).fill(0).map(() => new Array(121).fill(null));
        that.dist = new Array(121).fill(0).map(() => new Array(121).fill(1000));
        for (edge in that.edges) {
            let u = that.edges[edge][0];
            let v = that.edges[edge][1];

            if (!that.mesh[v].blocked){
                that.dist[u][v] = 1;
                that.next[u][v] = v;
            }

            if (!that.mesh[u].blocked) {
                that.dist[v][u] = 1;
                that.next[v][u] = u;
            }
        }

        for (vertex in that.mesh) {
            let v = vertex;
            that.dist[v][v] = 0;
            that.next[v][v] = v;
        }

        for (k in that.mesh) {
            if (that.mesh[k].blocked) continue;
            for (i in that.mesh) {
                if (that.mesh[i].blocked || that.dist[i][k]==1000) continue;
                for (j in that.mesh) {
                    if (that.mesh[j].blocked || that.dist[j][k]==1000) continue;
                    if (that.dist[i][j] > that.dist[i][k] + that.dist[k][j]) {
                        that.dist[i][j] = that.dist[i][k] + that.dist[k][j];
                        that.next[i][j] = that.next[i][k];
                    }
                }
            }
        }
        that.dirty = false;
    }

    that.getColor = function(x,y,xo=0,yo=0) {
        let v = x*11+y;
        let s = xo*11+yo;
        return that.dist[s][v];
    }

    that.getAllColor = function(x,y) {
        let v = x*11+y;
        return Math.min(that.dist[5][v],that.dist[55][v],that.dist[65][v],that.dist[115][v]);
    }

    that.getNext = function(x,y,dx=0,dy=0) {
        let v = x*11+y;
        let d = dx*11+dy;
        return that.next[v][d];
    }

    that.addObstacle = function(x,y) {
        let v = x*11+y;
        if (x < 0 || x > 10 || y < 0 || y > 10) return false;

        if (v == 5 || v == 55 || v == 65 || v == 115 || that.mesh[v].blocked) {
            return false;
        }

        that.mesh[v].blocked = true;

        if (that.A_star(5,115) == 1000 || that.A_star(55,65) == 1000) {
            that.mesh[v].blocked = false;
            return false;
        }

        that.dirty = true;
        return true;
    }

    that.A_star = function(start,goal) {
        if (that.mesh[goal].blocked || that.mesh[start].blocked) {
            return 1000;
        }
        let a = performance.now();
        let frontier = new BinaryHeap(function(x){return x.dist;});
        frontier.push({v: start, dist: 0});
        let came_from = new Array(121).fill(null);
        let go_to = new Array(121).fill(null);
        let cost_so_far = new Array(121).fill(1000);
        cost_so_far[start] = 0;

        while (frontier.size() != 0) {
            let current = frontier.pop().v;

            if (current == goal) {
                let b = performance.now();

                if (cost_so_far[goal] == 0) {
                    return 0;
                }
                
                return came_from[goal];
            }

            let neighbors = that.getNeighbors(current);

            for (let i in neighbors) {
                let next = neighbors[i];
                new_cost = cost_so_far[current] + 1;
                if (cost_so_far[next] == 1000 || new_cost < cost_so_far[next]) {
                    cost_so_far[next] = new_cost;
                    let priority = new_cost + 1;
                    frontier.push({v: next, dist: priority});
                    came_from[next] = current;
                    go_to[current] = next;
                }
            }

        }

        //console.log(cost_so_far[goal]);

        return 1000;
    }

    that.getNeighbors = function(v) {
        let x = ~~(v/11);
        let y = v%11;
        let result = [];

        if (x > 0 && !that.mesh[v-11].blocked) {
            result.push(v-11);
        }

        if (x < 10 && !that.mesh[v+11].blocked) {
            result.push(v+11);
        }

        if (y > 0 && !that.mesh[v-1].blocked) {
            result.push(v-1);
        }

        if (y < 10 && !that.mesh[v+1].blocked) {
            result.push(v+1);
        }

        return result;
    }

    that.removeObstacle = function(x,y) {
        if (x < 0 || x > 10 || y < 0 || y > 10) return false;
        
        let v = x*11+y;
        that.mesh[v].blocked = false;
    }

    return that;
}());