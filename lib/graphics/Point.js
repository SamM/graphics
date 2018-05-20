var Point;
Point = function(attrs){
    if(this == window){
        return new Point(attrs);
    }
    this.attrs = typeof attrs == "object" ? attrs : typeof this.attrs=="object"?this.attrs:{};
    this.attrs.radius = typeof this.attrs.radius == "number"? this.attrs.radius : 0.5;
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
    this.getAttrs = function(parent){
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
    this.moved = function(x,y,z){
        x = typeof x == "number" ? x : 0;
        y = typeof y == "number" ? y : 0;
        z = typeof z == "number" ? z : 0;
        var attrs = this.getAttrs();
        attrs.x += x;
        attrs.y += y;
        attrs.z += z;
        return new Point(attrs);
    };
    this.rotated = function(rx,ry,rz){
        rx = typeof rx == "number" ? rx : 0;
        ry = typeof ry == "number" ? ry : 0;
        rz = typeof rz == "number" ? rz : 0;
        var attrs = this.getAttrs();
        attrs.rx += rx;
        attrs.ry += ry;
        attrs.rz += rz;
        return new Point(attrs);
    };
    this.colored = function(r,g,b,a){
        var attrs = this.getAttrs();
        attrs.r = typeof r == "number" ? r : attrs.r;
        attrs.g = typeof g == "number" ? g : attrs.g;
        attrs.b = typeof b == "number" ? b : attrs.b;
        attrs.a = typeof a == "number" ? a : attrs.a;
        return new Point(attrs);
    }
    this.render = function(parent){
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
    this.renderer = function(parent){
        var self = this;
        return function(){
            return self.render(parent);
        }
    }
};