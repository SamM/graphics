var Drawing, Point, require;
(function(){
    function construct(){
        Drawing = function(width, height, radius, x, y, z, r,g,b,a){
            if(this == window){
                return new Drawing(width, height, radius, x, y, z, r,g,b,a);
            }
            var attrs = {};
            if(arguments.length == 1 && typeof arguments[0] == "object"){
                var input = arguments[0];
                this.width = typeof input.width == "number"?input.width:100;
                this.height = typeof input.height == "number"?input.height:100;
                this.x = typeof input.x == "number" ? input.x : this.width/2;
                this.y = typeof input.y == "number" ? input.y : this.height/2;
                this.z = typeof input.z == "number" ? input.z : 0;
                attrs = {
                    radius: typeof input.radius == "number"?input.radius:Math.min(this.width, this.height),
                    x: this.x,
                    y: this.y,
                    z: this.z,
                    r: typeof input.c == "string" ? input.r : 0,
                    g: typeof input.g == "string" ? input.g : 0,
                    b: typeof input.b == "string" ? input.b : 0,
                    a: typeof input.a == "string" ? input.a : 1
                };
            }else{
                this.width = typeof width == "number"?width:100;
                this.height = typeof height == "number"?height:100;
                x = typeof x == "number" ? x : 0;
                y = typeof y == "number" ? y : 0;
                z = typeof z == "number" ? z : 0;
                attrs = {
                    radius: typeof radius == "number"?radius:Math.min(width, height),
                    x: x,
                    y: y,
                    z: z,
                    r: typeof c == "string" ? r : 0,
                    g: typeof g == "string" ? g : 0,
                    b: typeof b == "string" ? b : 0,
                    a: typeof a == "string" ? a : 1
                };
            }
            Point.call(this, attrs);
            this.render = function(shape){
                var renderedShape = typeof shape == "object" && shape!== null && typeof shape.render == "function"?shape:Array.isArray(shape)?shape:[];
                renderedShape = Shape.flatten(renderedShape, this);
                renderedShape.sort(function(a,b){
                    if(typeof a.z == "number" && typeof b.z == "number"){
                        return a.z==b.z?a.radius==b.radius?a.x==b.x?a.y==b.y?0:a.y<b.y?-1:1:a.x<b.x?-1:1:a.radius<b.radius?-1:1:a.z<b.z?-1:1;
                    }else{
                        return 0;
                    }
                });
                var canvas = Canvas(this.width, this.height);
                var context = canvas.getContext('2d');
                context.save();
                context.translate(this.width/2, this.height/2);
                var point;
                for(var i=0; i<renderedShape.length; i++){
                    point = renderedShape[i];
                    context.beginPath();
                    context.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
                    context.closePath();
                    context.fillStyle = "rgba("+[point.r, point.g, point.b, point.a].join(',')+")";
                    context.fill();
                }
                context.restore();
                return canvas;
            };
        };
    }
    if(typeof Point != "function" || typeof Canvas != "function"){
        if(typeof require == "function"){
            require('graphics/Point.js', 'graphics/Canvas.js', construct);
        }else{
            throw "Missing required file Point.js or Canvas.js and no require function avaiable";
        }
    }else{
        construct();
    }
})();