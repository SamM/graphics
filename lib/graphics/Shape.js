var Shape, Point, require;
(function(){
    function construct(){
        Shape = function(attrs, children){
            if(this == window){
                return new Shape(attrs,children);
            }
            Point.call(this, attrs);
            this.children = Array.isArray(children)?children:[];
            this.render = function(parent){
                return Shape.flatten(this.children, parent);
            };
        };
        Shape.flatten = function(shape, parent){
            var children = 
                Array.isArray(shape)?
                    shape:
                    typeof shape == "object" && shape !== null?
                [shape] : [];

            var attrs = typeof shape.attrs == "object" ? shape.getAttrs(parent) : typeof parent == "object" ? typeof parent.attrs == "object"?parent.attrs:parent:{};

            var output = [];
            for(var i=0; i<children.length; i++){
                if(Array.isArray(children[i])){
                    output = output.concat(Shape.flatten(children[i], attrs));
                }else if(typeof children[i] == "object" && children[i] !== null){
                    if(typeof children[i].render == "function"){
                        output = output.concat(children[i].render(attrs))
                    }else{
                        output.push(children[i]);
                    }
                }
            }
            return output;
        }
    }

    if(typeof Point == "undefined"){
        if(typeof require == "function"){
            require('graphics/Point.js', construct);
        }else{
            throw "Missing required file Point.js and no require function avaiable";
        }
    }else{
        construct();
    }
})();
