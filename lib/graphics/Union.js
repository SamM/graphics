(function(scope){
    
    var Union = function(points){
        if(this == scope){
            return new Union(points);
        }
        this.points = Array.isArray(points)?points:points instanceof Point?[points]:[];
    };

    (function(instance){
        instance.spreadBy = function(radius){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.radius += typeof radius == "number" ? radius : 0;
            });
            return this;
        };
        instance.spreadTo = function(radius){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.radius += typeof radius == "number" ? radius : attrs.radius;
            });
            return this;
        };
        instance.moveTo = function(x,y,z){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.x = typeof x == "number" ? x : attrs.x;
                attrs.y = typeof y == "number" ? y : attrs.y;
                attrs.z = typeof z == "number" ? z : attrs.z;
            });
            return this;
        };
        instance.moveBy = function(x,y,z){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.x += typeof x == "number" ? x : 0;
                attrs.y += typeof y == "number" ? y : 0;
                attrs.z += typeof z == "number" ? z : 0;
            });
            return this;
        };
        instance.rotateTo = function(rx,ry,rz){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.rx = typeof rx == "number" ? rx : attrs.rx;
                attrs.ry = typeof ry == "number" ? ry : attrs.ry;
                attrs.rz = typeof rz == "number" ? rz : attrs.rz;
            });
            return this;
        };
        instance.rotateBy = function(rx,ry,rz){

            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.rx += typeof rx == "number" ? rx : 0;
                attrs.ry += typeof ry == "number" ? ry : 0;
                attrs.rz += typeof rz == "number" ? rz : 0;
            });
            return this;
        };
        instance.colorTo = function(r,g,b,a){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.r = typeof r == "number" ? r : attrs.r;
                attrs.g = typeof g == "number" ? g : attrs.g;
                attrs.b = typeof b == "number" ? b : attrs.b;
                attrs.a = typeof a == "number" ? a : attrs.a;
            });
            return this;
        };
        instance.colorBy = function(r,g,b,a){
            this.points.forEach(function(point){
                var attrs = point.attrs;
                attrs.r += typeof r == "number" ? r : 0;
                attrs.g += typeof g == "number" ? g : 0;
                attrs.b += typeof b == "number" ? b : 0;
                attrs.a += typeof a == "number" ? a : 0;
            });
            return this;
        };
        instance.line = function(a){
            var union = this;
            if(a instanceof Point){
                this.points.forEach(function(b){
                    union.world.line(a,b);
                });
            }
            return this;
        };
        instance.triangle = function(a, b){
            var union = this;
            if(a instanceof Point){
                if(b instanceof Point){
                    this.points.forEach(function(c){
                        union.world.triangle(a,b,c);
                    });
                }else{
                    for(var i=0; i<this.points.length; i++){
                        for(var j=i; j<this.points.length; j++){
                            union.world.triangle(a, this.points[i], this.points[j]);
                        }
                    }
                }
            }
            return this;
        };
    })(Union.prototype)

    this.Union = Union;

}).call(this, this);