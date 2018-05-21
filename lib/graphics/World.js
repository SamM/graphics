(function(scope){

    var Flatten = function(){
        function flatten(array){
            var flat = [];
            for(var i=0; i<array.length; i++){
                if(Array.isArray(array[i])){
                    flat = flat.concat(flatten(array[i]));
                }else{
                    flat.push(array[i]);
                }
            }
            return flat;
        }
        return flatten(Array.prototype.slice.call(arguments));
    };

    var World = function(){
        if(this == scope){
            return new World(Flatten.apply(this, arguments));
        }
        var world = this;

        this.points = [];
        this.lines = [];
        this.triangles = [];
        this.unions = [];

        var points = Flatten.apply(this, arguments);
        points.forEach(function(point){
            world.welcome(point);
        });

    };

    World.prototype.welcome = function(){
        var world = this;
        function welcome(args){
            args.forEach(function(arg){
                if(Array.isArray(arg)) welcome(arg);
                else if(arg instanceof Point && !world.has(arg)){
                    arg.world = world;
                    world.points.push(arg);
                }
            })
        }
        welcome(Flatten.apply(this, arguments));
        return this;
    }

    World.prototype.hasPoint = function(point){
        var world = this;
        function has(args){
            var point;
            for(var i=0; i<args.length; i++){
                point = args[i];
                if(point instanceof Point){
                    if(world.points.indexOf(point) < 0) return false;
                }
            }
            return true;
        }
        return has(Flatten.apply(this, arguments));
    };

    World.prototype.has = World.prototype.hasPoint;

    World.prototype.hasLine = function(point){
        var world = this;
        function has(args){
            var point, found;
            if(args.length == 2){
                for(var i=0; i<world.lines.length; i++){
                    if(world.lines[i].indexOf(args[0])>-1&&world.lines[i].indexOf(args[2])>-1) return true;
                }
                return false;
            }else if(args.length > 2){
                for(var i=0; i<args.length-1; i+=2){
                    if(!has(args[i], args[i+1])) return false;
                }
                return true;
            }
            return false;
        }
        return has(Flatten.apply(this, arguments));
    };

    World.prototype.hasTriangle = function(point){
        var world = this;
        function has(args){
            var point, found;
            if(args.length == 3){
                for(var i=0; i<world.triangles.length; i++){
                    if(world.triangles[i].indexOf(args[0])>-1&&world.triangles[i].indexOf(args[1])>-1&&world.triangles[i].indexOf(args[2])>-1) return true;
                }
                return false;
            }else if(args.length > 3){
                for(var i=0; i<args.length-2; i+=3){
                    if(!has(args[i], args[i+1], args[i+2])) return false;
                }
                return true;
            }
            return false;
        }
        return has(Flatten.apply(this, arguments));
    };

    World.prototype.line = function(){
        var world = this;
        function line(points, dontWelcome){
            if(points.length == 2){
                if(points[0] instanceof Point && points[1] instanceof Point){
                    if(!dontWelcome){
                        world.welcome(points[0]);
                        world.welcome(points[1]);
                    }
                    if(!world.hasLine(points[0], points[1])){
                        world.lines.push([points[0], points[1]]);
                    }
                }
            }else if(points.length>2){
                for(var i=0; i<points.length-1; i++){
                    if(!dontWelcome){
                        world.welcome(points[i]);
                    }
                    line([points[i], points[i+1]], true);
                }
            }
        }
        line(Flatten.apply(this, arguments));
        return this;
    };

    World.prototype.triangle = function(){
        var world = this;
        function triangle(points, dontWelcome){
            if(points.length == 3){
                if(points[0] instanceof Point && points[1] instanceof Point){
                    if(!dontWelcome){
                        world.welcome(points[0]);
                        world.welcome(points[1]);
                        world.welcome(points[2]);
                    }
                    if(!world.hasTriangle(points[0], points[1])){
                        world.triangles.push([points[0], points[1], points[2]]);
                    }
                }
            }else if(points.length>3){
                for(var i=0; i<points.length-2; i+=3){
                    if(!dontWelcome){
                        world.welcome(points[i]);
                        world.welcome(points[i+1]);
                        world.welcome(points[i+2]);
                    }
                    triangle([points[i], points[i+1], points[i+2]], true);
                }
            }
        }
        triangle(Flatten.apply(this, arguments));
        return this;
    };

    World.prototype.unite = function(){
        var world = this;
        var points = Flatten.apply(this, arguments);
        var unions = [];
        var united = [];
        var joined;
        for(var i = 0; i<world.unions.length; i++){
            joined = false;
            for(var p = 0; p<points.length && !joined; p++){
                if(points[p] instanceof Point && world.unions[i].indexOf(points[p]) > -1){
                    united = united.concat(world.unions[i]);
                    joined = true;
                }
            }
            if(!joined){
                unions.push(world.unions[i]);
            }
        }
        for(var p = 0; p<points.length; p++){
            if(points[p] instanceof Point){
                points[p].united = true;
                if(united.indexOf(points[p]) <0){
                    united.push(points[p]);
                    world.welcome(points[p]);
                }
            }
        }
        unions.push(united);
        world.unions = unions;
        return this;
    };

    World.prototype.union = function(point){
        var world = this;
        if(point instanceof Point){
            for(var i=0; i<world.unions.length; i++){
                if(world.unions[i].indexOf(point)>-1) return typeof Union == "function" ? Union(world.unions[i]):world.unions[i];
            }
        }
        return null;
    };

    World.prototype.united = function(point){
        return !!this.union(point);
    };

    World.prototype.render = function(offset){
        var points = [];
        this.points.forEach(function(point){
            points.push(point.render(offset))
        });
        return Flatten(points);
    };

    this.World = World;

    if(typeof Point != "function" && typeof this.require == "function"){
        this.require('graphics/Point.js');
    }

}).call(this, this);