(function(scope){

    var Flatten = function(){
        function flatten(array){
            var flat = [];
            for(var i=0; i<array.length; i++){
                if(Array.isArray(array[i])){
                    flat = flat.concat(flatten(array[i]));
                }else{
                    flat.push(array[i]);
                }
            }
            return flat;
        }
        return flatten(Array.prototype.slice.call(arguments));
    };

    /*/
    /// WebGL
    /*/
    var WebGL = function(canvas){
        if(this == window){
            return new WebGL(canvas);
        }
        this.canvas = canvas ? canvas: document.createElement('canvas');
        if(!WebGL.checkCompatibility(this.canvas)){
            throw new Error("WebGL is not supported by this browser.");
        }
        this.context = null;
        this.newContext();
    };
    WebGL.checkCompatibility = function(canvas){
        var canvas = canvas ? canvas : document.createElement('canvas');
        return !!canvas.getContext('webgl');;
    }
    WebGL.pointsToVertices = function(points){
        var vertices = [];
        points.forEach(function(point){
            if(typeof point == "object"){
                vertices.push(point.x);
                vertices.push(point.y);
                vertices.push(point.z);
            }
        });
        return vertices;
    };
    WebGL.pointsFromWorld = function(rendering, world){
        var points = [];
        if(world instanceof World){
            var triangles = Flatten(world.triangles);
            for(var i=0; i<triangles.length-2; i+=3){
                if(triangles[i] instanceof Point && triangles[i+1] instanceof Point && triangles[i+2] instanceof Point){
                    points.push(rendering[world.points.indexOf(triangles[i+0])]);
                    points.push(rendering[world.points.indexOf(triangles[i+1])]);
                    points.push(rendering[world.points.indexOf(triangles[i+2])]);
                }
            }
        }
        return points;
    };
    WebGL.pointsToIndexes = function(points, triangles){
        var indexes = [];
        if(Array.isArray(triangles)){
            triangles = Flatten(triangles);
            for(var i=0; i<triangles.length-2; i+=3){
                if(triangles[i] instanceof Point && triangles[i+1] instanceof Point && triangles[i+2] instanceof Point){
                    var triangle = [points.indexOf(triangles[i+0]), points.indexOf(triangles[i+1]), points.indexOf(triangles[i+2])]
                    indexes = indexes.concat(triangle);
                }
            }
        }else{
            points.forEach(function(point, i){
                if(typeof point == "object"){
                    indexes.push(i);
                }
            });
        }
        return indexes;
    };
    WebGL.pointsToColors = function(points){
        var colors = [];
        points.forEach(function(point){
            if(typeof point == "object"){
                var r = point.r/255;
                var g = point.g/255;
                var b = point.b/255;
                colors.push(Math.min(r, 1));
                colors.push(Math.min(g, 1));
                colors.push(Math.min(b, 1));
                colors.push(Math.min(point.a, 1));
            }
        });
        return colors;
    }
    WebGL.VertexShaders = {};
    WebGL.VertexShaders.Standard =
    'attribute vec3 coordinates;' +
    'attribute vec4 aVertexColor;' +
    'varying lowp vec4 vColor;' +
    'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        ' vColor = aVertexColor;' +
    '}';
    WebGL.VertexShaders.Mozilla = 'attribute vec4 aVertexPosition;' +
    'attribute vec4 aVertexColor;' +
    'uniform mat4 uModelViewMatrix;' +
    'uniform mat4 uProjectionMatrix;' +
    'varying lowp vec4 vColor;' +
    'void main(void) {' +
    '  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;'+
    '  vColor = aVertexColor;' +
    '}';

    WebGL.FragmentShaders = {};
    WebGL.FragmentShaders.fromRGBA = function(r,g,b,a){
        r = typeof r == "number" ? r : 0;
        g = typeof g == "number" ? g : 0;
        b = typeof b == "number" ? b : 0;
        a = typeof a == "number" ? a : 0;
        function s(v){
            v = Math.abs(v);
            v = (v>1?v%1:v).toString();
            var i = v.indexOf('.');
            if(i>-1){
                return v.slice(0, i+2);
            }else{
                return v+".0";
            }
        }
        return 'void main(void) {' +
            'gl_FragColor = vec4('+s(r)+', '+s(r)+', '+s(r)+', '+s(r)+');' +
        '}';
    };
    WebGL.FragmentShaders.Multicolored = 'varying lowp vec4 vColor;' +
    'void main(void) {' +
        'gl_FragColor = vColor;'+
    '}';
    WebGL.FragmentShaders.White =
    'void main(void) {' +
    'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
    '}';
    WebGL.FragmentShaders.Black =
    'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' +
    '}';
    WebGL.FragmentShaders.Black =
    'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' +
    '}';
    WebGL.FragmentShaders.Black =
    'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' +
    '}';

    /*/
    /// WebGL.prototype
    /*/
    WebGL.prototype.newContext = function(){
        var gl = this.canvas.getContext('webgl');
        this.context = gl;
        return gl;
    };
    WebGL.prototype.createVertexBuffer = function(vertices){
        
        var gl = this.context;
        // Create an empty buffer object
        var vertex_buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
        // Pass the vertex data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vertex_buffer;
    };
    WebGL.prototype.createColorBuffer = function(colors){
        
        var gl = this.context;
        // Create an empty buffer object
        var colorBuffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    
        // Pass the color data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return colorBuffer;
    };

    WebGL.prototype.loadVertexShader = function(source){
        if(typeof source != "string"){
            source = WebGL.VertexShaders.Standard;
        }
        var gl = this.context;
        return this.loadShader(gl.VERTEX_SHADER, source);
    }
    WebGL.prototype.loadShader = function(type, source){
        var gl = this.context;

        // Create fragment shader object
        var shader = gl.createShader(type);

        // Attach fragment shader source code
        gl.shaderSource(shader, source);

        // Compile the fragmentt shader
        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    };
    WebGL.prototype.loadFragmentShader = function(source){
        if(typeof source != "string"){
            source = WebGL.FragmentShaders.Black;
        }
        var gl = this.context;
        return this.loadShader(gl.FRAGMENT_SHADER, source);
    }
    WebGL.prototype.createShaderProgram = function(vertShader, fragShader){
        var gl = this.context;
        // Create a shader program object to store
        // the combined shader program
        var shaderProgram = gl.createProgram();

        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader);

        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader);

        // Link both the programs
        gl.linkProgram(shaderProgram);

        return shaderProgram;
    }
    WebGL.prototype.enableCoordinates = function(shaderProgram){
        var gl = this.context;
        // Get the attribute location
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");

        // Point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        // Enable the attribute
        gl.enableVertexAttribArray(coord);
        return coord;
    }
    WebGL.prototype.enableVertexColor = function(shaderProgram){
        var gl = this.context;
        // Get the attribute location
        var vertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");

        // Point an attribute to the currently bound VBO
        gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

        // Enable the attribute
        gl.enableVertexAttribArray(vertexColor);
        return vertexColor;
    }
    WebGL.prototype.bindBuffer = function(buffer){
        var gl = this.context;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        return this;
    };
    WebGL.prototype.clear = function(r,g,b,a){
        r = typeof r == "number" ? r : 0;
        g = typeof g == "number" ? g : 0;
        b = typeof b == "number" ? b : 0;
        a = typeof a == "number" ? a : 0;
        var gl = this.context;
        gl.clearColor(r,g,b,a);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return this;
    }
    WebGL.prototype.setViewport = function(x,y,w,h){
        var gl = this.context;
        gl.viewport(typeof x== "number"?x:0, typeof y== "number"?y:0, typeof w== "number"?w:this.canvas.width, typeof h== "number"?h:this.canvas.height);
        return this;
    };
    WebGL.prototype.createIndexBuffer = function(indexes){
        var gl = this.context;

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);

        return indexBuffer;
    }
    WebGL.prototype.drawShape = function(shape, offset, draw_method){
        if(typeof offset == "string"){
            draw_method = offset;
            offset = {};
        }
        var available_methods = "POINTS, LINE_STRIP, LINE_LOOP, LINES, TRIANGLE_STRIP, TRIANGLE_FAN, TRIANGLES".split(', ');
        if(typeof draw_method !== "string" || available_methods.indexOf(draw_method) < 0){
            draw_method = available_methods[0];
        }

        /// Load points from shape and offset
        var points, vertices, colors, indexes;
        var lines = [];
        if(shape instanceof World){
            points = shape.render(offset);
            points = WebGL.pointsFromWorld(points, shape);
        }else if(Array.isArray(shape)){
            points = Shape.flatten(shape, offset);
        }else if(shape !== null && typeof shape == "object" && typeof shape.render == "function"){
            points = shape.render(offset);
        }else{
            points = [];
            vertices = [];
            colors = [];
            indexes = [];
        }
        vertices = WebGL.pointsToVertices(points);
        colors = WebGL.pointsToColors(points);
        indexes = WebGL.pointsToIndexes(points);
        
        var gl = this.newContext();

        var vertBuffer = this.createVertexBuffer(vertices);
        var colorBuffer = this.createColorBuffer(colors);
        var indexBuffer = this.createIndexBuffer(indexes);

        var vertShader = this.loadVertexShader();
        var fragShader = this.loadFragmentShader(WebGL.FragmentShaders.Multicolored);
        var shaderProgram = this.createShaderProgram(vertShader, fragShader);

        // Bind vertex buffer object
        this.bindBuffer(vertBuffer);
        this.enableCoordinates(shaderProgram);
        this.bindBuffer(colorBuffer);
        this.enableVertexColor(shaderProgram);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.useProgram(shaderProgram);

        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        this.setViewport();

        gl.drawElements(gl[draw_method], points.length, gl.UNSIGNED_SHORT, 0);

        return this;
    };
    WebGL.prototype.drawPoints = function(shape, offset){
        this.drawShape(shape, offset, "POINTS");
        return this;
    };
    WebGL.prototype.drawLines = function(shape, offset){
        this.drawShape(shape, offset, "LINES");
        return this;
    };
    WebGL.prototype.drawLineStrip = function(shape, offset){
        this.drawShape(shape, offset, "LINE_STRIP");
        return this;
    };
    WebGL.prototype.drawLineLoop = function(shape, offset){
        this.drawShape(shape, offset, "LINE_LOOP");
        return this;
    };
    WebGL.prototype.drawTriangles = function(shape, offset){
        this.drawShape(shape, offset, "TRIANGLES");
        return this;
    };
    WebGL.prototype.drawTriangleStrip = function(shape, offset){
        this.drawShape(shape, offset, "TRIANGLE_STRIP");
        return this;
    };
    WebGL.prototype.drawTriangleFan = function(shape, offset){
        this.drawShape(shape, offset, "TRIANGLE_FAN");
        return this;
    };

    this.WebGL = WebGL;

}).call(this, this);
