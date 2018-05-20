var Fill, Shape, Point, require;
(function(){
    function construct(){
        Fill = function(attrs, points, center){
            if(this == window){
                return new Fill(attrs, points);
            }
            var shape = this;
            function drawFill(vertices, parent){
                var points = [];
                var a, b;
                var d,xyd,xd,yd,zd;
                var attrs = shape.getAttrs();
                if(typeof center != "object"){
                    var avg = {
                        x: [],
                        y: [],
                        z: [],
                        radius: [],
                        r: [],
                        g: [],
                        b: [],
                        a: [],
                        rx: [],
                        ry: [],
                        rz: [],
                        sx: [],
                        sy: [],
                        sz: []
                    };
                    for(var i = 0; i<vertices.length; i++){
                        a = vertices[i];
                        if(typeof a.x != "undefined")avg.x.push(a.x);
                        if(typeof a.y != "undefined")avg.y.push(a.y);
                        if(typeof a.z != "undefined")avg.z.push(a.z);
                        if(typeof a.radius != "undefined")avg.radius.push(a.radius);
                        if(typeof a.r != "undefined")avg.r.push(a.r);
                        if(typeof a.g != "undefined")avg.g.push(a.g);
                        if(typeof a.b != "undefined")avg.b.push(a.b);
                        if(typeof a.a != "undefined") avg.a.push(a.a);
                        if(typeof a.rx != "undefined")avg.rx.push(a.rx);
                        if(typeof a.ry != "undefined")avg.ry.push(a.ry);
                        if(typeof a.rz != "undefined")avg.rz.push(a.rz);
                        if(typeof a.sx != "undefined")avg.sx.push(a.sx);
                        if(typeof a.sy != "undefined")avg.sy.push(a.sy);
                        if(typeof a.sz != "undefined")avg.sz.push(a.sz);
                    }
                    for(var attr in avg){
                        var total = 0;
                        for(var i=0; i<avg[attr].length; i++){
                            total += avg[attr][i];
                        }
                        avg[attr] = total/avg[attr].length;
                    }
                    center = avg;
                }
                for(var i = 0; i<vertices.length; i++){
                    a = vertices[i];
                    b = center;
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
                points.push(center);
                //console.log("Points in fill:", points.length)
                return points;
            }
            Gradient.call(this, attrs, points, drawFill);
        };
    }
    if(typeof Shape != "function"){
        if(typeof require == "function"){
            require('graphics/Point.js', 'graphics/Shape.js', construct);
        }else{
            throw "Missing required file Shape.js and no require function avaiable";
        }
    }else{
        construct();
    }
})();