var Line, Shape, Point, Gradient, require;
(function(){
    function construct(){
        Line = function(attrs, points){
            if(this == window){
                return new Line(attrs, points);
            }
            var line = this;
            function drawLine(vertices, parent){
                var points = [];
                var a, b;
                var d,xyd,xd,yd,zd;
                var attrs = Point.prototype.getAttrs.call(line);
                for(var i = 0; i<vertices.length; i++){
                    if(i==vertices.length-1){
                        if(vertices.length == 2){
                            points.push(vertices[i]);
                            break;
                        }
                        a = vertices[i];
                        b = vertices[0];
                    }else{
                        a = vertices[i];
                        b = vertices[i+1];
                    }
                    points.push(Point(a).getAttrs(attrs));
                    xd = b.x-a.x;
                    yd = b.y-a.y;
                    zd = b.z-a.z;
                    rd = b.r-a.r;
                    gd = b.g-a.g;
                    bd = b.b-a.b;
                    ad = b.a-a.a;
                    rxd = b.rx-a.rx;
                    ryd = b.ry-a.ry;
                    rzd = b.rz-a.rz;
                    sxd = b.sx-a.sx;
                    syd = b.sy-a.sy;
                    szd = b.sz-a.sz;
                    radiusd = b.radius-a.radius;
                    xyd = Math.sqrt(Math.pow(xd, 2)+Math.pow(yd, 2));
                    d = Math.sqrt(Math.pow(xyd, 2)+Math.pow(zd, 2));
                    avgRadius = ((a.radius + b.radius)/2);
                    var length = d/avgRadius;
                    var s;
                    var radius;
                    var p = 0;
                    for(var l = 1; l < length; l++){
                        s = l/length;
                        radius = a.radius + (radiusd*s);
                        p += ((radius-avgRadius)/length)/2;
                        points.push(Point({
                            radius: radius,
                            x: a.x + (xd*(s+p)),
                            y: a.y + (yd*(s+p)),
                            z: a.z + (zd*(s+p)),
                            r: a.r + (rd*s),
                            g: a.g + (gd*s),
                            b: a.b + (bd*s),
                            a: a.a + (ad*s),
                            rx: a.rx + (rxd*s),
                            ry: a.ry + (ryd*s),
                            rz: a.rz + (rzd*s),
                            sx: a.sx + (sxd*s),
                            sy: a.sy + (syd*s),
                            sz: a.sz + (szd*s)                            
                        }).getAttrs(attrs));
                    }
                }
                //console.log("Points on line:", points.length)
                return points;
            }
            Gradient.call(this, attrs, points, drawLine);
        };
    }
    if(typeof Shape != "function"){
        if(typeof require == "function"){
            require('graphics/Point.js', 'graphics/Shape.js', 'graphics/Gradient.js', construct);
        }else{
            throw "Missing required file Shape.js and no require function avaiable";
        }
    }else{
        construct();
    }
})();