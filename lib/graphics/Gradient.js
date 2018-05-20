var Gradient, Shape, Point, require;
(function(){
    function construct(){
        Gradient = function(attrs, generate_input, generate_output){
            if(this == window){
                return new Gradient(attrs, generate_input, generate_output);
            }
            Shape.call(this, attrs, (typeof generate_input == "object" && generate_input !== null && typeof generate_input.render == 'function')?
            [generate_input]:typeof generate_input == "function"?
                generate_input():Array.isArray(generate_input)?
                    generate_input:[]);
            this.output = typeof generate_output == "function"?generate_output:Array.isArray(generate_output)?function(){return generate_output;}:function(input){ return input; };
            this.render = function(parent){
                var input = Shape.flatten(this.children, parent);
                var output = this.output(input, parent);
                return output;
            }
        };
    }
    if(typeof Shape == "undefined" || typeof Point == "undefined"){
        if(typeof require == "function"){
            require('graphics/Point.js', 'graphics/Shape.js', construct);
        }else{
            throw "Missing required file Shape.js and no require function avaiable";
        }
    }else{
        construct();
    }
})();