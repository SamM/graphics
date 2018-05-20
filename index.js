var Variable, createElement, _, require, bold, print,output,attributes;

require.onDone = function(loaded){
    attributes = {
        id: "page"
    };
    if(typeof _ == "function"){
        attributes = _(attributes);

        attributes = attributes();
    }
    if(typeof createElement == "function"){
        output = createElement('div', attributes);
        bold = function(text){
            createElement('strong', {innerHTML: text, style: {'padding': '2px'}}, output);
        }
        print = function(text){
            createElement('span', {innerHTML: text}, output);
        }
        printLine = function(text){
            createElement('div', {innerHTML: text}, output);
        }
        boldLine = function(text){
            createElement('strong', { innerHTML: text, style: {display: "block", 'padding': '4px'} }, output);
        }
        var style = {};
        padding = function(){
            var self = this;
            if(typeof arguments[0] == "object" && arguments[0]!==null){
                return padding.apply(arguments[0], [].slice.call(arguments, 1));
            }
            _(this)({padding: [].slice.call(arguments).join(' ')})
        }
        style.padding = padding;
        
        var heading = createElement('h1', {style:{color: "hsla(120, 60%, 50%, 1)", backgroundColor: "hsla(120, 60%, 50%, 0.2)"}, innerHTML: "Load Complete!"}, output);
        padding(heading.style, "6px")

        style.padding(output.style, "10px")
        
    }else{
        bold = function(variable){
            console.log(variable.toString());
        }
    }
    
    if(typeof _ == "function"){
        
        
        boldLine(_("function (createElement) loaded")());
        boldLine(_("function (Variable Class) & alias (_) loaded")());
    }

    output.innerHTML+=document.body.innerHTML
    document.body.innerHTML = "";
    document.body.appendChild(output);

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
require("elements.js", "Executables.js", "Variable2.js", "graphics/Gradient.js", "graphics/Selection.js", function(){console.log("All Scripts Are Loaded")}, function(script){
    console.log("error loading script", script.src)
});