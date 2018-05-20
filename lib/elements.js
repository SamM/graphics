//Returns true if it is a DOM node
function isNode(o){
    return (
        typeof Node === "object" ? o instanceof Node : 
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
}

//Returns true if it is a DOM element    
function isElement(o){
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

// Creates a new DOM element and sets attributes of it
function createElement(tag, attributes, parentEl){
    var el = document.createElement(tag);
    if(typeof attributes == "object"){
        if(typeof attributes.style == "object"){
            for(var attr in attributes.style){
                var value = attributes.style[attr];
                if(typeof value != "object" && typeof value != "function"){
                    el.style[attr] = attributes.style[attr]+"";
                }
            }
            delete attributes.style;
        }
        for(var attr in attributes){
            el[attr] = attributes[attr];
        }
    }
    if(isElement(parentEl)){
        parentEl.appendChild(el);
    }
    return el;
}