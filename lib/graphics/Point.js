(function(scope){

    var Point = function(attrs, world){
        if(this == scope){
            return new Point(attrs, world);
        }

        this.attrs = typeof attrs == "object" ? attrs : typeof this.attrs=="object"?this.attrs:{};
    
        this.attrs.radius = typeof this.attrs.radius == "number"? this.attrs.radius : 1;
    
        this.attrs.x = typeof this.attrs.x == "number"? this.attrs.x : 0;
        this.attrs.y = typeof this.attrs.y == "number"? this.attrs.y : 0;
        this.attrs.z = typeof this.attrs.z == "number"? this.attrs.z : 0;
    
        this.attrs.r = typeof this.attrs.r == "number"? this.attrs.r : 0;
        this.attrs.g = typeof this.attrs.g == "number"? this.attrs.g : 0;
        this.attrs.b = typeof this.attrs.b == "number"? this.attrs.b : 0;
        this.attrs.a = typeof this.attrs.a == "number"? this.attrs.a : 1;
    
        this.attrs.rx = typeof this.attrs.rx == "number"? this.attrs.rx : 0;
        this.attrs.ry = typeof this.attrs.ry == "number"? this.attrs.ry : 0;
        this.attrs.rz = typeof this.attrs.rz == "number"? this.attrs.rz : 0;
    
        this.attrs.sx = typeof this.attrs.sx == "number"? this.attrs.sx : 1;
        this.attrs.sy = typeof this.attrs.sy == "number"? this.attrs.sy : 1;
        this.attrs.sz = typeof this.attrs.sz == "number"? this.attrs.sz : 1;
    
        this.world = world instanceof World ? world : new World();
        this.world.welcome(this);
        this.united = this.world.united(this);
    };

    (function(instance){
        instance.getAttrs = function(parent){
            parent = typeof parent == "object"? typeof parent.attrs == "object" ? parent.attrs : parent : {};
            var attrs = {};
            for(var attr in parent){
                attrs[attr] = parent[attr];
            }
            var value;
            for(var attr in this.attrs){
                value = this.attrs[attr];
                
                if(typeof value == "string"){
                    if(value[0] == "+"){
                        attrs[attr] = parseFloat(attrs[attr]||0) + parseFloat(value.slice(1));
                    }else if(value[0] == "-"){
                        attrs[attr] = parseFloat(attrs[attr]||0) - parseFloat(value.slice(1));
                    }else if(value[0] == "*"){
                        attrs[attr] = parseFloat(attrs[attr]||0) * parseFloat(value.slice(1));
                    }else if(value[0] == "/"){
                        attrs[attr] = parseFloat(attrs[attr]||0) / parseFloat(value.slice(1));
                    }else{
                        attrs[attr] = value;
                    }
                }else if(attr == "radius"){
                    attrs[attr] = value;
                }else if(attr == "sx"||attr == "sy"||attr == "sz"){
                    if(typeof value == "number"){
                        if(typeof attrs[attr] != "number"){
                            attrs[attr] = 1;
                        }
                        attrs[attr] = value*attrs[attr];
                    }
                }else if(typeof value == "number" && typeof attrs[attr] == "number"){
                    attrs[attr] += value;
                }else{
                    attrs[attr] = value;
                }
            }
            return attrs;
        };
        instance.spreadBy = function(radius){
            if(this.united) this.world.union(this).spreadBy(radius);
            var attrs = this.attrs;
            attrs.radius += typeof radius == "number" ? radius : 0;
            return this;
        };
        instance.spreadTo = function(radius){
            if(this.united) this.world.union(this).spreadTo(radius);
            var attrs = this.attrs;
            attrs.radius += typeof radius == "number" ? radius : attrs.radius;
            return this;
        };
        instance.moveTo = function(x,y,z){
            if(this.united) this.world.union(this).moveTo(x,y,z);
            var attrs = this.attrs;
            attrs.x = typeof x == "number" ? x : attrs.x;
            attrs.y = typeof y == "number" ? y : attrs.y;
            attrs.z = typeof z == "number" ? z : attrs.z;
            return this;
        };
        instance.moveBy = function(x,y,z){
            if(this.united) this.world.union(this).moveBy(x,y,z);
            x = typeof x == "number" ? x : 0;
            y = typeof y == "number" ? y : 0;
            z = typeof z == "number" ? z : 0;
            var attrs = this.attrs;
            attrs.x += x;
            attrs.y += y;
            attrs.z += z;
            return this;
        };
        instance.rotateTo = function(rx,ry,rz){
            if(this.united) this.world.union(this).rotateTo(rx,ry,rz);
            var attrs = this.attrs;
            attrs.rx = typeof rx == "number" ? rx : attrs.rx;
            attrs.ry = typeof ry == "number" ? ry : attrs.ry;
            attrs.rz = typeof rz == "number" ? rz : attrs.rz;
            return this;
        };
        instance.rotateBy = function(rx,ry,rz){
            if(this.united) this.world.union(this).rotateBy(rx,ry,rz);
            rx = typeof rx == "number" ? rx : 0;
            ry = typeof ry == "number" ? ry : 0;
            rz = typeof rz == "number" ? rz : 0;
            var attrs = this;
            attrs.rx += rx;
            attrs.ry += ry;
            attrs.rz += rz;
            return this;
        };
        instance.colorTo = function(r,g,b,a){
            if(this.united) this.world.union(this).colorTo(r,g,b,a);
            var attrs = this.attrs;
            attrs.r = typeof r == "number" ? r : attrs.r;
            attrs.g = typeof g == "number" ? g : attrs.g;
            attrs.b = typeof b == "number" ? b : attrs.b;
            attrs.a = typeof a == "number" ? a : attrs.a;

            return this;
        };
        instance.colorBy = function(r,g,b,a){
            if(this.united) this.world.union(this).colorBy(r,g,b,a);
            var attrs = this.attrs;
            attrs.r += typeof r == "number" ? r : 0;
            attrs.g += typeof g == "number" ? g : 0;
            attrs.b += typeof b == "number" ? b : 0;
            attrs.a += typeof a == "number" ? a : 0;
            return this;
        };
        instance.unite = function(point){
            if(point instanceof Point){
                this.world.unite(this, point);
            }
            return this;
        };
        instance.lineTo = function(point){
            if(point instanceof Point){
                this.world.line(this, point);
            }
            return this;
        };
        instance.triangle = function(a,b){
            if(a instanceof Point && b instanceof Point){
                this.world.triangle(this, a, b);
            }
            return this;
        };
        instance.render = function(parent){
            var attrs = this.getAttrs(parent);
            var ax = attrs.x;
            var ay = attrs.y;
            var az = attrs.z;
            var bx,by,bz;
            // Rotate z
            bx = ((attrs.x * Math.cos((Math.PI*2) * attrs.rz))) - (attrs.y * Math.sin((Math.PI*2) * attrs.rz));
            by = ((attrs.x * Math.sin((Math.PI*2) * attrs.rz))) + (attrs.y * Math.cos((Math.PI*2) * attrs.rz));
            ax=bx;
            ay=by;
            // Rotate y
            bx = ((ax * Math.cos((Math.PI*2) * attrs.ry))) + (az * Math.sin((Math.PI*2) * attrs.ry));
            bz = - ((ax * Math.sin((Math.PI*2) * attrs.ry))) + (az * Math.cos((Math.PI*2) * attrs.ry));
            ax=bx;
            az=bz;
            //Rotate z
            by = ((ay * Math.cos((Math.PI*2) * attrs.rx))) - (az * Math.sin((Math.PI*2) * attrs.rx));
            bz = ((ay * Math.sin((Math.PI*2) * attrs.rx))) + (az * Math.cos((Math.PI*2) * attrs.rx));
            ay=by;
            az=bz;
            attrs.x = ax*attrs.sx;
            attrs.y = ay*attrs.sy;
            attrs.z = az*attrs.sz;
            return [attrs];
        };
        instance.renderer = function(parent){
            var self = this;
            return function(){
                return self.render(parent);
            }
        };
    })(Point.prototype);

    this.Point = Point;

}).call(this, this);