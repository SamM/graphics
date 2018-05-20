var Canvas;
Canvas = function(width, height, id){ 
    var canvas = document.createElement("canvas");
    if(typeof width == "number") canvas.height = height;
    if(typeof height == "number") canvas.width = width;
    if(typeof id == "string") canvas.id = id;
    return canvas;
}