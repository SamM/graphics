var requirements = [
    "elements.js", "Executables.js", 
    "graphics/Point.js", "graphics/Shape.js", 
    "graphics/Gradient.js", "graphics/Selection.js",
    "graphics/Canvas.js", "graphics/Drawing.js",
    "graphics/Line.js", "graphics/Fill.js", "graphics/WebGL.js"
];
require(requirements);
require.onDone = function(loaded){
    console.log("Loaded "+loaded.length+" files using require function...");
    function makeAllExecutables(parentElement){
        if(isElement(parentElement)){
            if(parentElement.tagName == "EXEC" || parentElement.tagName == "VAR"){
                makeExecutable(parentElement);
            }
            if(parentElement.children.length){
                for(var i=0; i<parentElement.children.length; i++){
                    makeAllExecutables(parentElement.children[i]);
                }
            }
        }
    }
    makeAllExecutables(document.body)
};